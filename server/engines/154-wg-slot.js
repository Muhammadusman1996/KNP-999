import crypto from "node:crypto";
// Standalone server engine for wg-slot (Game #154); no shared profile resolver.
const GAME={id:154,name:"WG Slot",profile:"slot",variant:"wg-slot",rules:{"engineId": "knp-154-wg-slot", "title": "WG Slot", "objective": "WG Slot: Reel Match", "instructions": "Spin three reels and match symbols for a virtual reward.", "mechanic": "Reel Match", "parameters": {"mode": 109, "difficulty": 5, "target": 14, "risk": 0.59, "reward": 1.6, "sequenceLength": 8, "symbolCount": 6}, "uniqueRuleVersion": 1},parameters:{"target": 8, "range": 14, "rounds": 7, "difficulty": 5, "winRate": 49, "base": 3.2, "bonus": 6.17, "symbols": 6, "lanes": 8, "sequence": 6}}
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
