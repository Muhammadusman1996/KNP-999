import crypto from "node:crypto";
// Standalone server engine for Thunder Spin (Game #115); no shared profile resolver.
const GAME={id:115,name:"Thunder Spin",profile:"crash",variant:"thunder-spin",rules:{"engineId": "knp-115-thunder-spin", "title": "Thunder Spin", "objective": "Thunder Spin: Precision Challenge", "instructions": "Choose a target value; the server generates a challenge value and scores distance from target.", "mechanic": "Precision Challenge", "parameters": {"mode": 399, "difficulty": 1, "target": 12, "risk": 0.5, "reward": 7.18, "sequenceLength": 6, "symbolCount": 12}, "uniqueRuleVersion": 2},parameters:{"target": 18, "range": 21, "rounds": 8, "difficulty": 4, "winRate": 73, "base": 2.88, "bonus": 7.43, "symbols": 12, "lanes": 6, "sequence": 6}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const hazards=Array.from({length:8},()=>crypto.randomInt(0,100)<73);
      const steps=Math.max(1,Math.min(8,Number(choice.steps||1)));
      const failed=hazards.slice(0,steps).some(Boolean);
      multiplier=failed?0:Number((2.88**steps).toFixed(3));
      result={...result,mechanic:"Hazard ladder",hazards,steps,failed};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
