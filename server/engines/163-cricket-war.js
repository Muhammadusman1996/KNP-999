import crypto from "node:crypto";
// Standalone server engine for cricket-war (Game #163); no shared profile resolver.
const GAME={id:163,name:"Cricket War",profile:"arcade",variant:"cricket-war",rules:{"engineId": "knp-163-cricket-war", "title": "Cricket War", "objective": "Cricket War: Cricket Duel", "instructions": "Choose a batting outcome in a short virtual cricket challenge.", "mechanic": "Cricket Duel", "parameters": {"mode": 11, "difficulty": 4, "target": 10, "risk": 0.28, "reward": 2.5, "sequenceLength": 7, "symbolCount": 8}, "uniqueRuleVersion": 1},parameters:{"target": 17, "range": 23, "rounds": 4, "difficulty": 4, "winRate": 58, "base": 2.6, "bonus": 2.5, "symbols": 8, "lanes": 7, "sequence": 7}}
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const sectors=Array.from({length:8},(_,i)=>({sector:i,value:crypto.randomInt(0,100)}));
      const selected=Number(choice.sector??-1),landed=sectors.reduce((a,b)=>a.value>b.value?a:b).sector;
      multiplier=selected===landed?3.74:0;
      result={...result,mechanic:"Peak sector",sectors,selected,landed};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
