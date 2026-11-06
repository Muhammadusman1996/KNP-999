const money = n => Number(n).toFixed(2);
const pick = a => a[Math.floor(Math.random()*a.length)];
export function runEngine(root, game, wallet) {
  // ہر گیم کے اصل ڈیٹا کو رن ٹائم کے مطلوبہ ناموں سے جوڑیں
  game = { ...game, id: game.gameId ?? game.id, name: game.title ?? game.name,
    engine: game.engineProfile ?? game.engine, colors: game.theme ?? game.colors };
  const c=game.colors || {background:"#10243b",accent:"#57a7ff",highlight:"#9ce9d4"}, engine=game.engine;
  let bet=100, active=false, timer=null, round=0, score=0, soundOn=true, freeSpins=0;
  const stopTimer=()=>{if(timer){clearInterval(timer);timer=null;}};
  const updateWallet=()=>{root.querySelector("#coins").textContent=money(wallet.value);};
  const say=(s)=>{root.querySelector("#result").textContent=s;};
  const playAsset=(name)=>{if(!soundOn)return;try{const a=new Audio(`/audio/${name}.wav`);a.volume=.45;a.play().catch(()=>{});}catch{}};
  const playTone=(freq=440,duration=.08)=>{if(!soundOn)return;try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;const ctx=new C(),o=ctx.createOscillator(),g=ctx.createGain();o.frequency.value=freq;o.type="sine";g.gain.setValueAtTime(.045,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+duration);o.connect(g);g.connect(ctx.destination);o.start();o.stop(ctx.currentTime+duration);o.onended=()=>ctx.close();}catch{}};
  const spend=n=>{if(wallet.value<n){say("آپ کے پریکٹس کوائنز کافی نہیں ہیں۔");playTone(140);return false;}wallet.value-=n;updateWallet();return true;};
  const award=n=>{wallet.value+=n;updateWallet();playAsset("win");playTone(760,.16);};
  const button=(label,fn,cls="")=>{const b=document.createElement("button");b.className="game-btn "+cls;b.textContent=label;b.addEventListener("click",fn);root.querySelector("#controls").append(b);return b;};
  root.innerHTML=`<section class="game" style="--game-bg:${c.background};--accent:${c.accent};--glow:${c.highlight}">
    <header class="game-head"><button class="back game-btn secondary">← واپس</button><div class="game-title"><img src="${game.logo}"><div><b>${game.name}</b><small>${game.category} · گیم نمبر ${String(game.id).padStart(3,"0")}</small></div></div><span class="wallet">Coins: <b id="coins">${money(wallet.value)}</b></span></header>
    <div class="game-toolbar"><span class="round">ROUND <b id="round">0</b></span><button class="sound game-btn secondary">آواز: آن</button><button class="help game-btn secondary">مکمل قواعد</button><button class="paytable game-btn secondary">Paytable</button><span class="free-spin-count" id="freeSpinCount">فری اسپنز: 0</span></div>
    <div class="playfield" id="field"></div><div class="bet-control"><label>BET <select id="betSelect" aria-label="Stake amount"><option>100</option><option>200</option><option>400</option><option>500</option><option>1000</option><option>1500</option><option>2000</option><option>2500</option><option>3000</option><option>5000</option><option>20000</option><option>100000</option></select></label></div>
    <div class="controls" id="controls"></div><p class="result" id="result">گیم شروع کرنے کے لیے بٹن دبائیں۔</p><div class="history"><b>پچھلے راؤنڈ</b><span id="history">ابھی کوئی راؤنڈ نہیں</span></div>
  </section>`;
  const field=root.querySelector("#field"),controls=root.querySelector("#controls");
  const addHistory=t=>{const h=root.querySelector("#history");h.textContent=(t+"  •  "+h.textContent).slice(0,180);};
  const betSelect=root.querySelector("#betSelect");
  betSelect.value=String(bet);
  betSelect.onchange=()=>{bet=Number(betSelect.value)||100;};
  fetch("/api/stakes").then(r=>r.ok?r.json():null).then(d=>{if(!d?.stakes?.length)return;betSelect.innerHTML=d.stakes.map(v=>`<option value="${v}">${Number(v).toLocaleString()}</option>`).join("");bet=Number(betSelect.value)||d.stakes[0];}).catch(()=>{});
  root.querySelector(".sound").onclick=e=>{soundOn=!soundOn;e.currentTarget.textContent="آواز: "+(soundOn?"آن":"بند");};
  root.querySelector(".help").onclick=()=>{
    const r=game.rules||{};
    const bonus=r.bonus||{};
    const payouts=r.payouts||{};
    say(`${r.goal||helpText()} بونس: ${bonus.trigger||"اسکرین پر دکھائے گئے بونس اصول"}؛ فری اسپنز: ${bonus.rounds||0}؛ ادائیگی: ${JSON.stringify(payouts)}`);
  };
  root.querySelector(".paytable").onclick=()=>{
    const p=(game.rules&&game.rules.payouts)||{};
    say("PAYTABLE — "+(Object.keys(p).length?Object.entries(p).map(([k,v])=>`${k}: ×${v}`).join(" | "):"اس گیم کی ادائیگی کے اصول گیم راؤنڈ میں دکھائے جاتے ہیں۔"));
  };
  root.querySelector(".back").onclick=()=>{stopTimer();root.dispatchEvent(new CustomEvent("backtolobby",{bubbles:true}));};
  const startRound=()=>{round++;root.querySelector("#round").textContent=round;};
  const resetField=(html)=>{field.innerHTML=html;};
  function helpText(){return ({
    slot:"بیٹ منتخب کریں، اسپن دبائیں۔ تین ریلز کے سمبل ملنے پر پریکٹس کوائنز ملتے ہیں۔",
    crash:"راؤنڈ شروع کریں اور ملٹی پلائر بڑھنے کے دوران کریش سے پہلے کیش آؤٹ کریں۔",
    steps:"ہر قدم کے بعد آگے بڑھیں یا کیش آؤٹ کریں۔ اگلے قدم پر خطرہ بڑھتا ہے۔",
    plinko:"گیند ڈراپ کریں؛ نیچے جس خانے میں گرے اسی کے مطابق نتیجہ ہوگا۔",
    wheel:"وہیل اسپن کریں اور منتخب حصے کے ملٹی پلائر کے مطابق نتیجہ دیکھیں۔",
    dice:"ڈائس کے مجموعے کی پیش گوئی کریں۔",
    fishing:"نشانہ لگائیں اور فائر کرکے ہدف کو پکڑنے کی کوشش کریں۔",
    arcade:"ٹارگٹ کو ہٹ کریں، اسکور بنائیں اور راؤنڈ ختم کریں۔",
    puzzle:"دکھائی گئی ترتیب کو درست دہرائیں۔",
    card:"کارڈ ڈیل کریں اور کارڈ گیم کے اصول کے مطابق کھیلیں۔",
    blackjack:"21 کے قریب اسکور بنائیں، 21 سے اوپر نہ جائیں۔",
    rummy:"کارڈز سے سیٹ اور رن بنانے کی کوشش کریں۔",
    poker:"اپنے پانچ کارڈز کی ہینڈ رینکنگ دیکھیں۔"
  })[engine]||"اس گیم کے راؤنڈ میں اسکرین پر دی گئی ہدایات پر عمل کریں۔";}
  function slots(){
    const symbols=["🍒","⭐","💎","🔔","7️⃣","🍀","👑","🪙","🎁"];
    const bonusRounds=Number(game.rules?.bonus?.rounds||8);
    const pay=game.rules?.payouts||{three_match:12,two_match:2};
    const freeCount=()=>{const el=root.querySelector("#freeSpinCount");if(el)el.textContent="فری اسپنز: "+freeSpins;};
    resetField(`<div class="arena-label">${game.name.toUpperCase()}</div><div class="reels"><span>🍒</span><span>⭐</span><span>💎</span></div><div class="payline">━━━━━━━━━━━━━━━━</div><p class="hint">تین ایک جیسے سمبل جیت دیتے ہیں؛ تین 🎁 بونس فری اسپنز کھولتے ہیں۔</p>`);
    button("اسپن کریں",()=>{
      const isFree=freeSpins>0;
      if(!isFree&&!spend(bet))return;
      if(isFree){freeSpins--;freeCount();}
      startRound();
      const reel=field.querySelector(".reels");reel.classList.add("spinning");
      const vals=[pick(symbols),pick(symbols),pick(symbols)];
      setTimeout(()=>{
        reel.classList.remove("spinning");
        reel.innerHTML=vals.map(s=>`<span>${s}</span>`).join("");
        let win=0, msg="";
        if(vals.every(v=>v==="🎁")){
          freeSpins+=bonusRounds;freeCount();
          msg=`بونس فعال! آپ کو ${bonusRounds} فری اسپنز ملے۔`;
        } else if(vals.every(v=>v===vals[0])){
          win=bet*Number(pay.three_match||12);
          msg=`تین سمبل میچ · ادائیگی ×${pay.three_match||12}`;
        } else if(new Set(vals).size===2){
          win=bet*Number(pay.two_match||2);
          msg=`دو سمبل میچ · ادائیگی ×${pay.two_match||2}`;
        } else msg="اس راؤنڈ میں کوئی میچ نہیں ہوا۔";
        if(win)award(win);
        say((isFree?"فری اسپن — ":"")+msg+(win?` · +${money(win)} کوائنز`:""));
        addHistory(msg);
      },Number(game.animationProfile?.reelDurationMs||650));
    });
    button("فری اسپن استعمال کریں",()=>{
      if(!freeSpins){say("فری اسپنز حاصل کرنے کے لیے تین 🎁 بونس سمبل ملائیں۔");return;}
      root.querySelector("#controls button")?.click();
    });
    button("آٹو ×5",()=>{
      let w=0,done=0;
      for(let i=0;i<5;i++){
        const isFree=freeSpins>0;
        if(!isFree&&wallet.value<bet)break;
        if(isFree)freeSpins--;else wallet.value-=bet;
        done++;
        const v=[0,1,2].map(()=>pick(symbols));
        if(v.every(x=>x==="🎁"))freeSpins+=bonusRounds;
        else if(v.every(x=>x===v[0]))w+=bet*Number(pay.three_match||12);
        else if(new Set(v).size===2)w+=bet*Number(pay.two_match||2);
      }
      if(w)award(w);updateWallet();freeCount();startRound();
      say(`${done} آٹو اسپنز مکمل · جیت ${money(w)} · فری اسپنز ${freeSpins}`);
      addHistory(`Auto ${money(w)}`);
    });
    freeCount();
  }
  function crash(){
    resetField(`<div class="multiplier" id="mult">1.00×</div><div class="flight">✈️</div><div class="crash-track"><span id="track"></span></div><p class="hint">کریش ہونے سے پہلے کیش آؤٹ کریں</p>`);
    button("راؤنڈ شروع",()=>{if(active||!spend(bet))return;startRound();active=true;let m=1;const limit=1.15+Math.random()*5.5;const el=field.querySelector("#mult");say("ملٹی پلائر بڑھ رہا ہے…");timer=setInterval(()=>{m+=.04+m*.008;el.textContent=m.toFixed(2)+"×";field.querySelector("#track").style.width=Math.min(100,m/limit*100)+"%";if(m>=limit){stopTimer();active=false;el.textContent="CRASH";say("کریش! اس راؤنڈ کی بیٹ ختم ہوگئی۔");addHistory("Crash");}},90);});
    button("کیش آؤٹ",()=>{if(!active)return;stopTimer();active=false;const m=Number(field.querySelector("#mult").textContent.replace("×",""));const win=bet*m;award(win);const msg=`کیش آؤٹ ${m.toFixed(2)}× · +${money(win)}`;say(msg);addHistory(msg);});
  }
  function plinko(){
    const mults=[.2,.5,1,2,5,2,1,.5,.2];
    resetField(`<div class="pegboard">${Array.from({length:7},(_,r)=>`<div class="peg-row">${Array.from({length:r+3},()=>'<i></i>').join("")}</div>`).join("")}</div><div class="slots">${mults.map(m=>`<b>×${m}</b>`).join("")}</div><div class="ball" id="ball">●</div><p class="hint">گیند کو اوپر سے ڈراپ کریں</p>`);
    button("گیند ڈراپ کریں",()=>{if(!spend(bet))return;startRound();const idx=Math.floor(Math.random()*mults.length),m=mults[idx],win=bet*m;const ball=field.querySelector("#ball");ball.style.left=(7+idx*10.5)+"%";ball.classList.add("drop");setTimeout(()=>{if(win)award(win);const msg=`گیند ×${m} خانے میں گری · ${money(win)} کوائنز`;say(msg);addHistory(msg);ball.classList.remove("drop");},550);});
  }
  function wheel(){
    const segments=["×0","×0.5","×1","×2","×3","×5","×2","×1"];
    resetField(`<div class="wheel-wrap"><div class="wheel" id="wheel">🎡</div><div class="wheel-pointer">▼</div></div><div class="wheel-legend">${segments.map(s=>`<span>${s}</span>`).join("")}</div>`);
    button("وہیل اسپن کریں",()=>{if(!spend(bet))return;startRound();const i=Math.floor(Math.random()*segments.length),m=Number(segments[i].slice(1)),el=field.querySelector("#wheel");el.style.transform=`rotate(${720+i*45+Math.random()*30}deg)`;setTimeout(()=>{const win=bet*m;if(win)award(win);const msg=`نتیجہ ${segments[i]} · ${money(win)} کوائنز`;say(msg);addHistory(msg);},900);});
  }
  function dice(){
    resetField(`<div class="dice" id="dice">⚄　⚄</div><p class="hint">دو ڈائس کا مجموعہ منتخب کریں</p>`);
    const roll=(p)=>{if(!spend(bet))return;startRound();const a=1+Math.floor(Math.random()*6),b=1+Math.floor(Math.random()*6),s=a+b;const ok=(p==="low"&&s<=6)||(p==="high"&&s>=8)||(p==="seven"&&s===7);const win=ok?bet*(p==="seven"?5:2):0;if(win)award(win);field.querySelector("#dice").textContent=`${"⚀⚁⚂⚃⚄⚅"[a-1]}　${"⚀⚁⚂⚃⚄⚅"[b-1]}`;const msg=`ڈائس ${a}+${b}=${s}۔ ${ok?"درست پیش گوئی!":"پیش گوئی درست نہیں۔"} ${money(win)}`;say(msg);addHistory(msg);};
    button("کم (2–6)",()=>roll("low"));button("سات",()=>roll("seven"));button("زیادہ (8–12)",()=>roll("high"));
  }
  function fishing(){
    resetField(`<div class="ocean" id="ocean"><span>🐠</span><span>🐟</span><span>🦑</span><span>🐡</span><span>🪸</span></div><div class="aim">◎</div><p class="hint">مچھلی کو نشانہ بنا کر فائر کریں</p>`);
    button("فائر",()=>{if(!spend(Math.max(1,Math.ceil(bet/2))))return;startRound();const fish=pick(["🐠","🐟","🦑","🐡","🦈","🐢"]),hit=Math.random()>.38,win=hit?bet*(1+Math.floor(Math.random()*4)):0;if(win)award(win);field.querySelector("#ocean").innerHTML=`<span>${fish}</span><span>${hit?"💥":"💨"}</span><span>🪸</span>`;const msg=hit?`نشانہ کامیاب · +${money(win)}`:"نشانہ خطا ہوگیا۔";say(msg);addHistory(msg);});
    button("کینن پاور +",()=>say("کینن پاور بڑھا دی گئی۔"));button("آٹو فائر",()=>say("آٹو فائر موڈ: پریکٹس کنٹرول دستیاب ہے۔"));
  }
  function arcade(){
    score=0;resetField(`<div class="arcade-target" id="target">✦</div><div class="score">SCORE <b id="score">0</b></div><p class="hint">ٹارگٹ پر کلک کرکے پوائنٹس حاصل کریں</p>`);
    field.querySelector("#target").onclick=()=>{score+=1+Math.floor(Math.random()*5);field.querySelector("#score").textContent=score;field.querySelector("#target").textContent=pick(["✦","💎","⭐","🌟","🎯"]);playTone(500+score*10);};
    button("راؤنڈ ختم کریں",()=>{startRound();const win=score;award(win);const msg=`اسکور ${score} · +${money(win)} کوائنز`;say(msg);addHistory(msg);score=0;field.querySelector("#score").textContent="0";});
  }
  function puzzle(){
    let seq=[],target=Array.from({length:4},()=>1+Math.floor(Math.random()*4));
    resetField(`<div class="sequence" id="sequence">${target.join(" · ")}</div><div class="puzzle-grid">${[1,2,3,4].map(x=>`<button data-n="${x}">${x}</button>`).join("")}</div><p class="hint">اوپر دکھائی گئی ترتیب دہرائیں</p>`);
    field.querySelectorAll("[data-n]").forEach(b=>b.onclick=()=>{seq.push(Number(b.dataset.n));playTone(300+Number(b.dataset.n)*100);if(seq.length===target.length){startRound();const ok=seq.every((v,i)=>v===target[i]);const win=ok?bet*2:0;if(win)award(win);const msg=ok?`پزل حل ہوگیا · +${money(win)}`:"ترتیب غلط ہے۔ نیا راؤنڈ شروع کریں۔";say(msg);addHistory(msg);seq=[];target=Array.from({length:4},()=>1+Math.floor(Math.random()*4));field.querySelector("#sequence").textContent=target.join(" · ");}});
    button("نئی ترتیب",()=>{seq=[];target=Array.from({length:4},()=>1+Math.floor(Math.random()*4));field.querySelector("#sequence").textContent=target.join(" · ");say("نئی ترتیب دکھا دی گئی ہے۔");});
  }
  function steps(){
    let step=0;resetField(`<div class="path" id="path">🐔　⬜　⬜　⬜　🏁</div><p class="hint">ہر قدم کے بعد آگے بڑھیں یا کیش آؤٹ کریں</p>`);
    button("اگلا قدم",()=>{if(!step&&!spend(bet))return;if(step>=3)return;step++;const fail=Math.random()<.18;if(fail){step=0;field.querySelector("#path").textContent="🐔　💥　⬜　⬜　🏁";say("رکاوٹ آگئی، راؤنڈ ختم ہوگیا۔");addHistory("Obstacle");return;}field.querySelector("#path").textContent="🐔　"+"🟩　".repeat(step)+"⬜　".repeat(3-step)+"🏁";say(`قدم ${step} · ملٹی پلائر ${(1+step*.65).toFixed(2)}×`);});
    button("کیش آؤٹ",()=>{if(!step)return;const win=bet*(1+step*.65);award(win);const msg=`کیش آؤٹ · +${money(win)}`;say(msg);addHistory(msg);step=0;});
  }
  function blackjack(){
    const names=["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
    let hand=[];const val=x=>x==="A"?11:["J","Q","K"].includes(x)?10:Number(x);
    const total=arr=>arr.reduce((s,x)=>s+val(x),0);
    resetField(`<div class="cards" id="cards"></div><p class="hint">ڈیل کریں، پھر Hit یا Stand منتخب کریں۔</p>`);
    const draw=()=>pick(names);
    const paint=()=>field.querySelector("#cards").innerHTML=hand.map(x=>`<span>${x}<small>♠</small></span>`).join("");
    button("ڈیل",()=>{if(active||!spend(bet))return;startRound();active=true;hand=[draw(),draw()];paint();say(`آپ کے کارڈز کا مجموعہ ${total(hand)} ہے۔`);});
    button("Hit",()=>{if(!active)return;hand.push(draw());paint();const t=total(hand);if(t>21){active=false;say(`Bust! مجموعہ ${t}۔`);addHistory("Bust");}else say(`مجموعہ ${t}۔`);});
    button("Stand",()=>{if(!active)return;active=false;const t=total(hand),win=t===21?bet*2:t>17?bet:0;if(win)award(win);say(`آپ کا مجموعہ ${t} · انعام ${money(win)}`);addHistory(`Stand ${t}`);});
  }
  function rummy(){
    const deck=["A","2","3","4","5","6","7","8","9","10","J","Q","K"];let hand=[];
    resetField(`<div class="cards" id="cards"></div><p class="hint">سات کارڈ جمع کریں؛ تین ایک جیسے رینک یا لگاتار رن تلاش کریں۔</p>`);
    const paint=()=>field.querySelector("#cards").innerHTML=hand.map(x=>`<span>${x}<small>♣</small></span>`).join("");
    button("کارڈ ڈرا کریں",()=>{if(hand.length>=7)return;if(!hand.length&&!spend(bet))return;hand.push(pick(deck));paint();say(`آپ کے پاس ${hand.length}/7 کارڈ ہیں۔`);});
    button("سیٹ چیک کریں",()=>{if(hand.length<3){say("کم از کم تین کارڈ درکار ہیں۔");return;}startRound();const counts={};hand.forEach(x=>counts[x]=(counts[x]||0)+1);const ok=Object.values(counts).some(n=>n>=3);const win=ok?bet*3:0;if(win)award(win);say(ok?`سیٹ مکمل · +${money(win)}`:"ابھی تین ایک جیسے کارڈ نہیں ملے۔");addHistory("Rummy check");hand=[];paint();});
    button("کارڈ پھینکیں",()=>{hand.pop();paint();});
  }
  function poker(){
    const ranks=["2","3","4","5","6","7","8","9","10","J","Q","K","A"],suits=["♠","♥","♦","♣"];
    resetField(`<div class="cards" id="cards"></div><p class="hint">پانچ کارڈ ڈیل کریں اور اپنی ہینڈ دیکھیں۔</p>`);
    button("ڈیل ہینڈ",()=>{if(!spend(bet))return;startRound();const cards=Array.from({length:5},()=>pick(ranks)+pick(suits));field.querySelector("#cards").innerHTML=cards.map(x=>`<span>${x}</span>`).join("");const counts={};cards.forEach(x=>{const r=x.replace(/[♠♥♦♣]/g,"");counts[r]=(counts[r]||0)+1;});const pair=Object.values(counts).some(n=>n>=2);const win=pair?bet*2:0;if(win)award(win);say(pair?`کم از کم ایک جوڑا · +${money(win)}`:"اس ہینڈ میں جوڑا نہیں بنا۔");addHistory("Poker hand");});
  }
  function generic(){
    resetField(`<div class="arena-label">${game.name.toUpperCase()}</div><div class="arcade-target">✧</div><p class="hint">اس گیم کا بنیادی پریکٹس راؤنڈ</p>`);
    button("راؤنڈ شروع کریں",()=>{if(!spend(bet))return;startRound();const win=Math.random()>.5?bet*2:0;if(win)award(win);say(win?`راؤنڈ کامیاب · +${money(win)}`:"راؤنڈ مکمل، دوبارہ کوشش کریں۔");addHistory(money(win));});
  }
  const map={slot:slots,crash,steps,plinko,wheel,dice,fishing,arcade,puzzle,card:generic,blackjack,rummy,poker};
  (map[engine]||generic)();
  return ()=>stopTimer();
}
