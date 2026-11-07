import crypto from "node:crypto";
// Standalone server engine for Fire Arena (Game #132); no shared profile resolver.
const GAME={id:132,name:"Fire Arena",profile:"wheel",variant:"fire-arena",rules:{"engineId": "knp-132-fire-arena", "title": "Fire Arena", "objective": "Fire Arena: Lucky Draw", "instructions": "Choose a number band; a server-generated draw decides whether the selection wins.", "mechanic": "Lucky Draw", "parameters": {"mode": 9, "difficulty": 3, "target": 6, "risk": 0.56, "reward": 4.39, "sequenceLength": 7, "symbolCount": 5}, "uniqueRuleVersion": 2},parameters:{"target": 16, "range": 23, "rounds": 5, "difficulty": 5, "winRate": 79, "base": 1.59, "bonus": 4.64, "symbols": 5, "lanes": 7, "sequence": 7}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const spins=Array.from({length:5},()=>crypto.randomInt(1,24));
      const chosen=Number(choice.number||0),matches=spins.filter(v=>v===chosen).length;
      multiplier=matches?Number((1.59*matches).toFixed(2)):0;
      result={...result,mechanic:"Five-draw number hunt",draws:spins,chosen,matches};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
