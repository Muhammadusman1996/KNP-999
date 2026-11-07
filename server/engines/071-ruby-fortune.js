import crypto from "node:crypto";
// Standalone server engine for Ruby Fortune (Game #71); no shared profile resolver.
const GAME={id:71,name:"Ruby Fortune",profile:"dice",variant:"ruby-fortune",rules:{"engineId": "knp-071-ruby-fortune", "title": "Ruby Fortune", "objective": "Ruby Fortune: Precision Challenge", "instructions": "Choose a target value; the server generates a challenge value and scores distance from target.", "mechanic": "Precision Challenge", "parameters": {"mode": 765, "difficulty": 2, "target": 11, "risk": 0.44, "reward": 1.27, "sequenceLength": 5, "symbolCount": 11}, "uniqueRuleVersion": 2},parameters:{"target": 12, "range": 9, "rounds": 5, "difficulty": 3, "winRate": 67, "base": 3.27, "bonus": 1.52, "symbols": 11, "lanes": 5, "sequence": 5}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const path=Array.from({length:5},()=>crypto.randomInt(0,5));
      const route=Array.isArray(choice.route)?choice.route.map(Number):[];
      const hits=route.reduce((n,v,i)=>n+(v===path[i]?1:0),0);
      multiplier=hits>=3?Number((3.27+hits*0.42).toFixed(2)):0;
      result={...result,mechanic:"Pathfinder route",path,route,hits,required:3};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
