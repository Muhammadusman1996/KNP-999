import crypto from "node:crypto";
// Original KNP-999 virtual-play rules for 777 Fruit Slots (Game #4).
// Server-authoritative result; virtual coins only, no cash value or withdrawals.
const GAME={id:4,name:"777 Fruit Slots",profile:"slot",symbols:["🍒", "🍋", "🔔", "💎", "7️⃣", "👑"],payTriple:5};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake);if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid virtual coin stake");
 let multiplier=0;
 let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,action};
 const symbols=GAME.symbols.length?GAME.symbols:["🍒","🍋","🔔","💎","7️⃣","👑"];
 const spinCount=Math.max(1,Math.min(5,Number(choice.spins||1)));
 const spinResults=[];let totalPayout=0;
 for(let n=0;n<spinCount;n++){
   const reels=Array.from({length:3},()=>symbols[crypto.randomInt(0,symbols.length)]);
   const counts=reels.reduce((m,x)=>(m[x]=(m[x]||0)+1,m),{});
   const triple=Object.values(counts).includes(3),pair=Object.values(counts).includes(2);
   const scatter=reels.filter(x=>x===symbols[0]).length;
   const roundMultiplier=triple?Number(GAME.payTriple||5):pair?1.5:0;
   totalPayout+=(bet/spinCount)*roundMultiplier;
   spinResults.push({reels,match:triple?"triple":pair?"pair":"none",scatter,multiplier:roundMultiplier});
 }
 multiplier=Number((totalPayout/bet).toFixed(3));
 result={...result,mechanic:"Three-reel slot",spinCount,spins:spinResults};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,resolve});
export default engine;
