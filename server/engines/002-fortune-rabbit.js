import crypto from "node:crypto";
// Standalone server engine for Fortune Rabbit (Game #2); no shared profile resolver.
const GAME={id:2,name:"Fortune Rabbit",profile:"slot",variant:"fortune-rabbit",rules:{"engineId": "knp-002-fortune-rabbit", "title": "Fortune Rabbit", "objective": "Fortune Rabbit: Symbol Hunt", "instructions": "Choose a symbol before the round; the server draws a symbol set and scores exact matches.", "mechanic": "Symbol Hunt", "parameters": {"mode": 228, "difficulty": 3, "target": 4, "risk": 0.54, "reward": 1.77, "sequenceLength": 5, "symbolCount": 11}, "uniqueRuleVersion": 2},parameters:{"target": 19, "range": 16, "rounds": 3, "difficulty": 3, "winRate": 77, "base": 3.37, "bonus": 2.02, "symbols": 11, "lanes": 5, "sequence": 5}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const spins=Array.from({length:5},()=>crypto.randomInt(1,17));
      const chosen=Number(choice.number||0),matches=spins.filter(v=>v===chosen).length;
      multiplier=matches?Number((3.37*matches).toFixed(2)):0;
      result={...result,mechanic:"Five-draw number hunt",draws:spins,chosen,matches};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
