import crypto from "node:crypto";
// Standalone server engine for Phantom Quest (Game #140); no shared profile resolver.
const GAME={id:140,name:"Phantom Quest",profile:"wheel",variant:"phantom-quest",rules:{"engineId": "knp-140-phantom-quest", "title": "Phantom Quest", "objective": "Phantom Quest: Combo Quest", "instructions": "Choose a combo type; the server generates a sequence and checks the selected pattern.", "mechanic": "Combo Quest", "parameters": {"mode": 338, "difficulty": 1, "target": 5, "risk": 0.32, "reward": 2.45, "sequenceLength": 3, "symbolCount": 7}, "uniqueRuleVersion": 2},parameters:{"target": 8, "range": 22, "rounds": 5, "difficulty": 1, "winRate": 55, "base": 1.35, "bonus": 2.7, "symbols": 7, "lanes": 3, "sequence": 3}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const reels=Array.from({length:3},()=>crypto.randomInt(0,7));
      const freq=reels.reduce((m,x)=>(m[x]=(m[x]||0)+1,m),{});
      const pairs=Object.values(freq).filter(x=>x===2).length, triple=Object.values(freq).includes(3);
      multiplier=triple?2.7:pairs?1.35:0;
      result={...result,mechanic:"Reel constellation",reels,matched:triple?3:pairs?2:0,symbolPool:7};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
