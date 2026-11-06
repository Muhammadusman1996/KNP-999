import express from "express";
import http from "node:http";
import { Server as SocketServer } from "socket.io";
import Database from "better-sqlite3";
import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(__dirname,"..");
const app=express(),server=http.createServer(app),io=new SocketServer(server,{cors:{origin:false}});
const db=new Database(process.env.DB_PATH||path.join(root,"knp999.sqlite"));
db.pragma("journal_mode = WAL");
db.exec(`
CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY, username TEXT UNIQUE, mobile TEXT UNIQUE, email TEXT UNIQUE, password_hash TEXT, coins REAL NOT NULL DEFAULT 100, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS sessions(token_hash TEXT PRIMARY KEY,user_id TEXT NOT NULL,created_at TEXT DEFAULT CURRENT_TIMESTAMP,last_seen TEXT DEFAULT CURRENT_TIMESTAMP,ip TEXT,user_agent TEXT);
CREATE TABLE IF NOT EXISTS login_history(id INTEGER PRIMARY KEY AUTOINCREMENT,user_id TEXT,success INTEGER NOT NULL,identifier TEXT,ip TEXT,user_agent TEXT,created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS balance_requests(id TEXT PRIMARY KEY,user_id TEXT NOT NULL,amount REAL NOT NULL,status TEXT NOT NULL DEFAULT 'pending',note TEXT,created_at TEXT DEFAULT CURRENT_TIMESTAMP,reviewed_at TEXT);
CREATE TABLE IF NOT EXISTS ledger(id INTEGER PRIMARY KEY AUTOINCREMENT,user_id TEXT,delta REAL NOT NULL,reason TEXT NOT NULL,game_id INTEGER,round_id TEXT,created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS game_settings(game_id INTEGER PRIMARY KEY, enabled INTEGER NOT NULL DEFAULT 1, config TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS rounds(id TEXT PRIMARY KEY,user_id TEXT,game_id INTEGER,stake REAL,payout REAL,net REAL,result TEXT,created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS stake_options(amount INTEGER PRIMARY KEY, enabled INTEGER NOT NULL DEFAULT 1, sort_order INTEGER NOT NULL DEFAULT 0);
`);
app.use(express.json({limit:"100kb"}));
const defaultStakes=[10,20,50,100,200,500,1000,2000,5000,10000];
const stakeCount=db.prepare("SELECT COUNT(*) n FROM stake_options").get().n;
if(!stakeCount){const addStake=db.prepare("INSERT OR IGNORE INTO stake_options(amount,enabled,sort_order) VALUES(?,1,?)");defaultStakes.forEach((v,i)=>addStake.run(v,i));}

