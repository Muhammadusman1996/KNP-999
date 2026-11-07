import crypto from "node:crypto";
// Original KNP-999 virtual-play rules for Plinko (Game #10).
// Server-authoritative result; virtual coins only, no cash value or withdrawals.
const GAME={id:10,name:"Plinko",profile:"plinko",symbols:["🍒", "🍋", "🔔", "💎", "7️⃣", "👑"],payTriple:5};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake);if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid virtual coin stake");
 let multiplier=0;
 let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,action};
 const bins=[0.2,0.5,1,1.5,2,5,2,1.5,1,0.5,0.2];
 const path=Array.from({length:10},()=>crypto.randomInt(0,2));
 const index=Math.max(0,Math.min(bins.length-1,path.reduce((a,b)=>a+b,0)));
 multiplier=bins[index];
 result={...result,mechanic:"Plinko drop",path,bin:index,multiplier};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,resolve});
export default engine;
