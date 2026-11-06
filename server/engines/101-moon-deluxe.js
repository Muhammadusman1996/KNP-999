import crypto from "node:crypto";
// Standalone server engine for Moon Deluxe (Game #101); no shared profile resolver.
const GAME={id:101,name:"Moon Deluxe",profile:"fishing",variant:"moon-deluxe",rules:{"engineId": "knp-101-moon-deluxe", "title": "Moon Deluxe", "objective": "Moon Deluxe: Treasure Route", "instructions": "Choose a route and risk level; the server resolves route hazards and treasure value.", "mechanic": "Treasure Route", "parameters": {"mode": 867, "difficulty": 2, "target": 5, "risk": 0.19, "reward": 5.92, "sequenceLength": 5, "symbolCount": 10}, "uniqueRuleVersion": 2},parameters:{"target": 10, "range": 19, "rounds": 4, "difficulty": 3, "winRate": 42, "base": 2.12, "bonus": 6.17, "symbols": 10, "lanes": 5, "sequence": 5}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const path=Array.from({length:4},()=>crypto.randomInt(0,5));
      const route=Array.isArray(choice.route)?choice.route.map(Number):[];
      const hits=route.reduce((n,v,i)=>n+(v===path[i]?1:0),0);
      multiplier=hits>=2?Number((2.12+hits*0.42).toFixed(2)):0;
      result={...result,mechanic:"Pathfinder route",path,route,hits,required:2};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