// Safe additive migrations for existing SQLite databases.
const userCols=db.prepare("PRAGMA table_info(users)").all().map(x=>x.name);
if(!userCols.includes("username")) db.exec("ALTER TABLE users ADD COLUMN username TEXT");
db.exec("CREATE UNIQUE INDEX IF NOT EXISTS users_username_unique ON users(username COLLATE NOCASE) WHERE username IS NOT NULL");
const games=JSON.parse(await (await import("node:fs/promises")).readFile(path.join(root,"src/data/games.json"),"utf8"));
const specs=JSON.parse(await (await import("node:fs/promises")).readFile(path.join(root,"src/data/game-specs.json"),"utf8"));
const getUser=db.prepare("SELECT * FROM users WHERE id=?");
const hashToken=t=>crypto.createHash("sha256").update(t).digest("hex");
const hashPassword=(password,salt=crypto.randomBytes(16).toString("hex"))=>({salt,hash:crypto.scryptSync(password,salt,64).toString("hex")});
const verifyPassword=(password,salt,hash)=>crypto.timingSafeEqual(Buffer.from(hashPassword(password,salt).hash,"hex"),Buffer.from(hash,"hex"));
const getOrCreate=id=>getUser.get(id);
const session=(req,res,next)=>{
  const raw=(req.header("authorization")||"").replace(/^Bearer\s+/i,"");
  if(!raw)return res.status(401).json({error:"Login required"});
  const row=db.prepare("SELECT user_id FROM sessions WHERE token_hash=?").get(hashToken(raw));
  if(!row)return res.status(401).json({error:"Session expired"});
  req.playerId=row.user_id;req.user=getUser.get(row.user_id);
  db.prepare("UPDATE sessions SET last_seen=CURRENT_TIMESTAMP WHERE token_hash=?").run(hashToken(raw));
  next();
};
const admin=(req,res,next)=>{const key=process.env.ADMIN_KEY;if(!key)return res.status(503).json({error:"Set ADMIN_KEY on the server before using admin controls"});if(req.header("x-admin-key")!==key)return res.status(403).json({error:"Admin authorization failed"});next();};
const settingsFor=id=>{const row=db.prepare("SELECT * FROM game_settings WHERE game_id=?").get(id);return row?{enabled:!!row.enabled,...JSON.parse(row.config)}:{enabled:true};};
for(const s of specs)db.prepare("INSERT OR IGNORE INTO game_settings(game_id,enabled,config) VALUES(?,1,?)").run(s.gameId,JSON.stringify({bonusEnabled:true,maintenance:false}));
app.get("/api/health",(req,res)=>res.json({ok:true,service:"KNP-999",games:games.length,mode:"virtual-coins"}));
const issueSession=(req,user)=>{const token=crypto.randomBytes(32).toString("hex");db.prepare("INSERT INTO sessions(token_hash,user_id,ip,user_agent) VALUES(?,?,?,?)").run(hashToken(token),user.id,req.ip,req.get("user-agent")||"");return {token,user:{id:user.id,username:user.username,mobile:user.mobile,email:user.email,coins:user.coins}};};
app.post("/api/auth/register",(req,res)=>{
  const mobile=String(req.body?.mobile||"").trim(),password=String(req.body?.password||"");
  if(!/^\+?[0-9]{10,15}$/.test(mobile)||password.length<8)
    return res.status(400).json({error:"درست موبائل نمبر اور کم از کم 8 حروف کا پاس ورڈ درج کریں"});
  if(db.prepare("SELECT id FROM users WHERE mobile=?").get(mobile))
    return res.status(409).json({error:"یہ موبائل نمبر پہلے سے رجسٹرڈ ہے۔ لاگ اِن کریں۔"});
  const id=crypto.randomUUID(),username="customer_"+crypto.randomUUID().replace(/-/g,"").slice(0,12),p=hashPassword(password);
  db.prepare("INSERT INTO users(id,username,mobile,email,password_hash,coins) VALUES(?,?,?,NULL,?,100)").run(id,username,mobile,p.salt+":"+p.hash);
  db.prepare("INSERT INTO ledger(user_id,delta,reason) VALUES(?,100,'Welcome coins')").run(id);
  const issued=issueSession(req,getUser.get(id));
  db.prepare("INSERT INTO login_history(user_id,success,identifier,ip,user_agent) VALUES(?,1,?,?,?)").run(id,mobile,req.ip,req.get("user-agent")||"");
  res.status(201).json(issued);
});
app.post("/api/auth/login",(req,res)=>{
  const mobile=String(req.body?.mobile||"").trim(),password=String(req.body?.password||"");
  const u=db.prepare("SELECT * FROM users WHERE mobile=?").get(mobile);
  let ok=false;
  if(u?.password_hash){const [salt,hash]=u.password_hash.split(":");try{ok=verifyPassword(password,salt,hash);}catch{}}
  if(u)db.prepare("INSERT INTO login_history(user_id,success,identifier,ip,user_agent) VALUES(?,?,?,?,?)").run(u.id,ok?1:0,mobile,req.ip,req.get("user-agent")||"");
  if(!ok)return res.status(401).json({error:"موبائل نمبر یا پاس ورڈ غلط ہے۔"});
  res.json(issueSession(req,u));
});
app.get("/api/auth/me",session,(req,res)=>res.json({user:{id:req.user.id,username:req.user.username,mobile:req.user.mobile,email:req.user.email,coins:req.user.coins}}));
app.post("/api/auth/logout",session,(req,res)=>{db.prepare("DELETE FROM sessions WHERE token_hash=?").run(hashToken((req.header("authorization")||"").replace(/^Bearer\s+/i,"")));res.json({ok:true});});
app.get("/api/games",(req,res)=>res.json(games.map(g=>({...g,serverSettings:settingsFor(g.id)}))));
app.get("/api/stakes",(req,res)=>res.json({stakes:db.prepare("SELECT amount FROM stake_options WHERE enabled=1 ORDER BY sort_order,amount").all().map(x=>x.amount)}));
app.get("/api/wallet",session,(req,res)=>res.json({coins:req.user.coins,ledger:db.prepare("SELECT delta,reason,game_id,round_id,created_at FROM ledger WHERE user_id=? ORDER BY id DESC LIMIT 100").all(req.playerId)}));
app.post("/api/balance-requests",session,(req,res)=>{const amount=Number(req.body?.amount),note=String(req.body?.note||"").slice(0,240);if(!Number.isFinite(amount)||amount<10||amount>1000000)return res.status(400).json({error:"کم از کم 10 اور زیادہ سے زیادہ 1,000,000 کوائنز کی درخواست دیں"});const id=crypto.randomUUID();db.prepare("INSERT INTO balance_requests(id,user_id,amount,note) VALUES(?,?,?,?)").run(id,req.playerId,amount,note);res.status(201).json({ok:true,id,status:"pending",message:"بیلنس درخواست ایڈمن کو بھیج دی گئی ہے"});});
app.get("/api/balance-requests",session,(req,res)=>res.json({requests:db.prepare("SELECT id,amount,status,note,created_at,reviewed_at FROM balance_requests WHERE user_id=? ORDER BY created_at DESC LIMIT 50").all(req.playerId)}));
app.get("/api/history",session,(req,res)=>{const rows=db.prepare("SELECT * FROM rounds WHERE user_id=? ORDER BY created_at DESC LIMIT 200").all(req.playerId);res.json({rounds:rows.map(r=>({...r,game_name:games.find(g=>g.id===r.game_id)?.name||"Game"}))});});
app.post("/api/round",session,(req,res)=>{
  const {gameId,stake,action,choice}=req.body||{},g=games.find(x=>x.id===Number(gameId)),s=specs.find(x=>x.gameId===Number(gameId));
  if(!g||!s)return res.status(404).json({error:"Game not found"});
  const cfg=settingsFor(g.id);if(!cfg.enabled||cfg.maintenance)return res.status(423).json({error:"This game is temporarily unavailable"});
  const amount=Number(stake);if(!Number.isFinite(amount)||amount<1||amount>100000)return res.status(400).json({error:"Invalid coin stake"});
  const u=getOrCreate(req.playerId);if(u.coins<amount)return res.status(409).json({error:"Insufficient coins"});
  // The server, not the browser, generates this virtual-coin result.
  let multiplier=0,result={};const rand=n=>crypto.randomInt(0,n);
  switch(g.engine){
    case "slot": {const a=[rand(7),rand(7),rand(7)];multiplier=a.every(x=>x===a[0])?12:new Set(a).size===2?2:0;result={symbols:a};break;}
    case "crash": {const crashAt=1.1+rand(500)/100;const cash=Number(choice?.cashout||1);multiplier=cash>1&&cash<crashAt?cash:0;result={crashAt,cashout:cash};break;}
    case "plinko": {const p=[.2,.5,1,2,5,2,1,.5,.2];multiplier=p[rand(p.length)];result={slot:p.indexOf(multiplier)};break;}
    case "wheel": {const p=[0,.5,1,2,3,5];multiplier=p[rand(p.length)];result={segment:multiplier};break;}
    case "dice": {const a=rand(6)+1,b=rand(6)+1,total=a+b;const c=String(choice||"low");multiplier=(c==="low"&&total<=6)||(c==="high"&&total>=8)?2:c==="seven"&&total===7?5:0;result={dice:[a,b],total,choice:c};break;}
    case "fishing": multiplier=rand(100)>38?1+rand(4):0;result={hit:multiplier>0};break;
    case "arcade": multiplier=rand(2)?2:0;result={score:multiplier?10:0};break;
    case "puzzle": multiplier=choice?.correct?2:0;result={correct:!!choice?.correct};break;
    default: multiplier=rand(2)?2:0;result={practiceOutcome:multiplier>0?"win":"no-win"};
  }
  const payout=Math.round(amount*multiplier*100)/100,delta=payout-amount,roundId=crypto.randomUUID();
  const tx=db.transaction(()=>{db.prepare("UPDATE users SET coins=coins+? WHERE id=?").run(delta,req.playerId);db.prepare("INSERT INTO ledger(user_id,delta,reason) VALUES(?,?,?)").run(req.playerId,delta,`game:${g.id}:${g.name}`);db.prepare("INSERT INTO rounds(id,user_id,game_id,stake,payout,net,result) VALUES(?,?,?,?,?,?,?)").run(roundId,req.playerId,g.id,amount,payout,delta,JSON.stringify(result));});
  tx();const updated=getUser.get(req.playerId);res.json({roundId,gameId:g.id,stake:amount,multiplier,payout,coins:updated.coins,result});
});
app.get("/api/admin/users",admin,(req,res)=>{const users=db.prepare("SELECT id,username,coins FROM users ORDER BY created_at DESC").all();res.json(users);});
app.get("/api/admin/balance-requests",admin,(req,res)=>res.json(db.prepare("SELECT r.id,r.user_id,u.username,r.amount,r.note,r.status,r.created_at FROM balance_requests r JOIN users u ON u.id=r.user_id WHERE r.status='pending' ORDER BY r.created_at ASC").all()));
app.post("/api/admin/balance-requests/:id/approve",admin,(req,res)=>{const r=db.prepare("SELECT * FROM balance_requests WHERE id=? AND status='pending'").get(req.params.id);if(!r)return res.status(404).json({error:"Pending request not found"});const tx=db.transaction(()=>{db.prepare("UPDATE users SET coins=coins+? WHERE id=?").run(r.amount,r.user_id);db.prepare("INSERT INTO ledger(user_id,delta,reason) VALUES(?,?,?)").run(r.user_id,r.amount,"Approved customer balance request");db.prepare("UPDATE balance_requests SET status='approved',reviewed_at=CURRENT_TIMESTAMP WHERE id=?").run(r.id);});tx();res.json({ok:true,coins:getUser.get(r.user_id).coins});});
app.post("/api/admin/users/:id/reset-password",admin,(req,res)=>{const password=String(req.body?.password||"");if(password.length<8)return res.status(400).json({error:"نیا پاس ورڈ کم از کم 8 حروف کا ہونا چاہیے"});const u=getUser.get(req.params.id);if(!u)return res.status(404).json({error:"Customer not found"});const p=hashPassword(password);db.prepare("UPDATE users SET password_hash=? WHERE id=?").run(p.salt+":"+p.hash,u.id);res.json({ok:true,message:"Password securely reset"});});
app.post("/api/admin/users/:id/coins",admin,(req,res)=>{
 const amount=Number(req.body?.amount);if(!Number.isFinite(amount)||amount<=0||amount>1000000)return res.status(400).json({error:"Invalid coin amount"});
 const u=getUser.get(req.params.id);if(!u)return res.status(404).json({error:"Customer not found"});
 const tx=db.transaction(()=>{db.prepare("UPDATE users SET coins=coins+? WHERE id=?").run(amount,u.id);db.prepare("INSERT INTO ledger(user_id,delta,reason) VALUES(?,?,?)").run(u.id,amount,"Admin coin credit");});tx();
 res.json({ok:true,coins:getUser.get(u.id).coins});
});
app.get("/api/admin/games",admin,(req,res)=>res.json(games.map(g=>({...g,settings:settingsFor(g.id)}))));
app.patch("/api/admin/games/:id",admin,(req,res)=>{const id=Number(req.params.id);if(!games.some(g=>g.id===id))return res.status(404).json({error:"Game not found"});const current=settingsFor(id),next={...current,...req.body};db.prepare("INSERT INTO game_settings(game_id,enabled,config) VALUES(?,?,?) ON CONFLICT(game_id) DO UPDATE SET enabled=excluded.enabled,config=excluded.config").run(id,next.enabled?1:0,JSON.stringify({bonusEnabled:!!next.bonusEnabled,maintenance:!!next.maintenance}));io.emit("game:settings",{gameId:id,settings:settingsFor(id)});res.json({ok:true,settings:settingsFor(id)});});
app.get("/api/admin/stakes",admin,(req,res)=>res.json({stakes:db.prepare("SELECT amount,enabled FROM stake_options ORDER BY sort_order,amount").all()}));
app.put("/api/admin/stakes",admin,(req,res)=>{
 const values=Array.isArray(req.body?.stakes)?req.body.stakes:[];
 const clean=[...new Set(values.map(Number).filter(n=>Number.isInteger(n)&&n>=1&&n<=100000))].sort((a,b)=>a-b);
 if(!clean.length)return res.status(400).json({error:"کم از کم ایک درست Stake amount ضروری ہے"});
 const tx=db.transaction(()=>{db.prepare("DELETE FROM stake_options").run();const ins=db.prepare("INSERT INTO stake_options(amount,enabled,sort_order) VALUES(?,1,?)");clean.forEach((v,i)=>ins.run(v,i));});
 tx();res.json({ok:true,stakes:clean});
});
app.get("/api/admin/summary",admin,(req,res)=>res.json({players:db.prepare("SELECT COUNT(*) n FROM users").get().n,rounds:db.prepare("SELECT COUNT(*) n FROM rounds").get().n,coins:db.prepare("SELECT COALESCE(SUM(coins),0) n FROM users").get().n}));
io.on("connection",socket=>{
  socket.on("room:join",({gameId,playerName}={})=>{const g=games.find(x=>x.id===Number(gameId));if(!g)return;const room=`game-${g.id}`;socket.join(room);socket.data.gameId=g.id;socket.data.playerName=String(playerName||"Player").slice(0,24);io.to(room).emit("room:players",{gameId:g.id,count:io.sockets.adapter.rooms.get(room)?.size||1});});
  socket.on("room:message",({message}={})=>{const id=socket.data.gameId;if(!id)return;io.to(`game-${id}`).emit("room:message",{playerName:socket.data.playerName||"Player",message:String(message||"").slice(0,180)});});
  socket.on("disconnect",()=>{const id=socket.data.gameId;if(id)io.to(`game-${id}`).emit("room:players",{gameId:id,count:io.sockets.adapter.rooms.get(`game-${id}`)?.size||0});});
});
app.use(express.static(path.join(root,"dist")));
app.get("*",(req,res)=>res.sendFile(path.join(root,"dist","index.html")));
const port=Number(process.env.PORT||3000);server.listen(port,()=>console.log(`KNP-999 server listening on ${port}`));
