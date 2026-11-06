import crypto from "node:crypto";
// Standalone server engine for number-king (Game #185); no shared profile resolver.
const GAME={id:185,name:"Number King",profile:"puzzle",variant:"number-king",rules:{"engineId": "knp-185-number-king", "title": "Number King", "objective": "Number King: Number Draw", "instructions": "Choose a number and compare it with the server-generated draw.", "mechanic": "Number Draw", "parameters": {"mode": 134, "difficulty": 1, "target": 6, "risk": 0.5, "reward": 4.7, "sequenceLength": 4, "symbolCount": 9}, "uniqueRuleVersion": 1},parameters:{"target": 9, "range": 15, "rounds": 8, "difficulty": 1, "winRate": 45, "base": 2.2, "bonus": 3.17, "symbols": 9, "lanes": 4, "sequence": 5}}
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
