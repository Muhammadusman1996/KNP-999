import crypto from "node:crypto";
// Standalone server engine for Velvet Kingdom (Game #88); no shared profile resolver.
const GAME={id:88,name:"Velvet Kingdom",profile:"arcade",variant:"velvet-kingdom",rules:{"engineId": "knp-088-velvet-kingdom", "title": "Velvet Kingdom", "objective": "Velvet Kingdom: Symbol Hunt", "instructions": "Choose a symbol before the round; the server draws a symbol set and scores exact matches.", "mechanic": "Symbol Hunt", "parameters": {"mode": 419, "difficulty": 4, "target": 5, "risk": 0.12, "reward": 2.95, "sequenceLength": 3, "symbolCount": 11}, "uniqueRuleVersion": 2},parameters:{"target": 6, "range": 5, "rounds": 3, "difficulty": 1, "winRate": 35, "base": 2.95, "bonus": 3.2, "symbols": 11, "lanes": 3, "sequence": 3}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const tokens=Array.from({length:6},()=>crypto.randomInt(1,7));
      const chosen=Number(choice.token||0),sum=tokens.filter(v=>v===chosen).length;
      const parity=tokens.reduce((a,b)=>a+b,0)%2;
      multiplier=sum>=2?(parity===0?3.2:2.95):0;
      result={...result,mechanic:"Token parity",tokens,chosen,matches:sum,parity:parity?"odd":"even"};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
