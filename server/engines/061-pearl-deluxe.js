import crypto from "node:crypto";
// Standalone server engine for Pearl Deluxe (Game #61); no shared profile resolver.
const GAME={id:61,name:"Pearl Deluxe",profile:"fishing",variant:"pearl-deluxe",rules:{"engineId": "knp-061-pearl-deluxe", "title": "Pearl Deluxe", "objective": "Pearl Deluxe: Precision Challenge", "instructions": "Choose a target value; the server generates a challenge value and scores distance from target.", "mechanic": "Precision Challenge", "parameters": {"mode": 395, "difficulty": 2, "target": 7, "risk": 0.31, "reward": 7.34, "sequenceLength": 7, "symbolCount": 12}, "uniqueRuleVersion": 2},parameters:{"target": 9, "range": 12, "rounds": 4, "difficulty": 5, "winRate": 54, "base": 3.14, "bonus": 7.59, "symbols": 12, "lanes": 7, "sequence": 7}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const path=Array.from({length:4},()=>crypto.randomInt(0,7));
      const route=Array.isArray(choice.route)?choice.route.map(Number):[];
      const hits=route.reduce((n,v,i)=>n+(v===path[i]?1:0),0);
      multiplier=hits>=2?Number((3.14+hits*0.42).toFixed(2)):0;
      result={...result,mechanic:"Pathfinder route",path,route,hits,required:2};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
