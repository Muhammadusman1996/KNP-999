import crypto from "node:crypto";
// Standalone server engine for treasure-digger (Game #143); no shared profile resolver.
const GAME={id:143,name:"Treasure Digger",profile:"puzzle",variant:"treasure-digger",rules:{"engineId": "knp-143-treasure-digger", "title": "Treasure Digger", "objective": "Treasure Digger: Treasure Grid", "instructions": "Select a hidden tile and reveal whether it contains a treasure or a trap.", "mechanic": "Treasure Grid", "parameters": {"mode": 173, "difficulty": 4, "target": 3, "risk": 0.48, "reward": 5.5, "sequenceLength": 7, "symbolCount": 9}, "uniqueRuleVersion": 1},parameters:{"target": 12, "range": 18, "rounds": 8, "difficulty": 4, "winRate": 38, "base": 3.4, "bonus": 2.5, "symbols": 9, "lanes": 7, "sequence": 7}}
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
