import crypto from "node:crypto";
// Standalone server engine for golden-treasure (Game #188); no shared profile resolver.
const GAME={id:188,name:"Golden Treasure",profile:"slot",variant:"golden-treasure",rules:{"engineId": "knp-188-golden-treasure", "title": "Golden Treasure", "objective": "Golden Treasure: Golden Reels", "instructions": "Spin golden reels and match treasure symbols.", "mechanic": "Golden Reels", "parameters": {"mode": 185, "difficulty": 4, "target": 9, "risk": 0.53, "reward": 5.0, "sequenceLength": 7, "symbolCount": 12}, "uniqueRuleVersion": 1},parameters:{"target": 12, "range": 18, "rounds": 5, "difficulty": 4, "winRate": 48, "base": 2.8, "bonus": 4.17, "symbols": 12, "lanes": 7, "sequence": 4}}
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
