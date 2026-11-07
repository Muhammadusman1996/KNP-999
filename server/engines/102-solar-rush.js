import crypto from "node:crypto";
// Standalone server engine for Solar Rush (Game #102); no shared profile resolver.
const GAME={id:102,name:"Solar Rush",profile:"slot",variant:"solar-rush",rules:{"engineId": "knp-102-solar-rush", "title": "Solar Rush", "objective": "Solar Rush: Lucky Draw", "instructions": "Choose a number band; a server-generated draw decides whether the selection wins.", "mechanic": "Lucky Draw", "parameters": {"mode": 893, "difficulty": 3, "target": 4, "risk": 0.19, "reward": 6.47, "sequenceLength": 5, "symbolCount": 5}, "uniqueRuleVersion": 2},parameters:{"target": 5, "range": 10, "rounds": 7, "difficulty": 3, "winRate": 42, "base": 3.47, "bonus": 6.72, "symbols": 5, "lanes": 5, "sequence": 5}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const spins=Array.from({length:5},()=>crypto.randomInt(1,11));
      const chosen=Number(choice.number||0),matches=spins.filter(v=>v===chosen).length;
      multiplier=matches?Number((3.47*matches).toFixed(2)):0;
      result={...result,mechanic:"Five-draw number hunt",draws:spins,chosen,matches};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
