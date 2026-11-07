import crypto from "node:crypto";
// Original KNP-999 virtual-play rules for Chicken Road 2.0 (Game #9).
// Server-authoritative result; virtual coins only, no cash value or withdrawals.
const GAME={id:9,name:"Chicken Road 2.0",profile:"steps",symbols:["🍒", "🍋", "🔔", "💎", "7️⃣", "👑"],payTriple:5};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake);if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid virtual coin stake");
 let multiplier=0;
 let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,action};
 const maxSteps=5,steps=Math.max(1,Math.min(maxSteps,Number(choice.steps||1)));
 const hazardAt=1+crypto.randomInt(0,maxSteps);
 const failed=steps>=hazardAt;
 multiplier=failed?0:Number(Math.pow(1.45,steps).toFixed(2));
 result={...result,mechanic:"Safe path",steps,hazardAt,failed};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,resolve});
export default engine;
