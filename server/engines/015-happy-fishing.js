import crypto from "node:crypto";
// Standalone server engine for Happy Fishing (Game #15); no shared profile resolver.
const GAME={id:15,name:"Happy Fishing",profile:"fishing",variant:"happy-fishing",rules:{"engineId": "knp-015-happy-fishing", "title": "Happy Fishing", "objective": "Happy Fishing: Combo Quest", "instructions": "Choose a combo type; the server generates a sequence and checks the selected pattern.", "mechanic": "Combo Quest", "parameters": {"mode": 698, "difficulty": 1, "target": 7, "risk": 0.12, "reward": 2.75, "sequenceLength": 3, "symbolCount": 11}, "uniqueRuleVersion": 2},parameters:{"target": 16, "range": 13, "rounds": 3, "difficulty": 1, "winRate": 35, "base": 2.95, "bonus": 3.0, "symbols": 11, "lanes": 3, "sequence": 3}};
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
