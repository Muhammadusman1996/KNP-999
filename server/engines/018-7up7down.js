import crypto from "node:crypto";
// Original KNP-999 virtual-play rules for 7up7down (Game #18).
// Server-authoritative result; virtual coins only, no cash value or withdrawals.
const GAME={id:18,name:"7up7down",profile:"dice",symbols:["🍒", "🍋", "🔔", "💎", "7️⃣", "👑"],payTriple:5};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake);if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid virtual coin stake");
 let multiplier=0;
 let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,action};
 const a=1+crypto.randomInt(0,6),b=1+crypto.randomInt(0,6),sum=a+b;
 const prediction=String(choice.prediction||"seven");
 const won=prediction==="low"?sum<=6:prediction==="high"?sum>=8:sum===7;
 multiplier=won?(prediction==="seven"?5:2):0;
 result={...result,mechanic:"7up7down dice",dice:[a,b],sum,prediction,won};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,resolve});
export default engine;
