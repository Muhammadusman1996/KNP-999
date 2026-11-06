import crypto from "node:crypto";
// Standalone server engine for Rooster Rumble (Game #22); no shared profile resolver.
const GAME={id:22,name:"Rooster Rumble",profile:"slot",variant:"rooster-rumble",rules:{"engineId": "knp-022-rooster-rumble", "title": "Rooster Rumble", "objective": "Rooster Rumble: Symbol Hunt", "instructions": "Choose a symbol before the round; the server draws a symbol set and scores exact matches.", "mechanic": "Symbol Hunt", "parameters": {"mode": 968, "difficulty": 3, "target": 5, "risk": 0.18, "reward": 4.26, "sequenceLength": 4, "symbolCount": 12}, "uniqueRuleVersion": 2},parameters:{"target": 16, "range": 8, "rounds": 6, "difficulty": 2, "winRate": 41, "base": 3.46, "bonus": 4.51, "symbols": 12, "lanes": 4, "sequence": 4}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const spins=Array.from({length:5},()=>crypto.randomInt(1,9));
      const chosen=Number(choice.number||0),matches=spins.filter(v=>v===chosen).length;
      multiplier=matches?Number((3.46*matches).toFixed(2)):0;
      result={...result,mechanic:"Five-draw number hunt",draws:spins,chosen,matches};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
