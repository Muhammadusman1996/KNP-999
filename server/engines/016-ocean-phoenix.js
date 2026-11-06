import crypto from "node:crypto";
// Standalone server engine for Ocean Phoenix (Game #16); no shared profile resolver.
const GAME={id:16,name:"Ocean Phoenix",profile:"fishing",variant:"ocean-phoenix",rules:{"engineId": "knp-016-ocean-phoenix", "title": "Ocean Phoenix", "objective": "Ocean Phoenix: Combo Quest", "instructions": "Choose a combo type; the server generates a sequence and checks the selected pattern.", "mechanic": "Combo Quest", "parameters": {"mode": 735, "difficulty": 2, "target": 6, "risk": 0.15, "reward": 1.68, "sequenceLength": 6, "symbolCount": 6}, "uniqueRuleVersion": 2},parameters:{"target": 5, "range": 16, "rounds": 6, "difficulty": 4, "winRate": 38, "base": 2.08, "bonus": 1.93, "symbols": 6, "lanes": 6, "sequence": 6}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const samples=Array.from({length:4},()=>crypto.randomInt(0,17));
      const target=Number(choice.target??5);
      const distance=Math.abs(samples.reduce((a,b)=>a+b,0)-target);
      multiplier=distance===0?1.93:distance<=2?2.08:0;
      result={...result,mechanic:"Sum precision",samples,target,distance,total:samples.reduce((a,b)=>a+b,0)};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
