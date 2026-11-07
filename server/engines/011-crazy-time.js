import crypto from "node:crypto";
// Original KNP-999 virtual-play rules for Crazy Time (Game #11).
// Server-authoritative result; virtual coins only, no cash value or withdrawals.
const GAME={id:11,name:"Crazy Time",profile:"wheel",symbols:["🍒", "🍋", "🔔", "💎", "7️⃣", "👑"],payTriple:5};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake);if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid virtual coin stake");
 let multiplier=0;
 let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,action};
 const segments=[0,0.5,1,1.5,2,3,5,2,1,0.5,4,0];
 const index=crypto.randomInt(0,segments.length);multiplier=segments[index];
 result={...result,mechanic:"Prize wheel",segment:index+1,multiplier};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,resolve});
export default engine;
