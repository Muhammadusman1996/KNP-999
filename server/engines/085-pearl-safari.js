import crypto from "node:crypto";
// Standalone server engine for Pearl Safari (Game #85); no shared profile resolver.
const GAME={id:85,name:"Pearl Safari",profile:"fishing",variant:"pearl-safari",rules:{"engineId": "knp-085-pearl-safari", "title": "Pearl Safari", "objective": "Pearl Safari: Precision Challenge", "instructions": "Choose a target value; the server generates a challenge value and scores distance from target.", "mechanic": "Precision Challenge", "parameters": {"mode": 286, "difficulty": 1, "target": 8, "risk": 0.33, "reward": 7.06, "sequenceLength": 4, "symbolCount": 6}, "uniqueRuleVersion": 2},parameters:{"target": 10, "range": 20, "rounds": 6, "difficulty": 2, "winRate": 56, "base": 2.26, "bonus": 7.31, "symbols": 6, "lanes": 4, "sequence": 4}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const hazards=Array.from({length:6},()=>crypto.randomInt(0,100)<56);
      const steps=Math.max(1,Math.min(6,Number(choice.steps||1)));
      const failed=hazards.slice(0,steps).some(Boolean);
      multiplier=failed?0:Number((2.26**steps).toFixed(3));
      result={...result,mechanic:"Hazard ladder",hazards,steps,failed};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
