import crypto from "node:crypto";
// Standalone server engine for jhandi-munda (Game #170); no shared profile resolver.
const GAME={id:170,name:"Jhandi Munda",profile:"dice",variant:"jhandi-munda",rules:{"engineId": "knp-170-jhandi-munda", "title": "Jhandi Munda", "objective": "Jhandi Munda: Six Symbol Dice", "instructions": "Choose a symbol and roll six dice to count matching faces.", "mechanic": "Six Symbol Dice", "parameters": {"mode": 130, "difficulty": 1, "target": 4, "risk": 0.35, "reward": 3.2, "sequenceLength": 4, "symbolCount": 8}, "uniqueRuleVersion": 1},parameters:{"target": 9, "range": 15, "rounds": 5, "difficulty": 1, "winRate": 65, "base": 1.6, "bonus": 4.83, "symbols": 8, "lanes": 4, "sequence": 6}}
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
