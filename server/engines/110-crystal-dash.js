import crypto from "node:crypto";
// Standalone server engine for Crystal Dash (Game #110); no shared profile resolver.
const GAME={id:110,name:"Crystal Dash",profile:"slot",variant:"crystal-dash",rules:{"engineId": "knp-110-crystal-dash", "title": "Crystal Dash", "objective": "Crystal Dash: Precision Challenge", "instructions": "Choose a target value; the server generates a challenge value and scores distance from target.", "mechanic": "Precision Challenge", "parameters": {"mode": 214, "difficulty": 1, "target": 2, "risk": 0.39, "reward": 3.72, "sequenceLength": 5, "symbolCount": 10}, "uniqueRuleVersion": 2},parameters:{"target": 16, "range": 22, "rounds": 6, "difficulty": 3, "winRate": 62, "base": 2.32, "bonus": 3.97, "symbols": 10, "lanes": 5, "sequence": 5}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const reels=Array.from({length:3},()=>crypto.randomInt(0,10));
      const freq=reels.reduce((m,x)=>(m[x]=(m[x]||0)+1,m),{});
      const pairs=Object.values(freq).filter(x=>x===2).length, triple=Object.values(freq).includes(3);
      multiplier=triple?3.97:pairs?2.32:0;
      result={...result,mechanic:"Reel constellation",reels,matched:triple?3:pairs?2:0,symbolPool:10};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
