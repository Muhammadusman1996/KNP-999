import crypto from "node:crypto";
// Standalone server engine for red-vs-blue (Game #146); no shared profile resolver.
const GAME={id:146,name:"Red vs Blue",profile:"arcade",variant:"red-vs-blue",rules:{"engineId": "knp-146-red-vs-blue", "title": "Red vs Blue", "objective": "Red vs Blue: Color Duel", "instructions": "Choose a color team; the server draws the winning color for the round.", "mechanic": "Color Duel", "parameters": {"mode": 224, "difficulty": 2, "target": 6, "risk": 0.51, "reward": 5.8, "sequenceLength": 5, "symbolCount": 12}, "uniqueRuleVersion": 1},parameters:{"target": 15, "range": 21, "rounds": 5, "difficulty": 2, "winRate": 41, "base": 1.6, "bonus": 3.5, "symbols": 12, "lanes": 5, "sequence": 6}}
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
