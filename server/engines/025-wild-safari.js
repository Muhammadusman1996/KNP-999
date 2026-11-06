import crypto from "node:crypto";
// Standalone server engine for Wild Safari (Game #25); no shared profile resolver.
const GAME={id:25,name:"Wild Safari",profile:"puzzle",variant:"wild-safari",rules:{"engineId": "knp-025-wild-safari", "title": "Wild Safari", "objective": "Wild Safari: Treasure Route", "instructions": "Choose a route and risk level; the server resolves route hazards and treasure value.", "mechanic": "Treasure Route", "parameters": {"mode": 49, "difficulty": 1, "target": 2, "risk": 0.36, "reward": 2.69, "sequenceLength": 7, "symbolCount": 7}, "uniqueRuleVersion": 2},parameters:{"target": 18, "range": 19, "rounds": 3, "difficulty": 5, "winRate": 59, "base": 1.39, "bonus": 2.94, "symbols": 7, "lanes": 7, "sequence": 7}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const hazards=Array.from({length:3},()=>crypto.randomInt(0,100)<59);
      const steps=Math.max(1,Math.min(3,Number(choice.steps||1)));
      const failed=hazards.slice(0,steps).some(Boolean);
      multiplier=failed?0:Number((1.39**steps).toFixed(3));
      result={...result,mechanic:"Hazard ladder",hazards,steps,failed};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
