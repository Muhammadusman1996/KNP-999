import crypto from "node:crypto";
// Standalone server engine for Phantom Empire (Game #116); no shared profile resolver.
const GAME={id:116,name:"Phantom Empire",profile:"wheel",variant:"phantom-empire",rules:{"engineId": "knp-116-phantom-empire", "title": "Phantom Empire", "objective": "Phantom Empire: Symbol Hunt", "instructions": "Choose a symbol before the round; the server draws a symbol set and scores exact matches.", "mechanic": "Symbol Hunt", "parameters": {"mode": 458, "difficulty": 2, "target": 2, "risk": 0.13, "reward": 6.26, "sequenceLength": 4, "symbolCount": 8}, "uniqueRuleVersion": 2},parameters:{"target": 14, "range": 20, "rounds": 4, "difficulty": 2, "winRate": 36, "base": 2.06, "bonus": 6.51, "symbols": 8, "lanes": 4, "sequence": 4}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const samples=Array.from({length:4},()=>crypto.randomInt(0,21));
      const target=Number(choice.target??14);
      const distance=Math.abs(samples.reduce((a,b)=>a+b,0)-target);
      multiplier=distance===0?6.51:distance<=2?2.06:0;
      result={...result,mechanic:"Sum precision",samples,target,distance,total:samples.reduce((a,b)=>a+b,0)};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
