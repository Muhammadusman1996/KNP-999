import crypto from "node:crypto";
// Standalone server engine for Crazy 777 (Game #6); no shared profile resolver.
const GAME={id:6,name:"Crazy 777",profile:"slot",variant:"crazy-777",rules:{"engineId": "knp-006-crazy-777", "title": "Crazy 777", "objective": "Crazy 777: Risk Ladder", "instructions": "Choose how many stages to attempt; each stage increases reward and failure risk.", "mechanic": "Risk Ladder", "parameters": {"mode": 321, "difficulty": 2, "target": 3, "risk": 0.45, "reward": 7.58, "sequenceLength": 6, "symbolCount": 12}, "uniqueRuleVersion": 2},parameters:{"target": 5, "range": 23, "rounds": 6, "difficulty": 4, "winRate": 68, "base": 1.48, "bonus": 7.83, "symbols": 12, "lanes": 6, "sequence": 6}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const samples=Array.from({length:4},()=>crypto.randomInt(0,24));
      const target=Number(choice.target??5);
      const distance=Math.abs(samples.reduce((a,b)=>a+b,0)-target);
      multiplier=distance===0?7.83:distance<=2?1.48:0;
      result={...result,mechanic:"Sum precision",samples,target,distance,total:samples.reduce((a,b)=>a+b,0)};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
