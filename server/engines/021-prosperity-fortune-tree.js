import crypto from "node:crypto";
// Standalone server engine for Prosperity Fortune Tree (Game #21); no shared profile resolver.
const GAME={id:21,name:"Prosperity Fortune Tree",profile:"slot",variant:"prosperity-fortune-tree",rules:{"engineId": "knp-021-prosperity-fortune-tree", "title": "Prosperity Fortune Tree", "objective": "Prosperity Fortune Tree: Risk Ladder", "instructions": "Choose how many stages to attempt; each stage increases reward and failure risk.", "mechanic": "Risk Ladder", "parameters": {"mode": 33, "difficulty": 2, "target": 12, "risk": 0.27, "reward": 5.9, "sequenceLength": 3, "symbolCount": 6}, "uniqueRuleVersion": 2},parameters:{"target": 5, "range": 12, "rounds": 6, "difficulty": 1, "winRate": 50, "base": 1.3, "bonus": 6.15, "symbols": 6, "lanes": 3, "sequence": 3}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const path=Array.from({length:6},()=>crypto.randomInt(0,3));
      const route=Array.isArray(choice.route)?choice.route.map(Number):[];
      const hits=route.reduce((n,v,i)=>n+(v===path[i]?1:0),0);
      multiplier=hits>=4?Number((1.3+hits*0.42).toFixed(2)):0;
      result={...result,mechanic:"Pathfinder route",path,route,hits,required:4};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
