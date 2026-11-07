import crypto from "node:crypto";
// Standalone server engine for Sapphire Deluxe (Game #81); no shared profile resolver.
const GAME={id:81,name:"Sapphire Deluxe",profile:"puzzle",variant:"sapphire-deluxe",rules:{"engineId": "knp-081-sapphire-deluxe", "title": "Sapphire Deluxe", "objective": "Sapphire Deluxe: Target Trial", "instructions": "Choose a target lane; hits are resolved on the server with game-specific accuracy and reward values.", "mechanic": "Target Trial", "parameters": {"mode": 171, "difficulty": 2, "target": 3, "risk": 0.25, "reward": 1.38, "sequenceLength": 6, "symbolCount": 6}, "uniqueRuleVersion": 2},parameters:{"target": 18, "range": 20, "rounds": 4, "difficulty": 4, "winRate": 48, "base": 1.28, "bonus": 1.63, "symbols": 6, "lanes": 6, "sequence": 6}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const path=Array.from({length:4},()=>crypto.randomInt(0,6));
      const route=Array.isArray(choice.route)?choice.route.map(Number):[];
      const hits=route.reduce((n,v,i)=>n+(v===path[i]?1:0),0);
      multiplier=hits>=2?Number((1.28+hits*0.42).toFixed(2)):0;
      result={...result,mechanic:"Pathfinder route",path,route,hits,required:2};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
