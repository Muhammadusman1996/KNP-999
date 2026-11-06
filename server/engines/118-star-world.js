import crypto from "node:crypto";
// Standalone server engine for Star World (Game #118); no shared profile resolver.
const GAME={id:118,name:"Star World",profile:"slot",variant:"star-world",rules:{"engineId": "knp-118-star-world", "title": "Star World", "objective": "Star World: Lucky Draw", "instructions": "Choose a number band; a server-generated draw decides whether the selection wins.", "mechanic": "Lucky Draw", "parameters": {"mode": 488, "difficulty": 4, "target": 7, "risk": 0.24, "reward": 3.57, "sequenceLength": 5, "symbolCount": 5}, "uniqueRuleVersion": 2},parameters:{"target": 6, "range": 21, "rounds": 3, "difficulty": 3, "winRate": 47, "base": 1.27, "bonus": 3.82, "symbols": 5, "lanes": 5, "sequence": 5}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const tokens=Array.from({length:6},()=>crypto.randomInt(1,7));
      const chosen=Number(choice.token||0),sum=tokens.filter(v=>v===chosen).length;
      const parity=tokens.reduce((a,b)=>a+b,0)%2;
      multiplier=sum>=2?(parity===0?3.82:1.27):0;
      result={...result,mechanic:"Token parity",tokens,chosen,matches:sum,parity:parity?"odd":"even"};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
