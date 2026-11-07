import crypto from "node:crypto";
// Standalone server engine for Dragon Arena (Game #52); no shared profile resolver.
const GAME={id:52,name:"Dragon Arena",profile:"wheel",variant:"dragon-arena",rules:{"engineId": "knp-052-dragon-arena", "title": "Dragon Arena", "objective": "Dragon Arena: Precision Challenge", "instructions": "Choose a target value; the server generates a challenge value and scores distance from target.", "mechanic": "Precision Challenge", "parameters": {"mode": 62, "difficulty": 3, "target": 4, "risk": 0.45, "reward": 4.38, "sequenceLength": 6, "symbolCount": 12}, "uniqueRuleVersion": 2},parameters:{"target": 4, "range": 10, "rounds": 6, "difficulty": 4, "winRate": 68, "base": 2.38, "bonus": 4.63, "symbols": 12, "lanes": 6, "sequence": 6}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const spins=Array.from({length:5},()=>crypto.randomInt(1,11));
      const chosen=Number(choice.number||0),matches=spins.filter(v=>v===chosen).length;
      multiplier=matches?Number((2.38*matches).toFixed(2)):0;
      result={...result,mechanic:"Five-draw number hunt",draws:spins,chosen,matches};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
