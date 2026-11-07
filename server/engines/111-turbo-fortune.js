import crypto from "node:crypto";
// Standalone server engine for Turbo Fortune (Game #111); no shared profile resolver.
const GAME={id:111,name:"Turbo Fortune",profile:"dice",variant:"turbo-fortune",rules:{"engineId": "knp-111-turbo-fortune", "title": "Turbo Fortune", "objective": "Turbo Fortune: Combo Quest", "instructions": "Choose a combo type; the server generates a sequence and checks the selected pattern.", "mechanic": "Combo Quest", "parameters": {"mode": 262, "difficulty": 2, "target": 7, "risk": 0.5, "reward": 4.83, "sequenceLength": 6, "symbolCount": 9}, "uniqueRuleVersion": 2},parameters:{"target": 16, "range": 5, "rounds": 5, "difficulty": 4, "winRate": 73, "base": 3.33, "bonus": 5.08, "symbols": 9, "lanes": 6, "sequence": 6}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const path=Array.from({length:5},()=>crypto.randomInt(0,6));
      const route=Array.isArray(choice.route)?choice.route.map(Number):[];
      const hits=route.reduce((n,v,i)=>n+(v===path[i]?1:0),0);
      multiplier=hits>=3?Number((3.33+hits*0.42).toFixed(2)):0;
      result={...result,mechanic:"Pathfinder route",path,route,hits,required:3};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
