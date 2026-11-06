import crypto from "node:crypto";
// Standalone server engine for sic-bo (Game #147); no shared profile resolver.
const GAME={id:147,name:"Sic Bo",profile:"dice",variant:"sic-bo",rules:{"engineId": "knp-147-sic-bo", "title": "Sic Bo", "objective": "Sic Bo: Three Dice", "instructions": "Choose a total or range; three server-generated dice determine the result.", "mechanic": "Three Dice", "parameters": {"mode": 241, "difficulty": 3, "target": 7, "risk": 0.52, "reward": 5.9, "sequenceLength": 6, "symbolCount": 6}, "uniqueRuleVersion": 1},parameters:{"target": 16, "range": 22, "rounds": 6, "difficulty": 3, "winRate": 42, "base": 1.8, "bonus": 3.83, "symbols": 6, "lanes": 6, "sequence": 7}}
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
