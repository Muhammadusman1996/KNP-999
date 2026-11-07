import crypto from "node:crypto";
// Standalone server engine for Golden Safari (Game #65); no shared profile resolver.
const GAME={id:65,name:"Golden Safari",profile:"puzzle",variant:"golden-safari",rules:{"engineId": "knp-065-golden-safari", "title": "Golden Safari", "objective": "Golden Safari: Combo Quest", "instructions": "Choose a combo type; the server generates a sequence and checks the selected pattern.", "mechanic": "Combo Quest", "parameters": {"mode": 554, "difficulty": 1, "target": 9, "risk": 0.48, "reward": 3.16, "sequenceLength": 4, "symbolCount": 10}, "uniqueRuleVersion": 2},parameters:{"target": 13, "range": 15, "rounds": 6, "difficulty": 2, "winRate": 71, "base": 2.86, "bonus": 3.41, "symbols": 10, "lanes": 4, "sequence": 4}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const hazards=Array.from({length:6},()=>crypto.randomInt(0,100)<71);
      const steps=Math.max(1,Math.min(6,Number(choice.steps||1)));
      const failed=hazards.slice(0,steps).some(Boolean);
      multiplier=failed?0:Number((2.86**steps).toFixed(3));
      result={...result,mechanic:"Hazard ladder",hazards,steps,failed};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
