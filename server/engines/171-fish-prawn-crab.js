import crypto from "node:crypto";
// Standalone server engine for fish-prawn-crab (Game #171); no shared profile resolver.
const GAME={id:171,name:"Fish Prawn Crab",profile:"dice",variant:"fish-prawn-crab",rules:{"engineId": "knp-171-fish-prawn-crab", "title": "Fish Prawn Crab", "objective": "Fish Prawn Crab: Animal Dice", "instructions": "Choose animal symbols and roll the dice to count matches.", "mechanic": "Animal Dice", "parameters": {"mode": 147, "difficulty": 2, "target": 5, "risk": 0.36, "reward": 3.3, "sequenceLength": 5, "symbolCount": 9}, "uniqueRuleVersion": 1},parameters:{"target": 10, "range": 16, "rounds": 6, "difficulty": 2, "winRate": 66, "base": 1.8, "bonus": 5.17, "symbols": 9, "lanes": 5, "sequence": 7}}
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
