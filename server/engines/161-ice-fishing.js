import crypto from "node:crypto";
// Standalone server engine for ice-fishing (Game #161); no shared profile resolver.
const GAME={id:161,name:"Ice Fishing",profile:"fishing",variant:"ice-fishing",rules:{"engineId": "knp-161-ice-fishing", "title": "Ice Fishing", "objective": "Ice Fishing: Ice Catch", "instructions": "Cast through an ice hole and target fish with different virtual values.", "mechanic": "Ice Catch", "parameters": {"mode": 228, "difficulty": 2, "target": 8, "risk": 0.26, "reward": 2.3, "sequenceLength": 5, "symbolCount": 6}, "uniqueRuleVersion": 1},parameters:{"target": 15, "range": 21, "rounds": 8, "difficulty": 2, "winRate": 56, "base": 2.2, "bonus": 1.83, "symbols": 6, "lanes": 5, "sequence": 5}}
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const hazards=Array.from({length:3},()=>crypto.randomInt(0,100)<35);
      const steps=Math.max(1,Math.min(3,Number(choice.steps||1)));
      const failed=hazards.slice(0,steps).some(Boolean);
      multiplier=failed?0:Number((2.95**steps).toFixed(3));
      result={...result,mechanic:"Hazard ladder",hazards,steps,failed};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
