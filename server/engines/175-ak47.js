import crypto from "node:crypto";
// Standalone server engine for ak47 (Game #175); no shared profile resolver.
const GAME={id:175,name:"AK47",profile:"card",variant:"ak47",rules:{"engineId": "knp-175-ak47", "title": "AK47", "objective": "AK47: AK47 Card Table", "instructions": "Play a compact card round with a server-dealt result.", "mechanic": "AK47 Card Table", "parameters": {"mode": 215, "difficulty": 1, "target": 9, "risk": 0.4, "reward": 3.7, "sequenceLength": 4, "symbolCount": 6}, "uniqueRuleVersion": 1},parameters:{"target": 14, "range": 20, "rounds": 4, "difficulty": 1, "winRate": 35, "base": 2.6, "bonus": 6.5, "symbols": 6, "lanes": 4, "sequence": 7}}
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
