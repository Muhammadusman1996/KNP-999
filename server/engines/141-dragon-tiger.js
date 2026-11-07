import crypto from "node:crypto";
const GAME_ID=141;
const RANKS=["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
const SUITS=["♠","♥","♦","♣"];
const draw=()=>({rank:RANKS[crypto.randomInt(0,RANKS.length)],suit:SUITS[crypto.randomInt(0,SUITS.length)]});
const value=rank=>RANKS.indexOf(rank)+1;
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake);if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 const side=String(choice.side||"");if(!["Dragon","Tiger","Tie"].includes(side))throw new Error("Choose Dragon, Tiger or Tie before betting");
 const dragon=draw(),tiger=draw();const dv=value(dragon.rank),tv=value(tiger.rank);const outcome=dv===tv?"Tie":dv>tv?"Dragon":"Tiger";
 const multiplier=outcome==="Tie"?(side==="Tie"?8:0):(side===outcome?1.95:0);
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{gameId:GAME_ID,name:"Dragon Tiger",variant:"dragon-tiger",action,dragon,tiger,dragonValue:dv,tigerValue:tv,outcome,selected:side,won:payout>0,stake:bet,payout,net:Math.round((payout-bet)*100)/100}};
}
export const engine=Object.freeze({gameId:GAME_ID,name:"Dragon Tiger",profile:"card",variant:"dragon-tiger",resolve});
export default engine;
