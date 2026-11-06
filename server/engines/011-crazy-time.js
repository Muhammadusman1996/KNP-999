import crypto from "node:crypto";
// Standalone server engine for Crazy Time (Game #11); no shared profile resolver.
const GAME={id:11,name:"Crazy Time",profile:"wheel",variant:"crazy-time",rules:{"engineId": "knp-011-crazy-time", "title": "Crazy Time", "objective": "Crazy Time: Lucky Draw", "instructions": "Choose a number band; a server-generated draw decides whether the selection wins.", "mechanic": "Lucky Draw", "parameters": {"mode": 517, "difficulty": 2, "target": 8, "risk": 0.17, "reward": 5.45, "sequenceLength": 3, "symbolCount": 11}, "uniqueRuleVersion": 2},parameters:{"target": 4, "range": 22, "rounds": 5, "difficulty": 1, "winRate": 40, "base": 2.55, "bonus": 5.7, "symbols": 11, "lanes": 3, "sequence": 3}};
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
