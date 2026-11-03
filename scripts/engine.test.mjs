import test from 'node:test';
import assert from 'node:assert/strict';
import { effectivePower, baseUnits, validTokenId, damagePerSecond, shieldPhase, roundCountdown, CONTRACTS, SEPOLIA } from '../app.js';
test('official staking formula includes the NFT-dependent multiplier', () => {
  assert.equal(effectivePower(3000,400),3040);
  assert.equal(effectivePower(0,400),10);
  assert.equal(effectivePower(1207269,0),1207269);
  assert.equal(effectivePower(-1,400),null);
  assert.equal(effectivePower(1,Infinity),null);
  assert.equal(effectivePower(1,1,0),null);
});
test('18 decimal values and token input boundaries', () => {
  assert.equal(baseUnits('40000000000000000000'),40);
  assert.equal(baseUnits('116800000000000000000000'),116800);
  assert.equal(baseUnits('invalid'),0);
  for (const id of [1,42,888,9999]) assert.equal(validTokenId(id),true);
  for (const id of [0,-1,10000,1.1,'1e3','<svg>','']) assert.equal(validTokenId(id),false);
});
test('all stances remain playable when idle and wheel telemetry changes damage', () => {
  for (const stance of ['overclock','bastion','surge']) assert.ok(damagePerSecond(0,0,0,stance)>0);
  assert.equal(damagePerSecond(3000,0,0,'bastion'),42);
  assert.equal(damagePerSecond(3000,0,1000,'overclock'),63);
  assert.equal(damagePerSecond(3000,0,0,'overclock',true),63);
  assert.equal(damagePerSecond(3000,1000,0,'bastion'),84);
  assert.ok(damagePerSecond(6000,0,0,'bastion')>damagePerSecond(3000,0,0,'bastion'));
});
test('boss phases react to work, 24h work, speed and remaining HP', () => {
  assert.equal(shieldPhase(12000,12000,0,0,0).key,'armored');
  assert.equal(shieldPhase(12000,12000,20,0,0).key,'exposed');
  assert.equal(shieldPhase(12000,12000,0,100,0).key,'exposed');
  assert.equal(shieldPhase(12000,12000,0,0,100).key,'exposed');
  assert.equal(shieldPhase(12000,2000,0,0,0).key,'enraged');
});
test('ten-minute rounds roll at exact UTC boundaries', () => {
  assert.equal(roundCountdown(0),600);
  assert.equal(roundCountdown(599000),1);
  assert.equal(roundCountdown(600000),600);
});
test('transaction payloads encode exactly zero allowance, one NFT and checkpoint', () => {
  assert.equal(SEPOLIA,'0xaa36a7');
  assert.equal(Number.parseInt(SEPOLIA,16),11155111);
  assert.equal(CONTRACTS.ping.address,'0x5501e1fa81be1c3f49225fa7668da0245d07db60');
  assert.equal(CONTRACTS.ping.data.slice(10,74),'0000000000000000000000004b67b739dfd832f4eac67a7aa3bc244fb74cea4f');
  assert.equal(BigInt('0x'+CONTRACTS.ping.data.slice(74)),0n);
  assert.equal(CONTRACTS.claim.address,'0x1ff6485abfbb2d183cd673d78e1ab31c098e04dd');
  assert.equal(BigInt('0x'+CONTRACTS.claim.data.slice(10)),1n);
  assert.equal(CONTRACTS.checkpoint.data,'0xc2c4c5c1');
});
