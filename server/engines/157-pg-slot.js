import crypto from "node:crypto";
// Standalone server engine for pg-slot (Game #157); no shared profile resolver.
const GAME={id:157,name:"PG Slot",profile:"slot",variant:"pg-slot",rules:{"engineId": "knp-157-pg-slot", "title": "PG Slot", "objective": "PG Slot: Fortune Reels", "instructions": "Spin themed reels and reveal matching symbol combinations.", "mechanic": "Fortune Reels", "parameters": {"mode": 160, "difficulty": 3, "target": 4, "risk": 0.62, "reward": 1.9, "sequenceLength": 6, "symbolCount": 9}, "uniqueRuleVersion": 1},parameters:{"target": 11, "range": 17, "rounds": 4, "difficulty": 3, "winRate": 52, "base": 1.4, "bonus": 7.17, "symbols": 9, "lanes": 6, "sequence": 5}}
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
