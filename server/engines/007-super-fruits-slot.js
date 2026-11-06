import crypto from "node:crypto";
// Standalone server engine for Super Fruits Slot (Game #7); no shared profile resolver.
const GAME={id:7,name:"Super Fruits Slot",profile:"slot",variant:"super-fruits-slot",rules:{"engineId": "knp-007-super-fruits-slot", "title": "Super Fruits Slot", "objective": "Super Fruits Slot: Lucky Draw", "instructions": "Choose a number band; a server-generated draw decides whether the selection wins.", "mechanic": "Lucky Draw", "parameters": {"mode": 446, "difficulty": 3, "target": 7, "risk": 0.12, "reward": 5.0, "sequenceLength": 3, "symbolCount": 10}, "uniqueRuleVersion": 2},parameters:{"target": 10, "range": 22, "rounds": 6, "difficulty": 1, "winRate": 35, "base": 1.6, "bonus": 5.25, "symbols": 10, "lanes": 3, "sequence": 3}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const columns=Array.from({length:4},()=>crypto.randomInt(0,3));
      const pick=Number(choice.lane??-1),count=columns.filter(x=>x===pick).length;
      multiplier=count>=2?Number((1.6*count).toFixed(2)):0;
      result={...result,mechanic:"Lane convergence",columns,pick,count};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
