import crypto from "node:crypto";
// Standalone server engine for Thunder Fortune (Game #91); no shared profile resolver.
const GAME={id:91,name:"Thunder Fortune",profile:"crash",variant:"thunder-fortune",rules:{"engineId": "knp-091-thunder-fortune", "title": "Thunder Fortune", "objective": "Thunder Fortune: Target Trial", "instructions": "Choose a target lane; hits are resolved on the server with game-specific accuracy and reward values.", "mechanic": "Target Trial", "parameters": {"mode": 541, "difficulty": 2, "target": 6, "risk": 0.2, "reward": 6.73, "sequenceLength": 6, "symbolCount": 9}, "uniqueRuleVersion": 2},parameters:{"target": 10, "range": 6, "rounds": 5, "difficulty": 4, "winRate": 43, "base": 2.13, "bonus": 6.98, "symbols": 9, "lanes": 6, "sequence": 6}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const path=Array.from({length:5},()=>crypto.randomInt(0,6));
      const route=Array.isArray(choice.route)?choice.route.map(Number):[];
      const hits=route.reduce((n,v,i)=>n+(v===path[i]?1:0),0);
      multiplier=hits>=3?Number((2.13+hits*0.42).toFixed(2)):0;
      result={...result,mechanic:"Pathfinder route",path,route,hits,required:3};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
