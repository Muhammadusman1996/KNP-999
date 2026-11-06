import crypto from "node:crypto";
// Standalone server engine for callbreak (Game #176); no shared profile resolver.
const GAME={id:176,name:"Callbreak",profile:"card",variant:"callbreak",rules:{"engineId": "knp-176-callbreak", "title": "Callbreak", "objective": "Callbreak: Trick Taking", "instructions": "Choose a bid and play a trick-taking round against virtual opponents.", "mechanic": "Trick Taking", "parameters": {"mode": 232, "difficulty": 2, "target": 10, "risk": 0.41, "reward": 3.8, "sequenceLength": 5, "symbolCount": 7}, "uniqueRuleVersion": 1},parameters:{"target": 15, "range": 21, "rounds": 5, "difficulty": 2, "winRate": 36, "base": 2.8, "bonus": 6.83, "symbols": 7, "lanes": 5, "sequence": 4}}
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
