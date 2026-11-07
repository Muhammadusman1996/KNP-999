import crypto from "node:crypto";
// Standalone server engine for Dragon Empire (Game #76); no shared profile resolver.
const GAME={id:76,name:"Dragon Empire",profile:"wheel",variant:"dragon-empire",rules:{"engineId": "knp-076-dragon-empire", "title": "Dragon Empire", "objective": "Dragon Empire: Combo Quest", "instructions": "Choose a combo type; the server generates a sequence and checks the selected pattern.", "mechanic": "Combo Quest", "parameters": {"mode": 961, "difficulty": 2, "target": 7, "risk": 0.44, "reward": 2.52, "sequenceLength": 5, "symbolCount": 12}, "uniqueRuleVersion": 2},parameters:{"target": 3, "range": 22, "rounds": 8, "difficulty": 3, "winRate": 67, "base": 1.92, "bonus": 2.77, "symbols": 12, "lanes": 5, "sequence": 5}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const samples=Array.from({length:4},()=>crypto.randomInt(0,23));
      const target=Number(choice.target??3);
      const distance=Math.abs(samples.reduce((a,b)=>a+b,0)-target);
      multiplier=distance===0?2.77:distance<=2?1.92:0;
      result={...result,mechanic:"Sum precision",samples,target,distance,total:samples.reduce((a,b)=>a+b,0)};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
