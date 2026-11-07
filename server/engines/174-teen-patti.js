import crypto from "node:crypto";
// Standalone server engine for teen-patti (Game #174); no shared profile resolver.
const GAME={id:174,name:"Teen Patti",profile:"card",variant:"teen-patti",rules:{"engineId": "knp-174-teen-patti", "title": "Teen Patti", "objective": "Teen Patti: Three Card Patti", "instructions": "Play a three-card hand and compare its server-scored rank.", "mechanic": "Three Card Patti", "parameters": {"mode": 198, "difficulty": 5, "target": 8, "risk": 0.39, "reward": 3.6, "sequenceLength": 8, "symbolCount": 12}, "uniqueRuleVersion": 1},parameters:{"target": 13, "range": 19, "rounds": 3, "difficulty": 5, "winRate": 69, "base": 2.4, "bonus": 6.17, "symbols": 12, "lanes": 8, "sequence": 6}}
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
