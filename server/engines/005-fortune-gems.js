import crypto from "node:crypto";
// Standalone server engine for Fortune Gems (Game #5); no shared profile resolver.
const GAME={id:5,name:"Fortune Gems",profile:"slot",variant:"fortune-gems",rules:{"engineId": "knp-005-fortune-gems", "title": "Fortune Gems", "objective": "Fortune Gems: Precision Challenge", "instructions": "Choose a target value; the server generates a challenge value and scores distance from target.", "mechanic": "Precision Challenge", "parameters": {"mode": 317, "difficulty": 1, "target": 11, "risk": 0.17, "reward": 1.75, "sequenceLength": 3, "symbolCount": 5}, "uniqueRuleVersion": 2},parameters:{"target": 6, "range": 16, "rounds": 5, "difficulty": 1, "winRate": 40, "base": 1.65, "bonus": 2.0, "symbols": 5, "lanes": 3, "sequence": 3}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const hazards=Array.from({length:5},()=>crypto.randomInt(0,100)<40);
      const steps=Math.max(1,Math.min(5,Number(choice.steps||1)));
      const failed=hazards.slice(0,steps).some(Boolean);
      multiplier=failed?0:Number((1.65**steps).toFixed(3));
      result={...result,mechanic:"Hazard ladder",hazards,steps,failed};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
