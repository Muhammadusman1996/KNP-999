import crypto from "node:crypto";
// Standalone server engine for teen-patti-20-20 (Game #165); no shared profile resolver.
const GAME={id:165,name:"Teen Patti 20-20",profile:"card",variant:"teen-patti-20-20",rules:{"engineId": "knp-165-teen-patti-20-20", "title": "Teen Patti 20-20", "objective": "Teen Patti 20-20: Teen Patti", "instructions": "Compare a three-card hand using a simplified teen-patti ranking.", "mechanic": "Teen Patti", "parameters": {"mode": 45, "difficulty": 1, "target": 12, "risk": 0.3, "reward": 2.7, "sequenceLength": 4, "symbolCount": 10}, "uniqueRuleVersion": 1},parameters:{"target": 4, "range": 10, "rounds": 6, "difficulty": 1, "winRate": 60, "base": 3.0, "bonus": 3.17, "symbols": 10, "lanes": 4, "sequence": 5}}
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const samples=Array.from({length:4},()=>crypto.randomInt(0,22));
      const target=Number(choice.target??5);
      const distance=Math.abs(samples.reduce((a,b)=>a+b,0)-target);
      multiplier=distance===0?3.41:distance<=2?2.16:0;
      result={...result,mechanic:"Sum precision",samples,target,distance,total:samples.reduce((a,b)=>a+b,0)};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
