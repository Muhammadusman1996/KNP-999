import crypto from "node:crypto";
// Standalone server engine for Crystal Adventure (Game #86); no shared profile resolver.
const GAME={id:86,name:"Crystal Adventure",profile:"slot",variant:"crystal-adventure",rules:{"engineId": "knp-086-crystal-adventure", "title": "Crystal Adventure", "objective": "Crystal Adventure: Lucky Draw", "instructions": "Choose a number band; a server-generated draw decides whether the selection wins.", "mechanic": "Lucky Draw", "parameters": {"mode": 378, "difficulty": 2, "target": 12, "risk": 0.23, "reward": 4.06, "sequenceLength": 4, "symbolCount": 10}, "uniqueRuleVersion": 2},parameters:{"target": 7, "range": 7, "rounds": 8, "difficulty": 2, "winRate": 46, "base": 1.26, "bonus": 4.31, "symbols": 10, "lanes": 4, "sequence": 4}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const samples=Array.from({length:4},()=>crypto.randomInt(0,8));
      const target=Number(choice.target??7);
      const distance=Math.abs(samples.reduce((a,b)=>a+b,0)-target);
      multiplier=distance===0?4.31:distance<=2?1.26:0;
      result={...result,mechanic:"Sum precision",samples,target,distance,total:samples.reduce((a,b)=>a+b,0)};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
