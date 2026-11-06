import crypto from "node:crypto";
// Standalone server engine for speed-andar-bahar (Game #191); no shared profile resolver.
const GAME={id:191,name:"Speed Andar Bahar",profile:"card",variant:"speed-andar-bahar",rules:{"engineId": "knp-191-speed-andar-bahar", "title": "Speed Andar Bahar", "objective": "Speed Andar Bahar: Fast Andar Bahar", "instructions": "Pick Andar or Bahar and compare the server-dealt cards.", "mechanic": "Fast Andar Bahar", "parameters": {"mode": 236, "difficulty": 2, "target": 12, "risk": 0.56, "reward": 5.3, "sequenceLength": 5, "symbolCount": 8}, "uniqueRuleVersion": 1},parameters:{"target": 15, "range": 21, "rounds": 8, "difficulty": 2, "winRate": 51, "base": 3.4, "bonus": 5.17, "symbols": 8, "lanes": 5, "sequence": 7}}
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
