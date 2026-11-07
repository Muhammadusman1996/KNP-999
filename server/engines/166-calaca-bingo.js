import crypto from "node:crypto";
// Standalone server engine for calaca-bingo (Game #166); no shared profile resolver.
const GAME={id:166,name:"Calaca Bingo",profile:"puzzle",variant:"calaca-bingo",rules:{"engineId": "knp-166-calaca-bingo", "title": "Calaca Bingo", "objective": "Calaca Bingo: Bingo Board", "instructions": "Mark called numbers and complete a row or pattern.", "mechanic": "Bingo Board", "parameters": {"mode": 62, "difficulty": 2, "target": 13, "risk": 0.31, "reward": 2.8, "sequenceLength": 5, "symbolCount": 11}, "uniqueRuleVersion": 1},parameters:{"target": 5, "range": 11, "rounds": 7, "difficulty": 2, "winRate": 61, "base": 3.2, "bonus": 3.5, "symbols": 11, "lanes": 5, "sequence": 6}}
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
