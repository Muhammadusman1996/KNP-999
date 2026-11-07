import crypto from "node:crypto";
// Standalone server engine for Crystal Rush (Game #62); no shared profile resolver.
const GAME={id:62,name:"Crystal Rush",profile:"slot",variant:"crystal-rush",rules:{"engineId": "knp-062-crystal-rush", "title": "Crystal Rush", "objective": "Crystal Rush: Precision Challenge", "instructions": "Choose a target value; the server generates a challenge value and scores distance from target.", "mechanic": "Precision Challenge", "parameters": {"mode": 432, "difficulty": 3, "target": 11, "risk": 0.26, "reward": 1.54, "sequenceLength": 7, "symbolCount": 10}, "uniqueRuleVersion": 2},parameters:{"target": 10, "range": 10, "rounds": 8, "difficulty": 5, "winRate": 49, "base": 3.54, "bonus": 1.79, "symbols": 10, "lanes": 7, "sequence": 7}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const spins=Array.from({length:5},()=>crypto.randomInt(1,11));
      const chosen=Number(choice.number||0),matches=spins.filter(v=>v===chosen).length;
      multiplier=matches?Number((3.54*matches).toFixed(2)):0;
      result={...result,mechanic:"Five-draw number hunt",draws:spins,chosen,matches};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
