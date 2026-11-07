import crypto from "node:crypto";
// Standalone server engine for european-roulette (Game #178); no shared profile resolver.
const GAME={id:178,name:"European Roulette",profile:"wheel",variant:"european-roulette",rules:{"engineId": "knp-178-european-roulette", "title": "European Roulette", "objective": "European Roulette: Roulette Wheel", "instructions": "Choose a number or color and spin the virtual roulette wheel.", "mechanic": "Roulette Wheel", "parameters": {"mode": 15, "difficulty": 4, "target": 12, "risk": 0.43, "reward": 4.0, "sequenceLength": 7, "symbolCount": 9}, "uniqueRuleVersion": 1},parameters:{"target": 17, "range": 23, "rounds": 7, "difficulty": 4, "winRate": 38, "base": 3.2, "bonus": 7.5, "symbols": 9, "lanes": 7, "sequence": 6}}
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
