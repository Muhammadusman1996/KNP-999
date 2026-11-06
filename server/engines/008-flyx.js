import crypto from "node:crypto";
// Standalone server engine for FlyX (Game #8); no shared profile resolver.
const GAME={id:8,name:"FlyX",profile:"crash",variant:"flyx",rules:{"engineId": "knp-008-flyx", "title": "FlyX", "objective": "FlyX: Treasure Route", "instructions": "Choose a route and risk level; the server resolves route hazards and treasure value.", "mechanic": "Treasure Route", "parameters": {"mode": 340, "difficulty": 4, "target": 5, "risk": 0.34, "reward": 3.72, "sequenceLength": 5, "symbolCount": 6}, "uniqueRuleVersion": 2},parameters:{"target": 10, "range": 21, "rounds": 4, "difficulty": 3, "winRate": 57, "base": 1.82, "bonus": 3.97, "symbols": 6, "lanes": 5, "sequence": 5}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const tokens=Array.from({length:6},()=>crypto.randomInt(1,7));
      const chosen=Number(choice.token||0),sum=tokens.filter(v=>v===chosen).length;
      const parity=tokens.reduce((a,b)=>a+b,0)%2;
      multiplier=sum>=2?(parity===0?3.97:1.82):0;
      result={...result,mechanic:"Token parity",tokens,chosen,matches:sum,parity:parity?"odd":"even"};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
