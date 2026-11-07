import { settleVirtualRound, getGameHistory, getServerWallet } from "../services/server.js";
import { installGameFeel } from "./game-feel.js";
// Independent KNP-999 game module: european-roulette (ID 178)
// This game has its own home screen, theme, rules, controls and play logic.
// Virtual coins only; no cash value or cash-out.
const GAME = {
  id:178, name:"European Roulette", category:"Wheel", engine:"wheel",
  colors:{"background": "#12243a", "accent": "#4da9ff", "highlight": "#9be7ff"}, logo:"/game-logos/european-roulette.webp", symbols:["🎡", "🔴", "⚫"],
  multiplier:5, bonus:3,
  description:"Choose a number or color and spin the virtual roulette wheel."
};
const BETS=[10,20,50,100,200,500,1000,2000,5000,10000];
const fmt=n=>Number(n).toLocaleString(undefined,{maximumFractionDigits:2});
const pick=a=>a[Math.floor(Math.random()*a.length)];
const ENGINE_RULES = {
  slot:"تین ریل گھمائیں۔ تین یکساں نشان بڑا انعام دیتے ہیں؛ دو یکساں نشان جزوی انعام دیتے ہیں۔ مخصوص نشان بونس اسپن کھول سکتا ہے۔",
  crash:"راؤنڈ شروع کریں اور کریش سے پہلے CASH OUT کریں۔ کریش کے بعد کیش آؤٹ ممکن نہیں۔",
  wheel:"وہیل گھمائیں؛ منتخب ملٹی پلائر شرط سے ضرب ہو کر ورچوئل نتیجہ دیتا ہے۔",
  fishing:"ہدف منتخب کریں اور FIRE کریں؛ ہدف کے حساب سے ملٹی پلائر مختلف ہو سکتا ہے۔",
  dice:"LOW، SEVEN یا HIGH منتخب کریں؛ دو ڈائس کے مجموعے سے نتیجہ طے ہوتا ہے۔",
  puzzle:"پیٹرن یاد رکھیں اور درست ترتیب/جواب دے کر راؤنڈ مکمل کریں۔",
  arcade:"کنٹرولز سے اہداف پر کھیلیں اور راؤنڈ کے دوران اسکور بنائیں۔",
  steps:"ہر مرحلے میں انتخاب کریں؛ محفوظ انتخاب سے اگلے مرحلے تک پہنچیں۔",
  plinko:"ڈسک چھوڑیں؛ نیچے کا خانہ آپ کا ورچوئل ملٹی پلائر طے کرتا ہے۔",
  blackjack:"کارڈز کی مجموعی قدر 21 کے قریب رکھیں؛ 21 سے اوپر بَسٹ ہے۔",
  rummy:"کارڈز سے سیٹ یا ترتیب بنائیں؛ دستیاب راؤنڈ کے قواعد لاگو ہوتے ہیں۔",
  poker:"پانچ کارڈز سے بہترین ممکنہ ہاتھ بنانے کی کوشش کریں۔",
  card:"کارڈز تقسیم ہونے کے بعد انتخاب کریں؛ نتیجہ کارڈ گیم کے قواعد سے طے ہوتا ہے۔"
};
let rouletteAudioContext=null;
function sfx(kind="click"){
  if(window.__knpSoundOff)return;
  try {
    const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
    rouletteAudioContext ||= new C();
    const ctx=rouletteAudioContext;
    if(ctx.state==="suspended")ctx.resume().catch(()=>{});
    const o=ctx.createOscillator(),g=ctx.createGain();
    const tones={click:[520,.045],win:[880,.16],lose:[180,.12],bonus:[1040,.22],spin:[640,.08]};
    const [hz,dur]=tones[kind]||tones.click;o.type=kind==="win"||kind==="bonus"?"sine":"triangle";
    o.frequency.setValueAtTime(hz,ctx.currentTime);
    if(kind==="win"||kind==="bonus")o.frequency.exponentialRampToValueAtTime(hz*1.45,ctx.currentTime+dur);
    g.gain.setValueAtTime(.0001,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.07,ctx.currentTime+.012);g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+dur);
    o.connect(g);g.connect(ctx.destination);o.start();o.stop(ctx.currentTime+dur+.02);
    o.onended=()=>{o.disconnect();g.disconnect();};
  } catch(_){}
}

function popEffect(el,kind="result"){
  if(!el)return;el.classList.remove("knp-pop","knp-win","knp-bonus");
  void el.offsetWidth;el.classList.add("knp-pop",kind==="bonus"?"knp-bonus":kind==="win"?"knp-win":"");
}

