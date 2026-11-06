import crypto from "node:crypto";
// Standalone server engine for 7up7down (Game #18); no shared profile resolver.
const GAME={id:18,name:"7up7down",profile:"dice",variant:"7up7down",rules:{"engineId": "knp-018-7up7down", "title": "7up7down", "objective": "7up7down: Target Trial", "instructions": "Choose a target lane; hits are resolved on the server with game-specific accuracy and reward values.", "mechanic": "Target Trial", "parameters": {"mode": 754, "difficulty": 4, "target": 7, "risk": 0.25, "reward": 6.58, "sequenceLength": 6, "symbolCount": 10}, "uniqueRuleVersion": 2},parameters:{"target": 5, "range": 15, "rounds": 4, "difficulty": 4, "winRate": 48, "base": 2.18, "bonus": 6.83, "symbols": 10, "lanes": 6, "sequence": 6}};
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
