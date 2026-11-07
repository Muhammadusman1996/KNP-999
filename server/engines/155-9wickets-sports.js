import crypto from "node:crypto";
// Standalone server engine for 9wickets-sports (Game #155); no shared profile resolver.
const GAME={id:155,name:"9Wickets Sports",profile:"arcade",variant:"9wickets-sports",rules:{"engineId": "knp-155-9wickets-sports", "title": "9Wickets Sports", "objective": "9Wickets Sports: Sports Prediction", "instructions": "Choose a sports outcome; a virtual match simulation resolves the selection.", "mechanic": "Sports Prediction", "parameters": {"mode": 126, "difficulty": 1, "target": 15, "risk": 0.6, "reward": 1.7, "sequenceLength": 4, "symbolCount": 7}, "uniqueRuleVersion": 1},parameters:{"target": 9, "range": 15, "rounds": 8, "difficulty": 1, "winRate": 50, "base": 3.4, "bonus": 6.5, "symbols": 7, "lanes": 4, "sequence": 7}}
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
