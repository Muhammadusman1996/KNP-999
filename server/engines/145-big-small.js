import crypto from "node:crypto";
// Standalone server engine for big-small (Game #145); no shared profile resolver.
const GAME={id:145,name:"Big & Small",profile:"dice",variant:"big-small",rules:{"engineId": "knp-145-big-small", "title": "Big & Small", "objective": "Big & Small: Dice Range", "instructions": "Choose Big or Small before the dice are rolled and compared.", "mechanic": "Dice Range", "parameters": {"mode": 207, "difficulty": 1, "target": 5, "risk": 0.5, "reward": 5.7, "sequenceLength": 4, "symbolCount": 11}, "uniqueRuleVersion": 1},parameters:{"target": 14, "range": 20, "rounds": 4, "difficulty": 1, "winRate": 40, "base": 1.4, "bonus": 3.17, "symbols": 11, "lanes": 4, "sequence": 5}}
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const tokens=Array.from({length:6},()=>crypto.randomInt(1,7));
      const chosen=Number(choice.token||0),sum=tokens.filter(v=>v===chosen).length;
      const parity=tokens.reduce((a,b)=>a+b,0)%2;
      multiplier=sum>=2?(parity===0?6.83:2.18):0;
      result={...result,mechanic:"Token parity",tokens,chosen,matches:sum,parity:parity?"odd":"even"};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
