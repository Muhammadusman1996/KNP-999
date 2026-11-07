import crypto from "node:crypto";
// Standalone server engine for bet-stacker-blackjack (Game #162); no shared profile resolver.
const GAME={id:162,name:"Bet Stacker Blackjack",profile:"blackjack",variant:"bet-stacker-blackjack",rules:{"engineId": "knp-162-bet-stacker-blackjack", "title": "Bet Stacker Blackjack", "objective": "Bet Stacker Blackjack: Blackjack 21", "instructions": "Deal, hit or stand; try to beat the dealer without exceeding 21.", "mechanic": "Blackjack 21", "parameters": {"mode": 245, "difficulty": 3, "target": 9, "risk": 0.27, "reward": 2.4, "sequenceLength": 6, "symbolCount": 7}, "uniqueRuleVersion": 1},parameters:{"target": 16, "range": 22, "rounds": 3, "difficulty": 3, "winRate": 57, "base": 2.4, "bonus": 2.17, "symbols": 7, "lanes": 6, "sequence": 6}}
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const reels=Array.from({length:3},()=>crypto.randomInt(0,12));
      const freq=reels.reduce((m,x)=>(m[x]=(m[x]||0)+1,m),{});
      const pairs=Object.values(freq).filter(x=>x===2).length, triple=Object.values(freq).includes(3);
      multiplier=triple?3.11:pairs?3.06:0;
      result={...result,mechanic:"Reel constellation",reels,matched:triple?3:pairs?2:0,symbolPool:12};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
