import crypto from "node:crypto";
// Standalone server engine for Solar Dash (Game #30); no shared profile resolver.
const GAME={id:30,name:"Solar Dash",profile:"slot",variant:"solar-dash",rules:{"engineId": "knp-030-solar-dash", "title": "Solar Dash", "objective": "Solar Dash: Lucky Draw", "instructions": "Choose a number band; a server-generated draw decides whether the selection wins.", "mechanic": "Lucky Draw", "parameters": {"mode": 223, "difficulty": 1, "target": 10, "risk": 0.27, "reward": 3.0, "sequenceLength": 3, "symbolCount": 10}, "uniqueRuleVersion": 2},parameters:{"target": 3, "range": 10, "rounds": 6, "difficulty": 1, "winRate": 50, "base": 3.1, "bonus": 3.25, "symbols": 10, "lanes": 3, "sequence": 3}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const reels=Array.from({length:3},()=>crypto.randomInt(0,10));
      const freq=reels.reduce((m,x)=>(m[x]=(m[x]||0)+1,m),{});
      const pairs=Object.values(freq).filter(x=>x===2).length, triple=Object.values(freq).includes(3);
      multiplier=triple?3.25:pairs?3.1:0;
      result={...result,mechanic:"Reel constellation",reels,matched:triple?3:pairs?2:0,symbolPool:10};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
