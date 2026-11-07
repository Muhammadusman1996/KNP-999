import crypto from "node:crypto";
// Standalone server engine for Ocean Fortune (Game #131); no shared profile resolver.
const GAME={id:131,name:"Ocean Fortune",profile:"crash",variant:"ocean-fortune",rules:{"engineId": "knp-131-ocean-fortune", "title": "Ocean Fortune", "objective": "Ocean Fortune: Combo Quest", "instructions": "Choose a combo type; the server generates a sequence and checks the selected pattern.", "mechanic": "Combo Quest", "parameters": {"mode": 5, "difficulty": 2, "target": 10, "risk": 0.36, "reward": 2.59, "sequenceLength": 7, "symbolCount": 5}, "uniqueRuleVersion": 2},parameters:{"target": 9, "range": 9, "rounds": 3, "difficulty": 5, "winRate": 59, "base": 2.29, "bonus": 2.84, "symbols": 5, "lanes": 7, "sequence": 7}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const path=Array.from({length:3},()=>crypto.randomInt(0,7));
      const route=Array.isArray(choice.route)?choice.route.map(Number):[];
      const hits=route.reduce((n,v,i)=>n+(v===path[i]?1:0),0);
      multiplier=hits>=1?Number((2.29+hits*0.42).toFixed(2)):0;
      result={...result,mechanic:"Pathfinder route",path,route,hits,required:1};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
