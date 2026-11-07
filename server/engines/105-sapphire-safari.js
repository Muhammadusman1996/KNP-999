import crypto from "node:crypto";
// Standalone server engine for Sapphire Safari (Game #105); no shared profile resolver.
const GAME={id:105,name:"Sapphire Safari",profile:"puzzle",variant:"sapphire-safari",rules:{"engineId": "knp-105-sapphire-safari", "title": "Sapphire Safari", "objective": "Sapphire Safari: Target Trial", "instructions": "Choose a target lane; hits are resolved on the server with game-specific accuracy and reward values.", "mechanic": "Target Trial", "parameters": {"mode": 62, "difficulty": 1, "target": 4, "risk": 0.33, "reward": 6.91, "sequenceLength": 4, "symbolCount": 9}, "uniqueRuleVersion": 2},parameters:{"target": 7, "range": 9, "rounds": 3, "difficulty": 2, "winRate": 56, "base": 2.71, "bonus": 7.16, "symbols": 9, "lanes": 4, "sequence": 4}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const hazards=Array.from({length:3},()=>crypto.randomInt(0,100)<56);
      const steps=Math.max(1,Math.min(3,Number(choice.steps||1)));
      const failed=hazards.slice(0,steps).some(Boolean);
      multiplier=failed?0:Number((2.71**steps).toFixed(3));
      result={...result,mechanic:"Hazard ladder",hazards,steps,failed};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
