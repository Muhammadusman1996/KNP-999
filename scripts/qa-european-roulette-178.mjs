import assert from 'node:assert/strict';
import engine from '../server/engines/178-european-roulette.js';

const expected=[0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];
const red=new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
assert.equal(expected.length,37);
assert.equal(new Set(expected).size,37);
assert.deepEqual([...expected].sort((a,b)=>a-b),Array.from({length:37},(_,i)=>i));
const cases=[
 ['number',0,10],['color','red',10],['parity','odd',10],['range','low',10],['dozen',1,10],['column',1,10],
 ['split','0-3',10],['street','1-2-3',10],['corner','1-2-4-5',10],['sixline','1-2-3-4-5-6',10]
];
for(const [type,value,amount] of cases){
  const r=engine.resolve({stake:amount,choice:{bets:[{type,value,amount}]}});
  assert.equal(r.result.wheel.length,37);
  assert.ok(expected.includes(r.result.winningNumber));
  assert.equal(r.result.wheel[r.result.wheelIndex],r.result.winningNumber);
  assert.equal(r.result.winningColor,r.result.winningNumber===0?'green':red.has(r.result.winningNumber)?'red':'black');
  assert.ok(Number.isFinite(r.payout)&&r.payout>=0);
}
assert.throws(()=>engine.resolve({stake:20,choice:{bets:[{type:'number',value:0,amount:10}]}}),/does not match stake/);
assert.throws(()=>engine.resolve({stake:10,choice:{bets:[{type:'color',value:'green',amount:10}]}}),/Invalid roulette bet/);
console.log('PASS: 37 unique pockets, all 10 bet types, server wheel/index/color consistency, invalid stake and invalid color guards.');
