import crypto from "node:crypto";
// Standalone server engine for Moon Safari (Game #125); no shared profile resolver.
const GAME={id:125,name:"Moon Safari",profile:"fishing",variant:"moon-safari",rules:{"engineId": "knp-125-moon-safari", "title": "Moon Safari", "objective": "Moon Safari: Treasure Route", "instructions": "Choose a route and risk level; the server resolves route hazards and treasure value.", "mechanic": "Treasure Route", "parameters": {"mode": 758, "difficulty": 1, "target": 7, "risk": 0.2, "reward": 6.13, "sequenceLength": 6, "symbolCount": 5}, "uniqueRuleVersion": 2},parameters:{"target": 9, "range": 19, "rounds": 5, "difficulty": 4, "winRate": 43, "base": 1.23, "bonus": 6.38, "symbols": 5, "lanes": 6, "sequence": 6}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const hazards=Array.from({length:5},()=>crypto.randomInt(0,100)<43);
      const steps=Math.max(1,Math.min(5,Number(choice.steps||1)));
      const failed=hazards.slice(0,steps).some(Boolean);
      multiplier=failed?0:Number((1.23**steps).toFixed(3));
      result={...result,mechanic:"Hazard ladder",hazards,steps,failed};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
