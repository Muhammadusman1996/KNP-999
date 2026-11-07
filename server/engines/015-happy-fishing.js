import crypto from "node:crypto";
// Original KNP-999 virtual-play rules for Happy Fishing (Game #15).
// Server-authoritative result; virtual coins only, no cash value or withdrawals.
const GAME={id:15,name:"Happy Fishing",profile:"fishing",symbols:["🍒", "🍋", "🔔", "💎", "7️⃣", "👑"],payTriple:5};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake);if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid virtual coin stake");
 let multiplier=0;
 let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,action};
 const target=Math.max(0,Math.min(5,Number(choice.target||0)));
 const fish=["🐟","🐠","🦀","🐡","🦈","🐉"][target],hit=crypto.randomInt(0,100)<(68-target*8);
 multiplier=hit?Number((1.5+target*0.75).toFixed(2)):0;
 result={...result,mechanic:"Fishing catch",target,fish,caught:hit};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,resolve});
export default engine;
