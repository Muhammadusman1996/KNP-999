import crypto from "node:crypto";
// Standalone server engine for Dragon Kingdom (Game #28); no shared profile resolver.
const GAME={id:28,name:"Dragon Kingdom",profile:"wheel",variant:"dragon-kingdom",rules:{"engineId": "knp-028-dragon-kingdom", "title": "Dragon Kingdom", "objective": "Dragon Kingdom: Symbol Hunt", "instructions": "Choose a symbol before the round; the server draws a symbol set and scores exact matches.", "mechanic": "Symbol Hunt", "parameters": {"mode": 193, "difficulty": 4, "target": 6, "risk": 0.15, "reward": 7.33, "sequenceLength": 6, "symbolCount": 11}, "uniqueRuleVersion": 2},parameters:{"target": 5, "range": 13, "rounds": 3, "difficulty": 4, "winRate": 38, "base": 1.63, "bonus": 7.58, "symbols": 11, "lanes": 6, "sequence": 6}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const tokens=Array.from({length:6},()=>crypto.randomInt(1,7));
      const chosen=Number(choice.token||0),sum=tokens.filter(v=>v===chosen).length;
      const parity=tokens.reduce((a,b)=>a+b,0)%2;
      multiplier=sum>=2?(parity===0?7.58:1.63):0;
      result={...result,mechanic:"Token parity",tokens,chosen,matches:sum,parity:parity?"odd":"even"};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