export default function start(root,wallet){
  let bet=10,round=0,closed=false,timer=null,free=0,score=0,step=0,hand=[],sequence=[],target=[],lastRouletteBets=[],pendingStake=0,currentStake=0,currentSettled=false,currentPayout=0,currentRoundStarted=false,rouletteSettling=false;
  const stop=()=>{if(timer){clearInterval(timer);timer=null;}};
  const spend=()=>{if(wallet.value<bet){say("Coins کافی نہیں ہیں۔");return false;}wallet.value-=bet;pendingStake+=bet;updateWallet();sfx("click");return true;};
  const award=n=>{sfx("win");popEffect(root.querySelector("[data-stage]"),"win");say("نتیجہ سرور سے تصدیق ہو رہا ہے…");};
  const updateWallet=()=>{const e=root.querySelector("[data-wallet]");if(e)e.textContent=fmt(wallet.value);};
  const say=s=>{const e=root.querySelector("[data-message]");if(e)e.textContent=s;};
  const back=()=>{stop();root.dispatchEvent(new CustomEvent("backtolobby",{bubbles:true}));};
  const shell=(body)=>{root.innerHTML=`<main class="indie-game" style="--g-bg:${GAME.colors.background};--g-accent:${GAME.colors.accent};--g-glow:${GAME.colors.highlight}">
    <header class="indie-head"><button class="indie-btn indie-back" data-back>← Lobby</button><div class="indie-brand"><img src="${GAME.logo}" alt="${GAME.name} logo"><div><strong>${GAME.name}</strong><small>${GAME.category} · Game #${String(GAME.id).padStart(3,"0")}</small></div></div><div class="indie-wallet">COINS <b data-wallet>${fmt(wallet.value)}</b></div><button class="indie-btn knp-sound" data-sound aria-label="Sound on/off">🔊 SOUND</button></header>${body}</main>`;
    root.querySelector("[data-back]").onclick=back;root.querySelector("[data-sound]").onclick=e=>{window.__knpSoundOff=!window.__knpSoundOff;e.currentTarget.textContent=window.__knpSoundOff?"🔇 SOUND":"🔊 SOUND";sfx("click");};
  };
  const home=()=>{
    shell(`<section class="indie-home"><div class="indie-home-art"><img src="${GAME.logo}" alt="${GAME.name} artwork"><span>${GAME.category.toUpperCase()}</span></div><div class="indie-home-copy"><p class="indie-kicker">KNP-999 ORIGINAL GAME</p><h1>${GAME.name}</h1><p>${GAME.description}</p><div class="indie-facts"><span>Minimum bet <b>10 Coins</b></span><span>Game mode <b>Virtual Coins</b></span><span>Game ID <b>${GAME.id}</b></span></div><button class="indie-btn indie-primary" data-play>PLAY NOW</button><button class="indie-btn" data-rules>HOW TO PLAY</button><button class="indie-btn" data-paytable>PAYTABLE</button><div class="knp-rules"><b>اس گیم کے بنیادی قواعد</b><p>${ENGINE_RULES[GAME.engine]||GAME.description}</p><small>Bonus feature: ${GAME.bonus||0} · Multiplier: ×${GAME.multiplier||1}</small></div></div></section><div class="indie-home-foot">Your balance is virtual Coins only. No cash deposits, cash value or withdrawals.</div>`);
    root.querySelector("[data-play]").onclick=play;
    root.querySelector("[data-rules]").onclick=()=>sayRules();
    root.querySelector("[data-paytable]").onclick=()=>sayPaytable();
  };
  const sayRules=()=>{const m=root.querySelector("[data-home-message]")||root.querySelector("[data-message]");if(m)m.textContent=GAME.description;};
  const sayPaytable=()=>{const m=root.querySelector("[data-home-message]")||root.querySelector("[data-message]");if(m)m.textContent=`Bet options: ${BETS.join(", ")} Coins. Outcomes are generated for virtual play.`;};
  const play=()=>{
    round=0;free=0;score=0;step=0;hand=[];sequence=[];target=[];
    const gameBody=`<section class="indie-play-head"><div><p class="indie-kicker">${GAME.category.toUpperCase()}</p><h2>${GAME.name}</h2></div><button class="indie-btn" data-game-history>PLAY HISTORY</button><button class="indie-btn" data-home>GAME HOME</button></section>
    <section class="indie-stage" data-stage></section>
    <section class="indie-bet"><label>BET COINS <select data-bet>${BETS.map(v=>`<option value="${v}">${fmt(v)}</option>`).join("")}</select></label><span>Round <b data-round>0</b></span></section>
    <section class="indie-controls" data-controls></section><p class="indie-message" data-message>Choose your bet and start playing.</p>`;
    shell(gameBody);
    root.querySelector("[data-home]").onclick=home;
    root.querySelector("[data-game-history]").onclick=async()=>{
      const stage=field();
      stage.innerHTML='<section class="roulette-history"><div class="roulette-history-head"><h3>EUROPEAN ROULETTE · HISTORY</h3><button class="indie-btn" data-history-back>BACK TO TABLE</button></div><p data-history-status>Loading verified rounds…</p><div class="roulette-history-list" data-history-list></div></section>';
      stage.querySelector("[data-history-back]").onclick=setupEngine;
      try{
        const data=await getGameHistory(GAME.id);
        const rows=data.rounds||[];
        const list=stage.querySelector("[data-history-list]");
        stage.querySelector("[data-history-status]").textContent=`${rows.length} saved round${rows.length===1?"":"s"} · newest first`;
        if(!rows.length){list.textContent="اس گیم کی ابھی کوئی ہسٹری محفوظ نہیں ہے۔";return;}
        rows.forEach(r=>{
          let result={};try{result=JSON.parse(r.result||"{}");}catch{}
          const item=document.createElement("article");item.className="roulette-history-row";
          const title=document.createElement("b");
          const winningLabel=result.summary||(result.winningNumber!==undefined?String(result.winningNumber):"Round result");
          title.textContent=`${winningLabel} · ${r.created_at||""}`;
          const detail=document.createElement("span");detail.textContent=`Bet ${fmt(r.stake)} · Payout ${fmt(r.payout)} · Net ${fmt(r.net)}`;
          const outcome=document.createElement("small");outcome.textContent=result.winningNumber!==undefined?`Winning pocket ${result.winningNumber} (${result.winningColor||"unknown"})`:"Server-recorded round";
          item.append(title,detail,outcome);list.append(item);
        });
      }catch(e){stage.querySelector("[data-history-status]").textContent=e.message||"History could not be loaded.";}
    };
    root.querySelector("[data-bet]").onchange=e=>bet=Number(e.target.value)||10;
    setupEngine();
  };
  const field=()=>root.querySelector("[data-stage]");
  const controls=()=>root.querySelector("[data-controls]");
  const btn=(label,fn)=>{const b=document.createElement("button");b.className="indie-btn indie-action";b.textContent=label;b.onclick=()=>{sfx("click");fn();};controls().append(b);return b;};
  const roundStart=()=>{round++;currentStake=pendingStake;pendingStake=0;currentSettled=false;currentPayout=0;currentRoundStarted=true;root.querySelector("[data-round]").textContent=round;};
  const history=(s,choice={})=>{
    if(currentRoundStarted&&!currentSettled){
      currentSettled=true;currentRoundStarted=false;
      settleVirtualRound(GAME.id,currentStake,0,s,choice)
        .then(r=>{
          wallet.value=Number(r.coins);updateWallet();
          currentPayout=Number(r.payout||0);
          const outcome=r.result||{};
          const challenge=outcome.challenge||{};
          const details=Object.entries(outcome).filter(([k,v])=>!["gameplay","challenge","gameId","name","profile","variant","action"].includes(k)&&v!==null&&typeof v!=="object").map(([k,v])=>`${k}: ${String(v)}`).slice(0,6);
          const challengeLine=challenge.id?`<div class="server-challenge"><b>${challenge.mechanic||"Game challenge"}</b><span>${challenge.won?"کامیاب":"ناکام"} · ${challenge.target!==undefined?"Target "+challenge.target:""} · Difficulty ${challenge.difficulty||1}</span></div>`:"";
          const detailLine=details.length?`<div class="server-result-details">${details.map(x=>`<span>${x.replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]))}</span>`).join("")}</div>`:"";
          const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
          const profile=String(outcome.profile||GAME.engine||"");
          let authoritativeBoard="";
          if(Array.isArray(outcome.spins)) authoritativeBoard=`<div class="server-outcome-board"><b>SERVER REELS</b>${outcome.spins.map(sp=>`<div class="server-reels">${(sp.reels||[]).map(v=>`<span>${esc(v)}</span>`).join("")}<small>${esc(sp.match||"spin")} · ×${Number(sp.multiplier||0).toFixed(2)}</small></div>`).join("")}</div>`;
          else if(Array.isArray(outcome.dice)) authoritativeBoard=`<div class="server-outcome-board"><b>SERVER DICE</b><div class="server-reels">${outcome.dice.map(v=>`<span>${esc(v)}</span>`).join("")}<small>Sum ${esc(outcome.sum)}</small></div></div>`;
          else if(Array.isArray(outcome.player)) authoritativeBoard=`<div class="server-outcome-board"><b>PLAYER HAND</b><div class="server-reels">${outcome.player.map(v=>`<span>${esc(v)}</span>`).join("")}<small>Dealer: ${(outcome.dealer||[]).map(esc).join(" · ")} · ${esc(outcome.outcome||"")}</small></div></div>`;
          else if(Array.isArray(outcome.cards)) authoritativeBoard=`<div class="server-outcome-board"><b>SERVER CARDS</b><div class="server-reels">${outcome.cards.map(v=>`<span>${esc(typeof v==="object"?`${v.r||""}${v.s||""}`:v)}</span>`).join("")}<small>${esc(outcome.hand||(outcome.hasSet?"Set found":"Round result"))}</small></div></div>`;
          else if(profile==="crash") authoritativeBoard=`<div class="server-outcome-board"><b>SERVER CRASH RESULT</b><div class="server-reels"><span>${Number(outcome.crashAt||0).toFixed(2)}×</span><small>${outcome.crashed?"Crashed":"Cashout accepted"} · Cashout ${Number(outcome.cashoutAt||0).toFixed(2)}×</small></div></div>`;
          else if(profile==="fishing") authoritativeBoard=`<div class="server-outcome-board"><b>SERVER CATCH</b><div class="server-reels"><span>${esc(outcome.fish||"🐟")}</span><small>${outcome.caught?"Target caught":"Target escaped"}</small></div></div>`;
          else if(outcome.variant==="european-roulette") {
            rouletteSettling=false;
            bets.length=0;
            const n=Number(outcome.winningNumber);
            const c=esc(outcome.winningColor||"");
            const index=Math.max(0,Math.min(36,Number(outcome.wheelIndex)||0));
            // Keep a visible wheel in the result view and rotate the server-selected pocket to the fixed pointer.
            const stopAngle=1440+(37-index)*(360/37);
            const wheelMarkup=field().querySelector(".roulette-wheel-wrap")?.outerHTML||"";
            const wins=(outcome.winningBets||[]).map(b=>`${esc(b.type)} ${esc(Array.isArray(b.value)?b.value.join("-"):b.value)} · ${fmt(b.amount)} → ${fmt(b.payout)}`).join("<br>");
            const resultWheel=wheelMarkup.replace('class="roulette-wheel"','class="roulette-wheel roulette-spinning"').replace('data-roulette-wheel','data-roulette-wheel data-result-wheel').replace('style="background:',`style="--roulette-stop:${stopAngle}deg;background:`);
            authoritativeBoard=`<div class="server-outcome-board roulette-server-result"><b>SERVER VERIFIED EUROPEAN ROULETTE</b>${resultWheel}<div class="roulette-winning-number ${c}">${n}</div><strong>${c.toUpperCase()}</strong><div>${wins||"No winning bet this round"}</div><small>Round #${round} · Total stake ${fmt(outcome.stake)} · Payout ${fmt(outcome.payout)}</small></div>`;
          }
          else if(profile==="wheel") authoritativeBoard=`<div class="server-outcome-board"><b>SERVER WHEEL</b><div class="server-reels"><span>SEGMENT ${esc(outcome.segment??"-")}</span><small>×${Number(outcome.multiplier||0).toFixed(2)}</small></div></div>`;
          else if(profile==="plinko") authoritativeBoard=`<div class="server-outcome-board"><b>SERVER PLINKO</b><div class="server-reels"><span>BIN ${esc(outcome.bin??"-")}</span><small>×${Number(outcome.multiplier||0).toFixed(2)} · Path ${esc((outcome.path||[]).join("–"))}</small></div></div>`;
          else if(outcome.mechanic) authoritativeBoard=`<div class="server-outcome-board"><b>${esc(outcome.mechanic)}</b><div class="server-reels"><span>${outcome.won?"✓":"×"}</span><small>${esc(outcome.objective||outcome.summary||"Server-confirmed game result")}</small></div></div>`;
          field().innerHTML=`<div class="server-authoritative-result"><div class="result-status">${currentPayout>0?"ROUND WON":"ROUND COMPLETE"}</div><h3>${currentPayout>0?"+"+fmt(currentPayout):"0"} Coins</h3><p>Server-verified result · ${GAME.name}</p>${challengeLine}${authoritativeBoard}${detailLine}<small>Round #${round} · Stake ${fmt(currentStake)} · Multiplier ×${Number(r.multiplier||0).toFixed(2)}</small></div>`;
          if(currentPayout>0){sfx("win");popEffect(root.querySelector("[data-stage]"),"win");say(`سرور نے ${fmt(currentPayout)} Coins ادا کیے۔`);}
          else{ sfx("lose"); say("سرور کا تصدیق شدہ نتیجہ: اس راؤنڈ میں انعام نہیں ملا۔"); }
        })
        .catch(async e=>{currentRoundStarted=false;currentSettled=false;rouletteSettling=false;pendingStake=currentStake;currentStake=0;try{const w=await getServerWallet();wallet.value=Number(w.coins);updateWallet();}catch{}say(e.message||"Server round could not be saved. Bet slip محفوظ ہے؛ دوبارہ کوشش سے پہلے History اور Wallet چیک کریں۔");const stage=field();if(stage)stage.querySelectorAll("button,select").forEach(el=>el.disabled=false);});
    }
  };
  const win=(amount,msg,choice={})=>{currentPayout=Math.max(0,Number(amount)||0);if(amount>0)award(amount);else{sfx("lose");say(msg);}history(msg,choice);};
  function setupEngine(){
    const e=GAME.engine;
    if(e==="slot"){
      field().innerHTML=`<div class="indie-label">${GAME.name}</div><div class="indie-reels"><span>🍒</span><span>💎</span><span>🔔</span></div><p>Match 2 or 3 symbols. Three matching symbols pay the top prize.</p><div class="indie-bonus">Bonus spins: <b data-free>0</b></div>`;
      btn("SPIN",()=>{if(!free&&!spend())return;if(free){free--;root.querySelector("[data-free]").textContent=free;}roundStart();const vals=Array.from({length:3},()=>pick(GAME.symbols));const reels=field().querySelector(".indie-reels");reels.innerHTML=vals.map(x=>`<span>${x}</span>`).join("");let payout=0,msg="No match this round.";if(vals.every(x=>x===vals[0])){payout=bet*GAME.multiplier;msg=`Three of a kind · x${GAME.multiplier}`;}else if(new Set(vals).size===2){payout=bet*1.5;msg="Two symbols matched · x1.5";}if(vals.every(x=>x===GAME.symbols[0])){free+=GAME.bonus;root.querySelector("[data-free]").textContent=free;msg+=` · Bonus ${GAME.bonus} spins`;}win(payout,msg);});
      btn("AUTO SPIN ×5",()=>{let paid=0,won=0;for(let i=0;i<5;i++){if(!free&&!spend())break;if(free)free--;else paid++;const v=Array.from({length:3},()=>pick(GAME.symbols));if(v.every(x=>x===v[0]))won+=bet*GAME.multiplier;else if(new Set(v).size===2)won+=bet*1.5;}roundStart();win(won,`Auto spins complete · ${paid} paid rounds`);});
    }else if(e==="crash"){
      field().innerHTML=`<div class="indie-mult" data-mult>1.00×</div><div class="indie-flight">🚀</div><div class="indie-track"><i data-track></i></div><p>Start the round and cash out before the multiplier crashes.</p>`;
      btn("START ROUND",()=>{if(timer||!spend())return;roundStart();let m=1,limit=1.2+Math.random()*(3.5+GAME.id%6);say("Multiplier rising…");timer=setInterval(()=>{m+=.025+m*.012;field().querySelector("[data-mult]").textContent=m.toFixed(2)+"×";field().querySelector("[data-track]").style.width=Math.min(100,m/limit*100)+"%";if(m>=limit){stop();say("CRASH — bet lost.");history("Crash");}},80);});
      btn("CASH OUT",()=>{if(!timer)return;const m=Number(field().querySelector("[data-mult]").textContent.replace("×",""));stop();win(bet*m,`Cashed out at ${m.toFixed(2)}×`,{cashoutAt:m});});
    }else if(e==="wheel" && GAME.id===178){
      const bets=[];
      const wheelOrder=[0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];
      const reds=new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
      const color=n=>n===0?"green":reds.has(n)?"red":"black";
      const pocketPaint=wheelOrder.map((n,i)=>`${color(n)} ${i*360/37}deg ${(i+1)*360/37}deg`).join(",");
      const wheelLabels=wheelOrder.map((n,i)=>`<span style="--p:${i}">${n}</span>`).join("");
      const valueOptions={
        number:Array.from({length:37},(_,i)=>[String(i),String(i)]),
        color:[["red","Red"],["black","Black"]],
        parity:[["odd","Odd"],["even","Even"]],
        range:[["low","1–18"],["high","19–36"]],
        dozen:[["1","1st Dozen"],["2","2nd Dozen"],["3","3rd Dozen"]],
        column:[["1","1st Column"],["2","2nd Column"],["3","3rd Column"]],
        split:["0-3","3-6","6-9","1-2","2-3","4-5","5-6","7-8","8-9","10-11","11-12","13-14","14-15","16-17","17-18","19-20","20-21","22-23","23-24","25-26","26-27","28-29","29-30","31-32","32-33","34-35","35-36"].map(v=>[v,v.replace("-"," / ")]),
        street:["1-2-3","4-5-6","7-8-9","10-11-12","13-14-15","16-17-18","19-20-21","22-23-24","25-26-27","28-29-30","31-32-33","34-35-36"].map(v=>[v,v.replaceAll("-"," / ")]),
        corner:["1-2-4-5","2-3-5-6","4-5-7-8","5-6-8-9","7-8-10-11","8-9-11-12","10-11-13-14","11-12-14-15","13-14-16-17","14-15-17-18","16-17-19-20","17-18-20-21","19-20-22-23","20-21-23-24","22-23-25-26","23-24-26-27","25-26-28-29","26-27-29-30","28-29-31-32","29-30-32-33","31-32-34-35","32-33-35-36"].map(v=>[v,v.replaceAll("-"," / ")]),
        sixline:["1-2-3-4-5-6","4-5-6-7-8-9","7-8-9-10-11-12","10-11-12-13-14-15","13-14-15-16-17-18","16-17-18-19-20-21","19-20-21-22-23-24","22-23-24-25-26-27","25-26-27-28-29-30","28-29-30-31-32-33","31-32-33-34-35-36"].map(v=>[v,v.replaceAll("-"," / ")])
      };
      field().innerHTML=`
        <div class="roulette-layout">
          <div class="roulette-table-top">
            <div class="roulette-wheel-wrap"><div class="roulette-wheel" data-roulette-wheel style="background:conic-gradient(from -4.8649deg,${pocketPaint})"><div class="roulette-wheel-inner">${wheelLabels}</div><div class="roulette-ball" data-roulette-ball></div><div class="roulette-hub">KNP</div></div></div>
            <div class="roulette-recent"><b>EUROPEAN SINGLE ZERO</b><p>37 pockets · 0–36</p><p data-roulette-message>Place chips on the table</p><div data-roulette-last></div></div>
          </div>
          <div class="roulette-bet-toolbar">
            <label>CHIP VALUE <select data-chip>${[10,20,50,100,200,500,1000,2000,5000].map(v=>`<option value="${v}">${v} Coins</option>`).join("")}</select></label>
            <label>BET TYPE <select data-bet-type>${Object.entries({number:"Straight number",color:"Red / Black",parity:"Odd / Even",range:"1–18 / 19–36",dozen:"Dozens",column:"Columns",split:"Split (2 numbers)",street:"Street (3 numbers)",corner:"Corner (4 numbers)",sixline:"Six Line (6 numbers)"}).map(([v,l])=>`<option value="${v}">${l}</option>`).join("")}</select></label>
            <label>SELECTION <select data-bet-value></select></label>
            <button class="indie-btn indie-action" data-place-bet>PLACE CHIP</button>
          </div>
          <div class="roulette-number-grid"><button class="roulette-cell green" data-number="0">0</button><div class="roulette-numbers">${Array.from({length:12},(_,col)=>[3+col*3,2+col*3,1+col*3].map(n=>`<button class="roulette-cell ${color(n)}" data-number="${n}">${n}</button>`).join("")).join("")}</div></div>
          <div class="roulette-outside-bets">
            <button data-quick="color:red">RED</button><button data-quick="color:black">BLACK</button><button data-quick="parity:odd">ODD</button><button data-quick="parity:even">EVEN</button><button data-quick="range:low">1–18</button><button data-quick="range:high">19–36</button>
            <button data-quick="dozen:1">1ST DOZEN</button><button data-quick="dozen:2">2ND DOZEN</button><button data-quick="dozen:3">3RD DOZEN</button>
            <button data-quick="column:1">1ST COLUMN</button><button data-quick="column:2">2ND COLUMN</button><button data-quick="column:3">3RD COLUMN</button>
          </div>
          <div class="roulette-betslip"><b>YOUR BETS</b><div data-betslip>No chips placed yet</div><strong>Total: <span data-total-bet>0</span> Coins</strong></div>
        </div>`;
      const valueSelect=field().querySelector("[data-bet-value]");
      const typeSelect=field().querySelector("[data-bet-type]");
      const refreshValues=()=>{valueSelect.innerHTML=valueOptions[typeSelect.value].map(([v,l])=>`<option value="${v}">${l}</option>`).join("");};
      typeSelect.onchange=refreshValues;refreshValues();
      const refreshSlip=()=>{
        const slip=field().querySelector("[data-betslip]");
        slip.innerHTML=bets.length?bets.map((b,i)=>`<span>${b.type} ${b.value} · ${b.amount} <button data-remove="${i}">×</button></span>`).join(""):"No chips placed yet";
        field().querySelector("[data-total-bet]").textContent=fmt(pendingStake);
        slip.querySelectorAll("[data-remove]").forEach(el=>el.onclick=()=>{
          const i=Number(el.dataset.remove),b=bets.splice(i,1)[0];pendingStake-=b.amount;wallet.value+=b.amount;updateWallet();refreshSlip();
        });
      };
      const place=(type,value)=>{
        if(timer||currentRoundStarted||rouletteSettling)return;
        if(!spend())return;
        const amount=bet;
        bets.push({type,value,amount});
        field().querySelector("[data-roulette-message]").textContent=`Chip placed: ${type} ${value}`;
        refreshSlip();
      };
      field().querySelector("[data-chip]").onchange=e=>{bet=Number(e.target.value)||10;};
      field().querySelector("[data-place-bet]").onclick=()=>place(typeSelect.value,valueSelect.value);
      field().querySelectorAll("[data-number]").forEach(el=>el.onclick=()=>place("number",Number(el.dataset.number)));
      field().querySelectorAll("[data-quick]").forEach(el=>el.onclick=()=>{const [type,value]=el.dataset.quick.split(":");place(type,type==="dozen"||type==="column"?Number(value):value);});
      btn("SPIN WHEEL",()=>{
        if(rouletteSettling||!bets.length){say("پہلے Roulette Table پر کم از کم ایک Chip لگائیں۔");return;}
        const total=bets.reduce((n,b)=>n+b.amount,0);
        if(total!==pendingStake){say("Bet total mismatch.");return;}
        rouletteSettling=true;
        sfx("spin");
        field().querySelectorAll("button,select").forEach(el=>el.disabled=true);
        roundStart();
        lastRouletteBets=bets.map(b=>({...b}));
        say("سرور سے رولیٹ کا نتیجہ حاصل کیا جا رہا ہے…");
        win(0,"Roulette round complete",{bets: bets.map(b=>({...b}))});
      });
      btn("UNDO LAST CHIP",()=>{
        if(rouletteSettling||currentRoundStarted||!bets.length)return;
        const last=bets.pop();pendingStake=Math.max(0,pendingStake-last.amount);wallet.value+=last.amount;updateWallet();refreshSlip();
        say("آخری chip واپس کر دی گئی۔");
      });
      btn("CLEAR BETS",()=>{
        if(rouletteSettling||currentRoundStarted)return;
        const refund=bets.reduce((n,b)=>n+b.amount,0);
        bets.length=0;pendingStake=0;wallet.value+=refund;updateWallet();refreshSlip();
      });
      btn("REPEAT LAST BET",()=>{
        if(rouletteSettling||currentRoundStarted||!lastRouletteBets.length){say("ابھی پچھلی bets دستیاب نہیں۔");return;}
        const required=lastRouletteBets.reduce((sum,b)=>sum+Number(b.amount||0),0);
        if(!Number.isFinite(required)||required<=0){say("پچھلی bet محفوظ نہیں؛ دوبارہ لگانا ممکن نہیں۔");return;}
        if(wallet.value<required){say(`Repeat کے لیے ${fmt(required)} Coins درکار ہیں۔`);return;}
        // All-or-nothing repeat: never leave a partially copied bet slip.
        wallet.value-=required;pendingStake+=required;
        lastRouletteBets.forEach(old=>bets.push({...old,amount:Number(old.amount)}));
        updateWallet();refreshSlip();say(`پچھلی پوری bet دوبارہ لگ گئی: ${fmt(required)} Coins۔`);
      });
    }else if(e==="fishing"){
      field().innerHTML=`<div class="indie-ocean">${GAME.symbols.slice(0,6).map((s,i)=>`<button class="indie-fish" data-fish="${i}">${s}</button>`).join("")}</div><p>Select a target, then fire. Rare targets carry higher virtual multipliers.</p><div data-target>Choose a target.</div>`;
      field().querySelectorAll("[data-fish]").forEach(b=>b.onclick=()=>{field().querySelectorAll("[data-fish]").forEach(x=>x.classList.remove("chosen"));b.classList.add("chosen");field().querySelector("[data-target]").textContent=`Target locked: ${b.textContent}`;field().dataset.target=b.dataset.fish;});
      btn("FIRE",()=>{if(!spend())return;roundStart();const idx=Number(field().dataset.target||0),hit=Math.random()>(.25+(idx%3)*.08),m=1+(idx%5);win(hit?bet*m:0,hit?`Target captured · ×${m}`:"Target escaped.");});
    }else if(e==="dice"){
      field().innerHTML=`<div class="indie-dice" data-dice>⚄　⚄</div><p>Choose a prediction before rolling two dice.</p>`;
      btn("LOW · 2–6",()=>rollDice("low"));btn("SEVEN",()=>rollDice("seven"));btn("HIGH · 8–12",()=>rollDice("high"));
    }else if(e==="puzzle"){
      target=Array.from({length:4+(GAME.id%2)},()=>1+Math.floor(Math.random()*4));
      field().innerHTML=`<div class="indie-sequence" data-seq>${target.map(x=>"●").join(" ")}</div><p>Memorize the pattern, then repeat it using the buttons.</p><div class="indie-puzzle">${[1,2,3,4].map(n=>`<button class="indie-btn" data-n="${n}">${n}</button>`).join("")}</div><div data-progress>0 / ${target.length}</div>`;
      sequence=[];field().querySelectorAll("[data-n]").forEach(b=>b.onclick=()=>{sequence.push(Number(b.dataset.n));field().querySelector("[data-progress]").textContent=`${sequence.length} / ${target.length}`;if(sequence.length===target.length){if(!spend()){sequence=[];return;}roundStart();const ok=sequence.every((v,i)=>v===target[i]);win(ok?bet*GAME.multiplier:0,ok?"Pattern solved!":"Pattern incorrect.");sequence=[];}});
      btn("NEW PATTERN",()=>{target=Array.from({length:4+(GAME.id%2)},()=>1+Math.floor(Math.random()*4));field().querySelector("[data-seq]").textContent=target.map(x=>"●").join(" ");sequence=[];field().querySelector("[data-progress]").textContent=`0 / ${target.length}`;say("New pattern ready.");});
    }else if(e==="arcade"){
      score=0;let arcadeActive=false;field().innerHTML=`<div class="indie-target-zone"><button class="indie-target" data-target disabled>🎯</button></div><div class="indie-score">SCORE <b data-score>0</b> / ${5+GAME.id%6}</div><p>Start a paid round, hit the target, then finish the round.</p>`;
      const targetBtn=field().querySelector("[data-target]");targetBtn.onclick=()=>{if(!arcadeActive)return;score+=1+(GAME.id%4);field().querySelector("[data-score]").textContent=score;targetBtn.textContent=pick(GAME.symbols);popEffect(targetBtn);};
      btn("START / PAY BET",()=>{if(arcadeActive||!spend())return;roundStart();arcadeActive=true;targetBtn.disabled=false;score=0;field().querySelector("[data-score]").textContent=0;say("Target practice started — hit the target, then finish.");});
      btn("FINISH ROUND",()=>{if(!arcadeActive){say("پہلے START / PAY BET دبائیں۔");return;}arcadeActive=false;targetBtn.disabled=true;const w=score>=5+GAME.id%6?bet*GAME.multiplier:Math.floor(bet*score/5);win(w,`Score ${score} · virtual reward ${fmt(w)}`);});
    }else if(e==="steps"){
      step=0;field().innerHTML=`<div class="indie-path" data-path>🐔　⬜　⬜　⬜　🏁</div><p>Advance one safe step at a time, or cash out your accumulated multiplier.</p><div data-step>Step 0 · ×1.00</div>`;
      btn("NEXT STEP",()=>{if(step===0&&!spend())return;roundStart();if(Math.random()<.17){step=0;field().querySelector("[data-path]").textContent="🐔　💥　⬜　⬜　🏁";say("Obstacle hit — round over.");history("Obstacle");return;}step++;field().querySelector("[data-path]").textContent="🐔　"+"🟩　".repeat(step)+"⬜　".repeat(Math.max(0,3-step))+"🏁";field().querySelector("[data-step]").textContent=`Step ${step} · ×${(1+step*.65).toFixed(2)}`;if(step>=3)say("Maximum steps reached — cash out.");});
      btn("CASH OUT",()=>{if(!step)return;const m=1+step*.65;win(bet*m,`Cashed out at step ${step} · ×${m.toFixed(2)}`);step=0;});
    }else if(e==="plinko"){
      const mults=[.2,.5,1,1.5,2,5,2,1.5,1,.5,.2];
      field().innerHTML=`<div class="indie-pegboard">${Array.from({length:7},(_,r)=>`<div>${Array.from({length:r+3},()=>"<i></i>").join("")}</div>`).join("")}</div><div class="indie-bins">${mults.map(x=>`<b>×${x}</b>`).join("")}</div><div class="indie-ball" data-ball>●</div><p>Drop a ball through the pegboard.</p>`;
      btn("DROP BALL",()=>{if(!spend())return;roundStart();const i=Math.floor(Math.random()*mults.length),m=mults[i],ball=field().querySelector("[data-ball]");ball.style.left=(4+i*9.2)+"%";ball.classList.add("falling");setTimeout(()=>{ball.classList.remove("falling");win(bet*m,`Ball landed in ×${m} bin.`);},650);});
    }else if(e==="blackjack"){
      hand=[];field().innerHTML=`<div class="indie-cards" data-cards></div><p>Deal, Hit or Stand. Try to reach 21 without going over.</p><div data-total>Hand total: 0</div>`;
      btn("DEAL",()=>{if(hand.length||!spend())return;roundStart();hand=[drawCard(),drawCard()];paintCards();});
      btn("HIT",()=>{if(!hand.length)return;hand.push(drawCard());paintCards();if(cardTotal(hand)>21){say("Bust — over 21.");history("Bust");hand=[];}});
      btn("STAND",()=>{if(!hand.length)return;const total=cardTotal(hand),w=total===21?bet*2:total>=17?bet:0;win(w,`Hand total ${total}`);hand=[];field().querySelector("[data-cards]").innerHTML="";field().querySelector("[data-total]").textContent="Hand total: 0";});
    }else if(e==="rummy"){
      hand=[];field().innerHTML=`<div class="indie-cards" data-cards></div><p>Draw up to seven cards, then check for a three-card set.</p><div data-count>Cards: 0 / 7</div>`;
      btn("DRAW CARD",()=>{if(!hand.length&&!spend())return;if(hand.length>=7)return;hand.push(pick(["A","2","3","4","5","6","7","8","9","10","J","Q","K"]));paintCards();});
      btn("CHECK SET",()=>{if(hand.length<3){say("Draw at least three cards.");return;}roundStart();const counts={};hand.forEach(x=>counts[x]=(counts[x]||0)+1);const ok=Object.values(counts).some(n=>n>=3);win(ok?bet*3:0,ok?"Three-card set found!":"No set yet.");hand=[];paintCards();});
      btn("DISCARD",()=>{hand.pop();paintCards();});
    }else if(e==="poker"||e==="card"){
      hand=[];field().innerHTML=`<div class="indie-cards" data-cards></div><p>Deal five cards and check your hand.</p><div data-hand>Ready to deal.</div>`;
      btn("DEAL FIVE",()=>{if(!spend())return;roundStart();hand=Array.from({length:5},()=>drawCard(true));paintCards();const counts={};hand.forEach(x=>{const r=x.slice(0,-1);counts[r]=(counts[r]||0)+1;});const pair=Object.values(counts).some(n=>n>=2),three=Object.values(counts).some(n=>n>=3);const w=three?bet*4:pair?bet*2:0;win(w,three?"Three of a kind!":pair?"Pair!":"High card.");});
    }else{
      field().innerHTML=`<div class="indie-target-zone"><div class="indie-target"> ${GAME.symbols[0]} </div></div><p>${GAME.description}</p>`;
      btn("PLAY ROUND",()=>{if(!spend())return;roundStart();const w=Math.random()>.5?bet*GAME.multiplier:0;win(w,w?"Round completed with a virtual reward.":"Round complete — try again.");});
    }
  }
  function rollDice(choice){if(!spend())return;roundStart();const a=1+Math.floor(Math.random()*6),b=1+Math.floor(Math.random()*6),sum=a+b;field().querySelector("[data-dice]").textContent=`${["⚀","⚁","⚂","⚃","⚄","⚅"][a-1]}　${["⚀","⚁","⚂","⚃","⚄","⚅"][b-1]}`;const ok=choice==="low"?sum<=6:choice==="high"?sum>=8:sum===7;win(ok?bet*(choice==="seven"?5:2):0,`Dice ${a} + ${b} = ${sum}`);}
  function drawCard(suit=false){const r=pick(["A","2","3","4","5","6","7","8","9","10","J","Q","K"]);return r+(suit?pick(["♠","♥","♦","♣"]):"");}
  function cardTotal(cards){return cards.reduce((n,c)=>n+(c[0]==="A"?11:["J","Q","K"].includes(c[0])?10:Number(c[0])||10),0);}
  function paintCards(){const e=field().querySelector("[data-cards]");if(e)e.innerHTML=hand.map(c=>`<span>${c}</span>`).join("");const t=field().querySelector("[data-total]");if(t)t.textContent=`Hand total: ${cardTotal(hand)}`;const n=field().querySelector("[data-count]");if(n)n.textContent=`Cards: ${hand.length} / 7`;}
  home();
  installGameFeel(root,GAME);
  return ()=>{closed=true;stop();};
}
