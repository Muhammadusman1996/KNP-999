import crypto from "node:crypto";
// Standalone server engine for texas-hold-em (Game #150); no shared profile resolver.
const GAME={id:150,name:"Texas Hold'em",profile:"poker",variant:"texas-hold-em",rules:{"engineId": "knp-150-texas-hold-em", "title": "Texas Hold'em", "objective": "Texas Hold'em: Hold’em Hand", "instructions": "Receive hole cards and compare your hand strength against a virtual board.", "mechanic": "Hold’em Hand", "parameters": {"mode": 41, "difficulty": 1, "target": 10, "risk": 0.55, "reward": 1.2, "sequenceLength": 4, "symbolCount": 9}, "uniqueRuleVersion": 1},parameters:{"target": 4, "range": 10, "rounds": 3, "difficulty": 1, "winRate": 45, "base": 2.4, "bonus": 4.83, "symbols": 9, "lanes": 4, "sequence": 6}}
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const reels=Array.from({length:3},()=>crypto.randomInt(0,12));
      const freq=reels.reduce((m,x)=>(m[x]=(m[x]||0)+1,m),{});
      const pairs=Object.values(freq).filter(x=>x===2).length, triple=Object.values(freq).includes(3);
      multiplier=triple?3.11:pairs?3.06:0;
      result={...result,mechanic:"Reel constellation",reels,matched:triple?3:pairs?2:0,symbolPool:12};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
