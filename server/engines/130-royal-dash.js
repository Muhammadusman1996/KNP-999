import crypto from "node:crypto";
// Standalone server engine for Royal Dash (Game #130); no shared profile resolver.
const GAME={id:130,name:"Royal Dash",profile:"card",variant:"royal-dash",rules:{"engineId": "knp-130-royal-dash", "title": "Royal Dash", "objective": "Royal Dash: Lucky Draw", "instructions": "Choose a number band; a server-generated draw decides whether the selection wins.", "mechanic": "Lucky Draw", "parameters": {"mode": 932, "difficulty": 1, "target": 4, "risk": 0.31, "reward": 2.89, "sequenceLength": 7, "symbolCount": 9}, "uniqueRuleVersion": 2},parameters:{"target": 6, "range": 10, "rounds": 7, "difficulty": 5, "winRate": 54, "base": 3.59, "bonus": 3.14, "symbols": 9, "lanes": 7, "sequence": 7}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const reels=Array.from({length:3},()=>crypto.randomInt(0,9));
      const freq=reels.reduce((m,x)=>(m[x]=(m[x]||0)+1,m),{});
      const pairs=Object.values(freq).filter(x=>x===2).length, triple=Object.values(freq).includes(3);
      multiplier=triple?3.14:pairs?3.59:0;
      result={...result,mechanic:"Reel constellation",reels,matched:triple?3:pairs?2:0,symbolPool:9};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
