import crypto from "node:crypto";
// Standalone server engine for Money Coming (Game #12); no shared profile resolver.
const GAME={id:12,name:"Money Coming",profile:"slot",variant:"money-coming",rules:{"engineId": "knp-012-money-coming", "title": "Money Coming", "objective": "Money Coming: Precision Challenge", "instructions": "Choose a target value; the server generates a challenge value and scores distance from target.", "mechanic": "Precision Challenge", "parameters": {"mode": 576, "difficulty": 3, "target": 7, "risk": 0.52, "reward": 6.5, "sequenceLength": 3, "symbolCount": 12}, "uniqueRuleVersion": 2},parameters:{"target": 15, "range": 6, "rounds": 4, "difficulty": 1, "winRate": 75, "base": 2.9, "bonus": 6.75, "symbols": 12, "lanes": 3, "sequence": 3}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const spins=Array.from({length:5},()=>crypto.randomInt(1,7));
      const chosen=Number(choice.number||0),matches=spins.filter(v=>v===chosen).length;
      multiplier=matches?Number((2.9*matches).toFixed(2)):0;
      result={...result,mechanic:"Five-draw number hunt",draws:spins,chosen,matches};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
