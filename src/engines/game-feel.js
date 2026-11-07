// KNP-999 per-title motion and emotional feedback layer.
// Each title receives deterministic, individualized timing, accent motion and event feedback.
const STYLE_ID = 'knp-game-feel-style';
const css = `
.indie-stage{position:relative;isolation:isolate;overflow:hidden;transform:translateZ(0)}
.indie-stage:before{content:"";position:absolute;inset:-40%;pointer-events:none;z-index:-1;background:radial-gradient(circle at 50% 45%,color-mix(in srgb,var(--g-accent) 22%,transparent),transparent 58%);animation:knpAura var(--knp-aura,5s) ease-in-out infinite alternate;opacity:.75}
.indie-stage:after{content:"";position:absolute;inset:0;pointer-events:none;z-index:5;border:1px solid color-mix(in srgb,var(--g-accent) 18%,transparent);border-radius:inherit;opacity:.5}
.indie-stage .indie-reels span,.indie-stage .indie-cards span,.indie-stage .indie-fish,.indie-stage .indie-target,.indie-stage .indie-dice,.indie-stage .indie-wheel{will-change:transform,filter;animation:knpIdle var(--knp-idle,3.2s) ease-in-out infinite}
.indie-stage .indie-reels span:nth-child(2),.indie-stage .indie-cards span:nth-child(2){animation-delay:.16s}
.indie-stage .indie-reels span:nth-child(3),.indie-stage .indie-cards span:nth-child(3){animation-delay:.32s}
.indie-stage .indie-fish:nth-child(even){animation-delay:.28s}
.indie-stage .indie-fish{transition:transform .22s ease,filter .22s ease}
.indie-stage .indie-fish.chosen{transform:translateY(-9px) scale(1.13);filter:drop-shadow(0 0 13px var(--g-accent))}
.indie-stage .indie-btn:active,.indie-controls .indie-btn:active{transform:scale(.96)}
.indie-stage.knp-action-pulse{animation:knpAction .42s ease}
.indie-stage.knp-win-mood{animation:knpWin .75s ease}
.indie-stage.knp-lose-mood{animation:knpLose .48s ease}
.knp-feel-particle{position:absolute;z-index:8;pointer-events:none;font-size:clamp(14px,2vw,25px);animation:knpParticle 900ms ease-out forwards;filter:drop-shadow(0 0 7px var(--g-accent))}
@keyframes knpAura{from{transform:rotate(-7deg) scale(.94);opacity:.35}to{transform:rotate(7deg) scale(1.08);opacity:.85}}
@keyframes knpIdle{0%,100%{filter:drop-shadow(0 0 0 transparent);transform:translateY(0)}50%{filter:drop-shadow(0 5px 10px color-mix(in srgb,var(--g-accent) 32%,transparent));transform:translateY(-3px)}}
@keyframes knpAction{0%{filter:brightness(1)}45%{filter:brightness(1.28)}100%{filter:brightness(1)}}
@keyframes knpWin{0%{transform:scale(1)}35%{transform:scale(1.018);filter:brightness(1.3) saturate(1.2)}100%{transform:scale(1);filter:none}}
@keyframes knpLose{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}
@keyframes knpParticle{0%{opacity:0;transform:translate(0,12px) scale(.5) rotate(0)}18%{opacity:1}100%{opacity:0;transform:translate(var(--dx),-95px) scale(1.25) rotate(160deg)}}
@media(prefers-reduced-motion:reduce){.indie-stage:before,.indie-stage .indie-reels span,.indie-stage .indie-cards span,.indie-stage .indie-fish,.indie-stage .indie-target,.indie-stage .indie-dice,.indie-stage .indie-wheel{animation:none!important}.knp-feel-particle{display:none}}
`;

export function installGameFeel(root, game){
  if(!root || root.dataset.knpFeelInstalled===String(game.id)) return;
  root.dataset.knpFeelInstalled=String(game.id);
  if(!document.getElementById(STYLE_ID)){const style=document.createElement('style');style.id=STYLE_ID;style.textContent=css;document.head.append(style);}
  const seed=Number(game.id)||1;
  const stage=()=>root.querySelector('[data-stage]');
  const setProfile=()=>{const s=stage();if(!s)return;s.style.setProperty('--knp-aura',`${4+(seed%5)*.55}s`);s.style.setProperty('--knp-idle',`${2.2+(seed%7)*.23}s`);s.dataset.gameMotion=game.engine||'arcade';s.dataset.gameId=String(seed);};
  const burst=(kind)=>{const s=stage();if(!s)return;s.classList.remove('knp-win-mood','knp-lose-mood','knp-action-pulse');void s.offsetWidth;s.classList.add(kind==='win'?'knp-win-mood':kind==='lose'?'knp-lose-mood':'knp-action-pulse');if(kind!=='win')return;const icons=['✦','◆','●','★','✧','⬟'];for(let i=0;i<Math.min(8,3+seed%6);i++){const p=document.createElement('i');p.className='knp-feel-particle';p.textContent=icons[(i+seed)%icons.length];p.style.left=`${12+((i*17+seed*3)%76)}%`;p.style.top=`${48+((i*11+seed)%28)}%`;p.style.setProperty('--dx',`${((i%2)?1:-1)*(18+(seed+i*7)%52)}px`);s.append(p);setTimeout(()=>p.remove(),1000);}};
  const observer=new MutationObserver(()=>{setProfile();});observer.observe(root,{childList:true,subtree:true});
  root.addEventListener('click',e=>{if(e.target.closest('button'))burst('action');},true);
  const msgObserver=new MutationObserver(()=>{const m=root.querySelector('[data-message]');if(!m)return;const t=(m.textContent||'').toLowerCase();if(/win|won|جیت|کامیاب|reward|captured|bonus|پاس/.test(t))burst('win');else if(/lose|lost|ناکام|bust|crash|ہار/.test(t))burst('lose');});
  msgObserver.observe(root,{childList:true,subtree:true,characterData:true});
  root.addEventListener('backtolobby',()=>{observer.disconnect();msgObserver.disconnect();},{once:true});
  setProfile();
}
