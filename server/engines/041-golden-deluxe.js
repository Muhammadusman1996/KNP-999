import crypto from "node:crypto";
// Standalone server engine for Golden Deluxe (Game #41); no shared profile resolver.
const GAME={id:41,name:"Golden Deluxe",profile:"puzzle",variant:"golden-deluxe",rules:{"engineId": "knp-041-golden-deluxe", "title": "Golden Deluxe", "objective": "Golden Deluxe: Combo Quest", "instructions": "Choose a combo type; the server generates a sequence and checks the selected pattern.", "mechanic": "Combo Quest", "parameters": {"mode": 663, "difficulty": 2, "target": 7, "risk": 0.27, "reward": 3.35, "sequenceLength": 3, "symbolCount": 11}, "uniqueRuleVersion": 2},parameters:{"target": 13, "range": 22, "rounds": 3, "difficulty": 1, "winRate": 50, "base": 2.65, "bonus": 3.6, "symbols": 11, "lanes": 3, "sequence": 3}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const path=Array.from({length:3},()=>crypto.randomInt(0,3));
      const route=Array.isArray(choice.route)?choice.route.map(Number):[];
      const hits=route.reduce((n,v,i)=>n+(v===path[i]?1:0),0);
      multiplier=hits>=1?Number((2.65+hits*0.42).toFixed(2)):0;
      result={...result,mechanic:"Pathfinder route",path,route,hits,required:1};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
