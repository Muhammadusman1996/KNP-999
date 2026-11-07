import crypto from "node:crypto";
// Standalone server engine for Lucky Fortune (Game #31); no shared profile resolver.
const GAME={id:31,name:"Lucky Fortune",profile:"dice",variant:"lucky-fortune",rules:{"engineId": "knp-031-lucky-fortune", "title": "Lucky Fortune", "objective": "Lucky Fortune: Combo Quest", "instructions": "Choose a combo type; the server generates a sequence and checks the selected pattern.", "mechanic": "Combo Quest", "parameters": {"mode": 293, "difficulty": 2, "target": 7, "risk": 0.43, "reward": 5.06, "sequenceLength": 4, "symbolCount": 8}, "uniqueRuleVersion": 2},parameters:{"target": 6, "range": 21, "rounds": 4, "difficulty": 2, "winRate": 66, "base": 3.26, "bonus": 5.31, "symbols": 8, "lanes": 4, "sequence": 4}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const path=Array.from({length:4},()=>crypto.randomInt(0,4));
      const route=Array.isArray(choice.route)?choice.route.map(Number):[];
      const hits=route.reduce((n,v,i)=>n+(v===path[i]?1:0),0);
      multiplier=hits>=2?Number((3.26+hits*0.42).toFixed(2)):0;
      result={...result,mechanic:"Pathfinder route",path,route,hits,required:2};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
