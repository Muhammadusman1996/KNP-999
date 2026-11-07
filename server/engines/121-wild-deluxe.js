import crypto from "node:crypto";
// Standalone server engine for Wild Deluxe (Game #121); no shared profile resolver.
const GAME={id:121,name:"Wild Deluxe",profile:"puzzle",variant:"wild-deluxe",rules:{"engineId": "knp-121-wild-deluxe", "title": "Wild Deluxe", "objective": "Wild Deluxe: Treasure Route", "instructions": "Choose a route and risk level; the server resolves route hazards and treasure value.", "mechanic": "Treasure Route", "parameters": {"mode": 610, "difficulty": 2, "target": 11, "risk": 0.36, "reward": 6.09, "sequenceLength": 7, "symbolCount": 9}, "uniqueRuleVersion": 2},parameters:{"target": 5, "range": 11, "rounds": 3, "difficulty": 5, "winRate": 59, "base": 1.39, "bonus": 6.34, "symbols": 9, "lanes": 7, "sequence": 7}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const path=Array.from({length:3},()=>crypto.randomInt(0,7));
      const route=Array.isArray(choice.route)?choice.route.map(Number):[];
      const hits=route.reduce((n,v,i)=>n+(v===path[i]?1:0),0);
      multiplier=hits>=1?Number((1.39+hits*0.42).toFixed(2)):0;
      result={...result,mechanic:"Pathfinder route",path,route,hits,required:1};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
