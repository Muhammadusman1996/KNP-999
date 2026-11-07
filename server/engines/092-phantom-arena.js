import crypto from "node:crypto";
// Standalone server engine for Phantom Arena (Game #92); no shared profile resolver.
const GAME={id:92,name:"Phantom Arena",profile:"wheel",variant:"phantom-arena",rules:{"engineId": "knp-092-phantom-arena", "title": "Phantom Arena", "objective": "Phantom Arena: Combo Quest", "instructions": "Choose a combo type; the server generates a sequence and checks the selected pattern.", "mechanic": "Combo Quest", "parameters": {"mode": 556, "difficulty": 3, "target": 5, "risk": 0.48, "reward": 4.06, "sequenceLength": 4, "symbolCount": 8}, "uniqueRuleVersion": 2},parameters:{"target": 10, "range": 18, "rounds": 6, "difficulty": 2, "winRate": 71, "base": 3.76, "bonus": 4.31, "symbols": 8, "lanes": 4, "sequence": 4}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const spins=Array.from({length:5},()=>crypto.randomInt(1,19));
      const chosen=Number(choice.number||0),matches=spins.filter(v=>v===chosen).length;
      multiplier=matches?Number((3.76*matches).toFixed(2)):0;
      result={...result,mechanic:"Five-draw number hunt",draws:spins,chosen,matches};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
