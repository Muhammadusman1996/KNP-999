import crypto from "node:crypto";
// Standalone server engine for Neon Fortune (Game #51); no shared profile resolver.
const GAME={id:51,name:"Neon Fortune",profile:"crash",variant:"neon-fortune",rules:{"engineId": "knp-051-neon-fortune", "title": "Neon Fortune", "objective": "Neon Fortune: Precision Challenge", "instructions": "Choose a target value; the server generates a challenge value and scores distance from target.", "mechanic": "Precision Challenge", "parameters": {"mode": 25, "difficulty": 2, "target": 4, "risk": 0.25, "reward": 6.93, "sequenceLength": 6, "symbolCount": 7}, "uniqueRuleVersion": 2},parameters:{"target": 12, "range": 22, "rounds": 7, "difficulty": 4, "winRate": 48, "base": 2.63, "bonus": 7.18, "symbols": 7, "lanes": 6, "sequence": 6}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const path=Array.from({length:7},()=>crypto.randomInt(0,6));
      const route=Array.isArray(choice.route)?choice.route.map(Number):[];
      const hits=route.reduce((n,v,i)=>n+(v===path[i]?1:0),0);
      multiplier=hits>=5?Number((2.63+hits*0.42).toFixed(2)):0;
      result={...result,mechanic:"Pathfinder route",path,route,hits,required:5};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
