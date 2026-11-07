import crypto from "node:crypto";
// Standalone server engine for Royal Adventure (Game #106); no shared profile resolver.
const GAME={id:106,name:"Royal Adventure",profile:"card",variant:"royal-adventure",rules:{"engineId": "knp-106-royal-adventure", "title": "Royal Adventure", "objective": "Royal Adventure: Target Trial", "instructions": "Choose a target lane; hits are resolved on the server with game-specific accuracy and reward values.", "mechanic": "Target Trial", "parameters": {"mode": 99, "difficulty": 2, "target": 12, "risk": 0.41, "reward": 2.09, "sequenceLength": 7, "symbolCount": 11}, "uniqueRuleVersion": 2},parameters:{"target": 9, "range": 19, "rounds": 5, "difficulty": 5, "winRate": 64, "base": 3.69, "bonus": 2.34, "symbols": 11, "lanes": 7, "sequence": 7}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const samples=Array.from({length:4},()=>crypto.randomInt(0,20));
      const target=Number(choice.target??9);
      const distance=Math.abs(samples.reduce((a,b)=>a+b,0)-target);
      multiplier=distance===0?2.34:distance<=2?3.69:0;
      result={...result,mechanic:"Sum precision",samples,target,distance,total:samples.reduce((a,b)=>a+b,0)};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
