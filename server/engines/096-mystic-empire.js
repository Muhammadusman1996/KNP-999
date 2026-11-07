import crypto from "node:crypto";
// Standalone server engine for Mystic Empire (Game #96); no shared profile resolver.
const GAME={id:96,name:"Mystic Empire",profile:"arcade",variant:"mystic-empire",rules:{"engineId": "knp-096-mystic-empire", "title": "Mystic Empire", "objective": "Mystic Empire: Combo Quest", "instructions": "Choose a combo type; the server generates a sequence and checks the selected pattern.", "mechanic": "Combo Quest", "parameters": {"mode": 704, "difficulty": 2, "target": 4, "risk": 0.36, "reward": 7.29, "sequenceLength": 7, "symbolCount": 11}, "uniqueRuleVersion": 2},parameters:{"target": 7, "range": 16, "rounds": 3, "difficulty": 5, "winRate": 59, "base": 3.19, "bonus": 7.54, "symbols": 11, "lanes": 7, "sequence": 7}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const samples=Array.from({length:4},()=>crypto.randomInt(0,17));
      const target=Number(choice.target??7);
      const distance=Math.abs(samples.reduce((a,b)=>a+b,0)-target);
      multiplier=distance===0?7.54:distance<=2?3.19:0;
      result={...result,mechanic:"Sum precision",samples,target,distance,total:samples.reduce((a,b)=>a+b,0)};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
