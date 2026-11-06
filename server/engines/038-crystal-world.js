import crypto from "node:crypto";
// Standalone server engine for Crystal World (Game #38); no shared profile resolver.
const GAME={id:38,name:"Crystal World",profile:"slot",variant:"crystal-world",rules:{"engineId": "knp-038-crystal-world", "title": "Crystal World", "objective": "Crystal World: Combo Quest", "instructions": "Choose a combo type; the server generates a sequence and checks the selected pattern.", "mechanic": "Combo Quest", "parameters": {"mode": 552, "difficulty": 4, "target": 6, "risk": 0.28, "reward": 2.01, "sequenceLength": 4, "symbolCount": 7}, "uniqueRuleVersion": 2},parameters:{"target": 9, "range": 15, "rounds": 7, "difficulty": 2, "winRate": 51, "base": 1.31, "bonus": 2.26, "symbols": 7, "lanes": 4, "sequence": 4}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const tokens=Array.from({length:6},()=>crypto.randomInt(1,7));
      const chosen=Number(choice.token||0),sum=tokens.filter(v=>v===chosen).length;
      const parity=tokens.reduce((a,b)=>a+b,0)%2;
      multiplier=sum>=2?(parity===0?2.26:1.31):0;
      result={...result,mechanic:"Token parity",tokens,chosen,matches:sum,parity:parity?"odd":"even"};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
