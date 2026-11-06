import crypto from "node:crypto";
// Standalone server engine for Solar Adventure (Game #126); no shared profile resolver.
const GAME={id:126,name:"Solar Adventure",profile:"slot",variant:"solar-adventure",rules:{"engineId": "knp-126-solar-adventure", "title": "Solar Adventure", "objective": "Solar Adventure: Target Trial", "instructions": "Choose a target lane; hits are resolved on the server with game-specific accuracy and reward values.", "mechanic": "Target Trial", "parameters": {"mode": 839, "difficulty": 2, "target": 9, "risk": 0.37, "reward": 1.65, "sequenceLength": 3, "symbolCount": 9}, "uniqueRuleVersion": 2},parameters:{"target": 14, "range": 18, "rounds": 7, "difficulty": 1, "winRate": 60, "base": 3.65, "bonus": 1.9, "symbols": 9, "lanes": 3, "sequence": 3}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const samples=Array.from({length:4},()=>crypto.randomInt(0,19));
      const target=Number(choice.target??14);
      const distance=Math.abs(samples.reduce((a,b)=>a+b,0)-target);
      multiplier=distance===0?1.9:distance<=2?3.65:0;
      result={...result,mechanic:"Sum precision",samples,target,distance,total:samples.reduce((a,b)=>a+b,0)};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
