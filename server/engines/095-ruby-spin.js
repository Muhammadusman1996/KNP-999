import crypto from "node:crypto";
// Standalone server engine for Ruby Spin (Game #95); no shared profile resolver.
const GAME={id:95,name:"Ruby Spin",profile:"dice",variant:"ruby-spin",rules:{"engineId": "knp-095-ruby-spin", "title": "Ruby Spin", "objective": "Ruby Spin: Risk Ladder", "instructions": "Choose how many stages to attempt; each stage increases reward and failure risk.", "mechanic": "Risk Ladder", "parameters": {"mode": 623, "difficulty": 1, "target": 6, "risk": 0.51, "reward": 2.14, "sequenceLength": 7, "symbolCount": 12}, "uniqueRuleVersion": 2},parameters:{"target": 11, "range": 20, "rounds": 6, "difficulty": 5, "winRate": 74, "base": 2.44, "bonus": 2.39, "symbols": 12, "lanes": 7, "sequence": 7}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const hazards=Array.from({length:6},()=>crypto.randomInt(0,100)<74);
      const steps=Math.max(1,Math.min(6,Number(choice.steps||1)));
      const failed=hazards.slice(0,steps).some(Boolean);
      multiplier=failed?0:Number((2.44**steps).toFixed(3));
      result={...result,mechanic:"Hazard ladder",hazards,steps,failed};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
