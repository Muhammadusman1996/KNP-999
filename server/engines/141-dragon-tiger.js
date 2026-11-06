import crypto from "node:crypto";
// Standalone server engine for dragon-tiger (Game #141); no shared profile resolver.
const GAME={id:141,name:"Dragon Tiger",profile:"card",variant:"dragon-tiger",rules:{"engineId": "knp-141-dragon-tiger", "title": "Dragon Tiger", "objective": "Dragon Tiger: Dragon vs Tiger", "instructions": "Choose Dragon or Tiger; the server deals one card to each side and compares ranks.", "mechanic": "Dragon vs Tiger", "parameters": {"mode": 139, "difficulty": 2, "target": 14, "risk": 0.46, "reward": 5.3, "sequenceLength": 5, "symbolCount": 7}, "uniqueRuleVersion": 1},parameters:{"target": 10, "range": 16, "rounds": 6, "difficulty": 2, "winRate": 36, "base": 3.0, "bonus": 1.83, "symbols": 7, "lanes": 5, "sequence": 5}}
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
