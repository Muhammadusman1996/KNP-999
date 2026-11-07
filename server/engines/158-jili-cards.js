import crypto from "node:crypto";
// Standalone server engine for jili-cards (Game #158); no shared profile resolver.
const GAME={id:158,name:"JILI Cards",profile:"card",variant:"jili-cards",rules:{"engineId": "knp-158-jili-cards", "title": "JILI Cards", "objective": "JILI Cards: Card Table", "instructions": "Choose a card-table outcome and reveal a server-dealt hand.", "mechanic": "Card Table", "parameters": {"mode": 177, "difficulty": 4, "target": 5, "risk": 0.63, "reward": 2.0, "sequenceLength": 7, "symbolCount": 10}, "uniqueRuleVersion": 1},parameters:{"target": 12, "range": 18, "rounds": 5, "difficulty": 4, "winRate": 53, "base": 1.6, "bonus": 7.5, "symbols": 10, "lanes": 7, "sequence": 6}}
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
