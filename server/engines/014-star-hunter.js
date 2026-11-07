import crypto from "node:crypto";
// Original KNP-999 virtual-play rules for Star Hunter (Game #14).
// Server-authoritative result; virtual coins only, no cash value or withdrawals.
const GAME={id:14,name:"Star Hunter",profile:"arcade",symbols:["🍒", "🍋", "🔔", "💎", "7️⃣", "👑"],payTriple:5};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake);if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid virtual coin stake");
 let multiplier=0;
 let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,action};
 const hits=Math.max(0,Math.min(10,Number(choice.hits||0)));
 const target=5+crypto.randomInt(0,4);multiplier=hits>=target?2.5:hits>=Math.ceil(target/2)?1.2:0;
 result={...result,mechanic:"Target hunt",hits,target};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,resolve});
export default engine;
