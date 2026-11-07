import crypto from "node:crypto";
// Standalone server engine for Royal Rush (Game #82); no shared profile resolver.
const GAME={id:82,name:"Royal Rush",profile:"card",variant:"royal-rush",rules:{"engineId": "knp-082-royal-rush", "title": "Royal Rush", "objective": "Royal Rush: Lucky Draw", "instructions": "Choose a number band; a server-generated draw decides whether the selection wins.", "mechanic": "Lucky Draw", "parameters": {"mode": 153, "difficulty": 3, "target": 2, "risk": 0.39, "reward": 5.27, "sequenceLength": 5, "symbolCount": 5}, "uniqueRuleVersion": 2},parameters:{"target": 14, "range": 9, "rounds": 3, "difficulty": 3, "winRate": 62, "base": 3.67, "bonus": 5.52, "symbols": 5, "lanes": 5, "sequence": 5}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const spins=Array.from({length:5},()=>crypto.randomInt(1,10));
      const chosen=Number(choice.number||0),matches=spins.filter(v=>v===chosen).length;
      multiplier=matches?Number((3.67*matches).toFixed(2)):0;
      result={...result,mechanic:"Five-draw number hunt",draws:spins,chosen,matches};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
