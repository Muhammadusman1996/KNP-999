import crypto from "node:crypto";
// Original KNP-999 virtual-play rules for Poker (Game #20).
// Server-authoritative result; virtual coins only, no cash value or withdrawals.
const GAME={id:20,name:"Poker",profile:"poker",symbols:["🍒", "🍋", "🔔", "💎", "7️⃣", "👑"],payTriple:5};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake);if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid virtual coin stake");
 let multiplier=0;
 let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,action};
 const ranks=["2","3","4","5","6","7","8","9","10","J","Q","K","A"],suits=["♠","♥","♦","♣"];
 const submitted=Array.isArray(choice.hand)?choice.hand.map(String).slice(0,5):[];
 const cards=submitted.length===5?submitted.map(c=>({r:c.slice(0,-1),s:c.slice(-1)})):Array.from({length:5},()=>({r:ranks[crypto.randomInt(0,13)],s:suits[crypto.randomInt(0,4)]}));
 const counts=cards.reduce((m,c)=>(m[c.r]=(m[c.r]||0)+1,m),{});
 const vals=Object.values(counts).sort((a,b)=>b-a);
 const flush=cards.every(c=>c.s===cards[0].s),three=vals[0]===3,pair=vals[0]===2;
 multiplier=choice.decision==="fold"?0:flush?5:three?4:pair?2:0;
 result={...result,mechanic:"Five-card poker",cards,hand:flush?"flush":three?"three of a kind":pair?"pair":"high card"};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,resolve});
export default engine;
