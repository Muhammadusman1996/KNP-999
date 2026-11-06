// Independent KNP-999 game module: Happy Fishing (ID 15)
// This game has its own home screen, theme, rules, controls and play logic.
// Virtual coins only; no cash value or cash-out.
const GAME = {
  id:15, name:"Happy Fishing", category:"Fishing", engine:"fishing",
  colors:{"background": "#30182a", "accent": "#ed76cb", "highlight": "#ffc4e9"}, logo:"/logos/happy-fishing.svg", symbols:["🐬", "🐠", "🐟", "🦑", "🐡", "🦈", "🐢", "🦀"],
  multiplier:2, bonus:8,
  description:"سمندری ہدف منتخب کریں، نشانہ لگائیں اور پکڑنے کی کوشش کریں۔"
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
function sfx(kind="click"){
  if(window.__knpSoundOff)return;
  try {
    const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
    const ctx=new C(),o=ctx.createOscillator(),g=ctx.createGain();
    const tones={click:[520,.045],win:[880,.16],lose:[180,.12],bonus:[1040,.22],spin:[640,.08]};
    const [hz,dur]=tones[kind]||tones.click;o.type=kind==="win"||kind==="bonus"?"sine":"triangle";
    o.frequency.setValueAtTime(hz,ctx.currentTime);
    if(kind==="win"||kind==="bonus")o.frequency.exponentialRampToValueAtTime(hz*1.45,ctx.currentTime+dur);
    g.gain.setValueAtTime(.0001,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.07,ctx.currentTime+.012);g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+dur);
    o.connect(g);g.connect(ctx.destination);o.start();o.stop(ctx.currentTime+dur+.02);o.onended=()=>ctx.close();
  } catch(_){}
}
function popEffect(el,kind="result"){
  if(!el)return;el.classList.remove("knp-pop","knp-win","knp-bonus");
  void el.offsetWidth;el.classList.add("knp-pop",kind==="bonus"?"knp-bonus":kind==="win"?"knp-win":"");
}

export default function start(root,wallet){
  let bet=10,round=0,closed=false,timer=null,free=0,score=0,step=0,hand=[],sequence=[],target=[];
  const stop=()=>{if(timer){clearInterval(timer);timer=null;}};
  const spend=()=>{if(wallet.value<bet){say("Coins کافی نہیں ہیں۔");return false;}wallet.value-=bet;updateWallet();sfx("click");return true;};
  const award=n=>{wallet.value+=n;updateWallet();sfx("win");popEffect(root.querySelector("[data-stage]"),"win");say(`آپ نے ${fmt(n)} Coins حاصل کیے۔`);};
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
    const gameBody=`<section class="indie-play-head"><div><p class="indie-kicker">${GAME.category.toUpperCase()}</p><h2>${GAME.name}</h2></div><button class="indie-btn" data-home>GAME HOME</button></section>
    <section class="indie-stage" data-stage></section>
    <section class="indie-bet"><label>BET COINS <select data-bet>${BETS.map(v=>`<option value="${v}">${fmt(v)}</option>`).join("")}</select></label><span>Round <b data-round>0</b></span></section>
    <section class="indie-controls" data-controls></section><p class="indie-message" data-message>Choose your bet and start playing.</p><div class="indie-history" data-history>Recent result: none</div>`;
    shell(gameBody);root.querySelector("[data-home]").onclick=home;
    root.querySelector("[data-bet]").onchange=e=>bet=Number(e.target.value)||10;
    setupEngine();
  };
  const field=()=>root.querySelector("[data-stage]");
  const controls=()=>root.querySelector("[data-controls]");
  const btn=(label,fn)=>{const b=document.createElement("button");b.className="indie-btn indie-action";b.textContent=label;b.onclick=()=>{sfx("click");fn();};controls().append(b);return b;};
  const roundStart=()=>{round++;root.querySelector("[data-round]").textContent=round;};
  const history=s=>{root.querySelector("[data-history]").textContent=`Recent result: ${s}`;root.querySelector("[data-history]").dataset.last=s;};
  const win=(amount,msg)=>{if(amount>0)award(amount);else{sfx("lose");say(msg);}history(msg);};
  function setupEngine(){
    const e=GAME.engine;
    if(e==="slot"){
      field().innerHTML=`<div class="indie-label">${GAME.name}</div><div class="indie-reels"><span>🍒</span><span>💎</span><span>🔔</span></div><p>Match 2 or 3 symbols. Three matching symbols pay the top prize.</p><div class="indie-bonus">Bonus spins: <b data-free>0</b></div>`;
      btn("SPIN",()=>{if(!free&&!spend())return;if(free){free--;root.querySelector("[data-free]").textContent=free;}roundStart();const vals=Array.from({length:3},()=>pick(GAME.symbols));const reels=field().querySelector(".indie-reels");reels.innerHTML=vals.map(x=>`<span>${x}</span>`).join("");let payout=0,msg="No match this round.";if(vals.every(x=>x===vals[0])){payout=bet*GAME.multiplier;msg=`Three of a kind · x${GAME.multiplier}`;}else if(new Set(vals).size===2){payout=bet*1.5;msg="Two symbols matched · x1.5";}if(vals.every(x=>x===GAME.symbols[0])){free+=GAME.bonus;root.querySelector("[data-free]").textContent=free;msg+=` · Bonus ${GAME.bonus} spins`;}win(payout,msg);});
      btn("AUTO SPIN ×5",()=>{let paid=0,won=0;for(let i=0;i<5;i++){if(!free&&!spend())break;if(free)free--;else paid++;const v=Array.from({length:3},()=>pick(GAME.symbols));if(v.every(x=>x===v[0]))won+=bet*GAME.multiplier;else if(new Set(v).size===2)won+=bet*1.5;}roundStart();win(won,`Auto spins complete · ${paid} paid rounds`);});
    }else if(e==="crash"){
      field().innerHTML=`<div class="indie-mult" data-mult>1.00×</div><div class="indie-flight">🚀</div><div class="indie-track"><i data-track></i></div><p>Start the round and cash out before the multiplier crashes.</p>`;
      btn("START ROUND",()=>{if(timer||!spend())return;roundStart();let m=1,limit=1.2+Math.random()*(3.5+GAME.id%6);say("Multiplier rising…");timer=setInterval(()=>{m+=.025+m*.012;field().querySelector("[data-mult]").textContent=m.toFixed(2)+"×";field().querySelector("[data-track]").style.width=Math.min(100,m/limit*100)+"%";if(m>=limit){stop();say("CRASH — bet lost.");history("Crash");}},80);});
      btn("CASH OUT",()=>{if(!timer)return;const m=Number(field().querySelector("[data-mult]").textContent.replace("×",""));stop();win(bet*m,`Cashed out at ${m.toFixed(2)}×`);});
    }else if(e==="wheel"){
      const seg=Array.from({length:12},(_,i)=>[0,.5,1,1.5,2,3,5,2,1,.5,4,0][(i+GAME.id)%12]);
      field().innerHTML=`<div class="indie-wheel" data-wheel>◉</div><div class="indie-segments">${seg.map((x,i)=>`<span>${i+1} · ×${x}</span>`).join("")}</div><p>Spin the wheel and receive the displayed multiplier.</p>`;
      btn("SPIN WHEEL",()=>{if(!spend())return;roundStart();const i=Math.floor(Math.random()*seg.length),m=seg[i],w=field().querySelector("[data-wheel]");w.style.transform=`rotate(${720+i*30}deg)`;setTimeout(()=>win(bet*m,`Wheel result: ×${m}`),800);});
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
  return ()=>{closed=true;stop();};
}
