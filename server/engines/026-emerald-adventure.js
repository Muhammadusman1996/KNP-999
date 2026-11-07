import crypto from "node:crypto";
// Standalone server engine for Emerald Adventure (Game #26); no shared profile resolver.
const GAME={id:26,name:"Emerald Adventure",profile:"card",variant:"emerald-adventure",rules:{"engineId": "knp-026-emerald-adventure", "title": "Emerald Adventure", "objective": "Emerald Adventure: Lucky Draw", "instructions": "Choose a number band; a server-generated draw decides whether the selection wins.", "mechanic": "Lucky Draw", "parameters": {"mode": 152, "difficulty": 2, "target": 4, "risk": 0.23, "reward": 3.16, "sequenceLength": 4, "symbolCount": 12}, "uniqueRuleVersion": 2},parameters:{"target": 5, "range": 21, "rounds": 8, "difficulty": 2, "winRate": 46, "base": 2.16, "bonus": 3.41, "symbols": 12, "lanes": 4, "sequence": 4}};
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
