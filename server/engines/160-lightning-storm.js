import crypto from "node:crypto";
// Standalone server engine for lightning-storm (Game #160); no shared profile resolver.
const GAME={id:160,name:"Lightning Storm",profile:"wheel",variant:"lightning-storm",rules:{"engineId": "knp-160-lightning-storm", "title": "Lightning Storm", "objective": "Lightning Storm: Storm Wheel", "instructions": "Spin the storm wheel and land on a multiplier segment.", "mechanic": "Storm Wheel", "parameters": {"mode": 211, "difficulty": 1, "target": 7, "risk": 0.25, "reward": 2.2, "sequenceLength": 4, "symbolCount": 12}, "uniqueRuleVersion": 1},parameters:{"target": 14, "range": 20, "rounds": 7, "difficulty": 1, "winRate": 55, "base": 2.0, "bonus": 1.5, "symbols": 12, "lanes": 4, "sequence": 4}}
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const path=Array.from({length:5},()=>crypto.randomInt(0,3));
      const route=Array.isArray(choice.route)?choice.route.map(Number):[];
      const hits=route.reduce((n,v,i)=>n+(v===path[i]?1:0),0);
      multiplier=hits>=3?Number((2.55+hits*0.42).toFixed(2)):0;
      result={...result,mechanic:"Pathfinder route",path,route,hits,required:3};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
