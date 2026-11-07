import crypto from "node:crypto";
// Standalone server engine for Crystal Mystery (Game #134); no shared profile resolver.
const GAME={id:134,name:"Crystal Mystery",profile:"slot",variant:"crystal-mystery",rules:{"engineId": "knp-134-crystal-mystery", "title": "Crystal Mystery", "objective": "Crystal Mystery: Target Trial", "instructions": "Choose a target lane; hits are resolved on the server with game-specific accuracy and reward values.", "mechanic": "Target Trial", "parameters": {"mode": 138, "difficulty": 5, "target": 4, "risk": 0.22, "reward": 3.65, "sequenceLength": 3, "symbolCount": 9}, "uniqueRuleVersion": 2},parameters:{"target": 14, "range": 22, "rounds": 7, "difficulty": 1, "winRate": 45, "base": 2.15, "bonus": 3.9, "symbols": 9, "lanes": 3, "sequence": 3}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const sectors=Array.from({length:8},(_,i)=>({sector:i,value:crypto.randomInt(0,100)}));
      const selected=Number(choice.sector??-1),landed=sectors.reduce((a,b)=>a.value>b.value?a:b).sector;
      multiplier=selected===landed?3.9:0;
      result={...result,mechanic:"Peak sector",sectors,selected,landed};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
