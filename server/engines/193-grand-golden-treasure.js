import crypto from "node:crypto";
// Standalone server engine for grand-golden-treasure (Game #193); no shared profile resolver.
const GAME={id:193,name:"Grand Golden Treasure",profile:"slot",variant:"grand-golden-treasure",rules:{"engineId": "knp-193-grand-golden-treasure", "title": "Grand Golden Treasure", "objective": "Grand Golden Treasure: Grand Treasure Reels", "instructions": "Spin for matching gold, gem and crown symbols.", "mechanic": "Grand Treasure Reels", "parameters": {"mode": 19, "difficulty": 4, "target": 14, "risk": 0.58, "reward": 5.5, "sequenceLength": 7, "symbolCount": 10}, "uniqueRuleVersion": 1},parameters:{"target": 17, "range": 23, "rounds": 4, "difficulty": 4, "winRate": 53, "base": 1.4, "bonus": 5.83, "symbols": 10, "lanes": 7, "sequence": 5}}
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
