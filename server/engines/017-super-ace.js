import crypto from "node:crypto";
// Original KNP-999 virtual-play rules for Super Ace (Game #17).
// Server-authoritative result; virtual coins only, no cash value or withdrawals.
const GAME={id:17,name:"Super Ace",profile:"blackjack",symbols:["🍒", "🍋", "🔔", "💎", "7️⃣", "👑"],payTriple:5};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake);if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid virtual coin stake");
 let multiplier=0;
 let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,action};
 const card=()=>{const n=crypto.randomInt(1,14);return n===1?11:Math.min(n,10);};
 const player=[card(),card()],dealer=[card(),card()];
 const total=a=>a.reduce((s,n)=>s+n,0);
 let p=total(player),d=total(dealer);while(d<17)d+=card();
 multiplier=p>21?0:d>21||p>d?2:p===d?1:0;
 result={...result,mechanic:"Blackjack hand",player,dealer,playerTotal:p,dealerTotal:d,outcome:multiplier===2?"win":multiplier===1?"push":"lose"};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,resolve});
export default engine;
