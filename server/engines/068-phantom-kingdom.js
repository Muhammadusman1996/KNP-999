import crypto from "node:crypto";
// Standalone server engine for Phantom Kingdom (Game #68); no shared profile resolver.
const GAME={id:68,name:"Phantom Kingdom",profile:"wheel",variant:"phantom-kingdom",rules:{"engineId": "knp-068-phantom-kingdom", "title": "Phantom Kingdom", "objective": "Phantom Kingdom: Target Trial", "instructions": "Choose a target lane; hits are resolved on the server with game-specific accuracy and reward values.", "mechanic": "Target Trial", "parameters": {"mode": 687, "difficulty": 4, "target": 3, "risk": 0.5, "reward": 5.33, "sequenceLength": 6, "symbolCount": 7}, "uniqueRuleVersion": 2},parameters:{"target": 3, "range": 5, "rounds": 5, "difficulty": 4, "winRate": 73, "base": 1.53, "bonus": 5.58, "symbols": 7, "lanes": 6, "sequence": 6}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const tokens=Array.from({length:6},()=>crypto.randomInt(1,7));
      const chosen=Number(choice.token||0),sum=tokens.filter(v=>v===chosen).length;
      const parity=tokens.reduce((a,b)=>a+b,0)%2;
      multiplier=sum>=2?(parity===0?5.58:1.53):0;
      result={...result,mechanic:"Token parity",tokens,chosen,matches:sum,parity:parity?"odd":"even"};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
