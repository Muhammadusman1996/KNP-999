import crypto from "node:crypto";
// Original KNP-999 virtual-play rules for Rummy (Game #19).
// Server-authoritative result; virtual coins only, no cash value or withdrawals.
const GAME={id:19,name:"Rummy",profile:"rummy",symbols:["🍒", "🍋", "🔔", "💎", "7️⃣", "👑"],payTriple:5};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake);if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid virtual coin stake");
 let multiplier=0;
 let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,action};
 const ranks=["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
 const submitted=Array.isArray(choice.hand)?choice.hand.map(String).slice(0,7):[];
 const cards=submitted.length>=3&&submitted.length<=7?submitted:Array.from({length:7},()=>ranks[crypto.randomInt(0,ranks.length)]);
 const counts=cards.reduce((m,x)=>(m[x]=(m[x]||0)+1,m),{});
 const set=Object.values(counts).some(n=>n>=3);
 multiplier=set?3:0;
 result={...result,mechanic:"Rummy draw",cards,hasSet:set};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,resolve});
export default engine;
