import crypto from "node:crypto";
// Standalone server engine for baccarat (Game #148); no shared profile resolver.
const GAME={id:148,name:"Baccarat",profile:"card",variant:"baccarat",rules:{"engineId": "knp-148-baccarat", "title": "Baccarat", "objective": "Baccarat: Card Total", "instructions": "Choose Player, Banker or Tie; compare server-dealt card totals.", "mechanic": "Card Total", "parameters": {"mode": 7, "difficulty": 4, "target": 8, "risk": 0.53, "reward": 6.0, "sequenceLength": 7, "symbolCount": 7}, "uniqueRuleVersion": 1},parameters:{"target": 17, "range": 23, "rounds": 7, "difficulty": 4, "winRate": 43, "base": 2.0, "bonus": 4.17, "symbols": 7, "lanes": 7, "sequence": 4}}
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const samples=Array.from({length:4},()=>crypto.randomInt(0,22));
      const target=Number(choice.target??5);
      const distance=Math.abs(samples.reduce((a,b)=>a+b,0)-target);
      multiplier=distance===0?3.41:distance<=2?2.16:0;
      result={...result,mechanic:"Sum precision",samples,target,distance,total:samples.reduce((a,b)=>a+b,0)};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
