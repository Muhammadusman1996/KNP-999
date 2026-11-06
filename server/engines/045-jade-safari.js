import crypto from "node:crypto";
// Standalone server engine for Jade Safari (Game #45); no shared profile resolver.
const GAME={id:45,name:"Jade Safari",profile:"fishing",variant:"jade-safari",rules:{"engineId": "knp-045-jade-safari", "title": "Jade Safari", "objective": "Jade Safari: Treasure Route", "instructions": "Choose a route and risk level; the server resolves route hazards and treasure value.", "mechanic": "Treasure Route", "parameters": {"mode": 789, "difficulty": 1, "target": 2, "risk": 0.31, "reward": 6.74, "sequenceLength": 7, "symbolCount": 8}, "uniqueRuleVersion": 2},parameters:{"target": 5, "range": 6, "rounds": 4, "difficulty": 5, "winRate": 54, "base": 3.14, "bonus": 6.99, "symbols": 8, "lanes": 7, "sequence": 7}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const hazards=Array.from({length:4},()=>crypto.randomInt(0,100)<54);
      const steps=Math.max(1,Math.min(4,Number(choice.steps||1)));
      const failed=hazards.slice(0,steps).some(Boolean);
      multiplier=failed?0:Number((3.14**steps).toFixed(3));
      result={...result,mechanic:"Hazard ladder",hazards,steps,failed};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
