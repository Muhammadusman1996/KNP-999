import crypto from "node:crypto";
// Standalone server engine for win-three-cards (Game #151); no shared profile resolver.
const GAME={id:151,name:"Win Three Cards",profile:"card",variant:"win-three-cards",rules:{"engineId": "knp-151-win-three-cards", "title": "Win Three Cards", "objective": "Win Three Cards: Three Card Draw", "instructions": "Choose a card pattern and reveal a server-generated three-card hand.", "mechanic": "Three Card Draw", "parameters": {"mode": 58, "difficulty": 2, "target": 11, "risk": 0.56, "reward": 1.3, "sequenceLength": 5, "symbolCount": 10}, "uniqueRuleVersion": 1},parameters:{"target": 5, "range": 11, "rounds": 4, "difficulty": 2, "winRate": 46, "base": 2.6, "bonus": 5.17, "symbols": 10, "lanes": 5, "sequence": 7}}
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
