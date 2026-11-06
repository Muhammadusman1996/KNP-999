import crypto from "node:crypto";
// Standalone server engine for Fortune Tiger (Game #1); no shared profile resolver.
const GAME={id:1,name:"Fortune Tiger",profile:"slot",variant:"fortune-tiger",rules:{"engineId": "knp-001-fortune-tiger", "title": "Fortune Tiger", "objective": "Fortune Tiger: Combo Quest", "instructions": "Choose a combo type; the server generates a sequence and checks the selected pattern.", "mechanic": "Combo Quest", "parameters": {"mode": 180, "difficulty": 2, "target": 8, "risk": 0.4, "reward": 1.33, "sequenceLength": 6, "symbolCount": 9}, "uniqueRuleVersion": 2},parameters:{"target": 13, "range": 20, "rounds": 7, "difficulty": 4, "winRate": 63, "base": 2.33, "bonus": 1.58, "symbols": 9, "lanes": 6, "sequence": 6}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const path=Array.from({length:7},()=>crypto.randomInt(0,6));
      const route=Array.isArray(choice.route)?choice.route.map(Number):[];
      const hits=route.reduce((n,v,i)=>n+(v===path[i]?1:0),0);
      multiplier=hits>=5?Number((2.33+hits*0.42).toFixed(2)):0;
      result={...result,mechanic:"Pathfinder route",path,route,hits,required:5};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
