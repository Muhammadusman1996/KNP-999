import crypto from "node:crypto";
// Original KNP-999 virtual-play rules for FlyX (Game #8).
// Server-authoritative result; virtual coins only, no cash value or withdrawals.
const GAME={id:8,name:"FlyX",profile:"crash",symbols:["🍒", "🍋", "🔔", "💎", "7️⃣", "👑"],payTriple:5};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake);if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid virtual coin stake");
 let multiplier=0;
 let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,action};
 const crashAt=Number((1.15+crypto.randomInt(0,700)/100).toFixed(2));
 const cashout=Number(choice.cashoutAt||0);
 const safe=Number.isFinite(cashout)&&cashout>=1.01&&cashout<crashAt;
 multiplier=safe?cashout:0;
 result={...result,mechanic:"Crash flight",crashAt,cashoutAt:cashout,crashed:!safe};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,resolve});
export default engine;
