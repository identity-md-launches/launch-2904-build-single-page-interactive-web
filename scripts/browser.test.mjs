import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { fixtures, FIXED_NOW, OWNER } from './browser-fixtures.mjs';
import { CONTRACTS, SEPOLIA } from '../app.js';
const pw = process.env.SQUEEK_PLAYWRIGHT ? await import(pathToFileURL(process.env.SQUEEK_PLAYWRIGHT).href) : await import('playwright');
const root = resolve(import.meta.dirname,'../dist');
const art = `data:image/svg+xml;base64,${(await readFile(resolve(root,'assets/favicon.svg'))).toString('base64')}`;
const mime = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png'};
const server = createServer(async(req,res)=>{
  const url = new URL(req.url,'http://localhost');
  if (!url.pathname.startsWith('/preview/')) return res.writeHead(404).end();
  const file = resolve(root,decodeURIComponent(url.pathname.slice('/preview/'.length)||'index.html'));
  if (!file.startsWith(root+sep)) return res.writeHead(403).end();
  try {res.setHeader('Content-Type',mime[extname(file)]||'application/octet-stream');res.end(await readFile(file));}catch{res.writeHead(404).end();}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const url = `http://127.0.0.1:${server.address().port}/preview/`;
let count = 0;
const pass = name=>{count++;console.log(`PASS ${name}`);};
async function setup(browser,{wallet=false,offline=false}={}) {
  const context = await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
  const page = await context.newPage();
  await page.clock.install({time:FIXED_NOW});
  const state = {now:FIXED_NOW,spinning:false,work:83267,height:7520,settled:1099,offline,badNft:false};
  const errors = [];
  page.on('pageerror',error=>errors.push(error.message));
  await page.route('https://api.squeekchain.com/v1/**',async route=>{
    if (state.offline) return route.fulfill({status:503,contentType:'application/json',body:'{}'});
    const path = new URL(route.request().url()).pathname.replace('/v1/','');
    const f = fixtures(state,art); let body;
    if (path.startsWith('squeeks/')) {
      const id = Number(path.split('/')[1]);
      if (state.badNft && id===9999) return route.fulfill({status:404,contentType:'application/json',body:'{}'});
      body = f.nft(id);
    } else body = path==='settlements'?f.settlements:f[path];
    return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(body)});
  });
  if (wallet) await page.addInitScript(({owner,sepolia})=>{
    const handlers = {}; const mock = {chain:'0x1',account:owner,calls:[],reject:false,revert:false,failCall:false,unknown:false,pending:false};
    window.__wallet = mock;
    const provider = {
      on:(event,fn)=>{handlers[event]=fn;},removeListener:event=>{delete handlers[event];},
      request:async ({method,params})=>{
        mock.calls.push({method,params});
        if (method==='eth_requestAccounts') {if(mock.reject)throw {code:4001,message:'User rejected connection'};return [mock.account];}
        if (method==='eth_accounts') return mock.account?[mock.account]:[];
        if (method==='eth_chainId') return mock.chain;
        if (method==='wallet_switchEthereumChain') {if(mock.unknown){mock.unknown=false;throw {code:4902};}mock.chain=params[0].chainId;handlers.chainChanged?.(mock.chain);return null;}
        if (method==='wallet_addEthereumChain') return null;
        if (method==='eth_call') {if(mock.failCall)throw {code:3,message:'Test contract is ineligible'};return '0x';}
        if (method==='eth_sendTransaction') {if(mock.reject)throw {code:4001,message:'User rejected transaction'};return '0x'+'b'.repeat(64);}
        if (method==='eth_getTransactionReceipt') return mock.pending?null:{status:mock.revert?'0x0':'0x1'};
        throw new Error('Unexpected method '+method);
      }
    };
    window.ethereum=provider;window.__emit=(event,value)=>handlers[event]?.(value);
    addEventListener('eip6963:requestProvider',()=>dispatchEvent(new CustomEvent('eip6963:announceProvider',{detail:{info:{uuid:'test-wallet',name:'Test EIP-6963 wallet',icon:'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>'},provider}})));
  },{owner:OWNER,sepolia:SEPOLIA});
  await page.goto(url); await page.waitForFunction(()=>document.querySelector('#squad-message').textContent.includes('Loaded')||document.querySelector('#feed-tag').textContent.includes('unavailable'));
  return {context,page,state,errors,advance:async ms=>{state.now+=ms;await page.clock.fastForward(ms);}};
}
async function check(browser,name) {
  const {page,context,state,errors,advance} = await setup(browser);
  try {
    assert.equal(await page.locator('#squad-total').innerText(),'3,000');
    assert.equal(await page.locator('.squeek-art').count(),3);
    assert.equal(await page.locator('#distance').innerText(),'6.374');
    assert.equal(await page.locator('#block-percent').innerText(),'25.9%');
    assert.equal(await page.locator('#staked-power').innerText(),'116,800');
    pass(`${name}: APIs, NFT images, base-unit and mm conversions`);
    for (const width of [320,390,680,720,850,1150,1440,1920]) {
      await page.setViewportSize({width,height:900});
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow at ${width}`);
    }
    await page.setViewportSize({width:390,height:844}); await page.evaluate(()=>scrollTo(0,0));
    const mainButton=await page.locator('#start-raid').boundingBox();assert.ok(mainButton.y+mainButton.height<=844);
    pass(`${name}: no overflow at eight widths; main action visible at 390`);
    await page.locator('#start-raid').click(); await advance(1000);
    assert.match(await page.locator('#start-raid').innerText(),/Wheel burst/);
    const before=Number((await page.locator('#damage-done').innerText()).replaceAll(',',''));
    await page.locator('#start-raid').click();
    assert.ok(Number((await page.locator('#damage-done').innerText()).replaceAll(',',''))>before);
    assert.ok(Number((await page.locator('#xp').innerText()).replaceAll(',',''))>0);
    await page.locator('#skill').click();assert.ok(await page.locator('#skill').isDisabled());
    await page.locator('#pause-raid').click();const hp=await page.locator('#boss-hp').innerText();await advance(1000);assert.equal(await page.locator('#boss-hp').innerText(),hp);
    pass(`${name}: idle gameplay, arena boost, skill cooldown, XP and pause`);
    await page.locator('[data-boss="1"]').click();assert.match(await page.locator('#boss-hp').innerText(),/16,000/);
    await page.locator('[data-boss="2"]').click();assert.match(await page.locator('#boss-name').innerText(),/Latency Dragon/);
    await page.locator('[data-boss="0"]').click();
    await page.locator('[data-stance="bastion"]').click();await page.locator('#lock-stance').click();assert.ok(await page.locator('#lock-stance').isDisabled());
    await page.locator('#start-raid').click();
    for(let i=0;i<22;i++) await advance(1000);
    assert.equal(await page.locator('#counter-value').innerText(),'100%');
    assert.ok(Number((await page.locator('#raid-points').innerText()).replace(/\D/g,''))>0);
    await page.locator('#counter').click();assert.equal(await page.locator('#counter-value').innerText(),'0%');
    pass(`${name}: all bosses, stance lock, idle Raid Points and counter-attack`);
    await page.locator('#pause-raid').click();
    const xp=await page.locator('#xp').innerText();await page.reload();await page.waitForFunction(()=>document.querySelector('#squad-total').textContent==='3,000');assert.equal(await page.locator('#xp').innerText(),xp);assert.ok(await page.locator('#lock-stance').isDisabled());
    pass(`${name}: XP and locked stance persist after reload`);
    await page.locator('#calc-stake').fill('800');assert.equal(await page.locator('#effective-power').innerText(),'3,080');
    await page.locator('#calc-power').fill('-1');assert.equal(await page.locator('#effective-power').innerText(),'—');assert.match(await page.locator('#calc-error').innerText(),/valid/);
    await page.locator('#calc-power').fill('3000');await page.locator('.merge-details summary').click();assert.equal(await page.locator('.merge-row').count(),11);
    await page.setViewportSize({width:320,height:844});
    assert.ok(await page.locator('.merge-row').evaluateAll(rows=>rows.every(row=>row.scrollWidth<=row.clientWidth)));
    await page.setViewportSize({width:390,height:844});
    pass(`${name}: calculator validity and full 10-level merge/cooldown pyramid`);
    await page.locator('#token-1').fill('7');await page.locator('#load-squad').click();await page.waitForFunction(()=>document.querySelector('#squad-total').textContent==='25,426');
    await page.locator('#token-2').fill('7');await page.locator('#load-squad').click();assert.match(await page.locator('#squad-message').innerText(),/different/);
    state.badNft=true;await page.locator('#token-2').fill('42');await page.locator('#token-3').fill('9999');await page.locator('#load-squad').click();await page.waitForFunction(()=>document.querySelector('#squad-message').textContent.includes('unavailable'));assert.equal(await page.locator('#squad-total').innerText(),'24,426');
    pass(`${name}: custom IDs change DPS; duplicates and unavailable tokens recover`);
    await page.locator('#random-squad').click();await page.waitForFunction(()=>!document.querySelector('#random-squad').disabled);
    const ids=await page.locator('.squad-form input').evaluateAll(els=>els.map(el=>Number(el.value)));assert.equal(new Set(ids).size,3);assert.ok(ids.every(id=>id>=1&&id<=9999));
    pass(`${name}: random squad stays unique and within 1–9999`);
    state.offline=true;await page.locator('#refresh').click();await page.waitForFunction(()=>document.querySelector('#feed-tag').textContent.includes('Cached'));assert.notEqual(await page.locator('#work').innerText(),'—');
    await page.reload();await page.waitForFunction(()=>document.querySelector('#feed-tag').textContent.includes('Cached'));assert.notEqual(await page.locator('#squad-total').innerText(),'0');
    pass(`${name}: failed refresh and offline reload retain honest cached data`);
    state.offline=false;await page.locator('#refresh').click();await page.waitForFunction(()=>document.querySelector('#feed-tag').textContent.includes('Live'));
    await page.locator('#language').click();assert.equal(await page.locator('html').getAttribute('lang'),'zh-CN');assert.match(await page.locator('#title').innerText(),/小小爪子/);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=390));
    await page.locator('#language').click();
    await page.locator('#connect').click();assert.ok(await page.locator('#wallet-dialog').isVisible());assert.match(await page.locator('#wallet-options').innerText(),/No browser wallet/);
    await page.keyboard.press('Escape');assert.ok(!(await page.locator('#wallet-dialog').isVisible()));assert.equal(await page.evaluate(()=>document.activeElement.id),'connect');
    pass(`${name}: Chinese switch, no-wallet dialog, Escape and focus return`);
    assert.deepEqual(errors,[]);pass(`${name}: zero JavaScript page errors`);
  } finally {await context.close();}
}
async function walletTests(browser) {
  const {page,context,errors,advance}=await setup(browser,{wallet:true});
  try {
    await page.locator('#connect').click();assert.match(await page.locator('#wallet-options').innerText(),/Test EIP-6963 wallet/);
    await page.locator('[data-wallet]').click();assert.match(await page.locator('#wallet-status').innerText(),/Switch to Sepolia/);assert.ok(await page.locator('[data-tx="ping"]').isDisabled());
    await page.evaluate(()=>{window.__wallet.unknown=true;});await page.locator('#switch-network').click();assert.ok(await page.locator('[data-tx="ping"]').isEnabled());
    const network=await page.evaluate(()=>window.__wallet.calls.filter(c=>c.method==='wallet_addEthereumChain')[0]);assert.equal(network.params[0].chainId,SEPOLIA);assert.equal(network.params[0].nativeCurrency.decimals,18);
    pass('wallet: EIP-6963 discovery, wrong-chain gating, switch/add Sepolia');
    for (const key of ['ping','claim','checkpoint']) {
      await page.locator(`[data-tx="${key}"]`).click();await page.waitForFunction(k=>document.querySelector('#tx-'+k).textContent.includes('confirmed'),key);
      const calls=await page.evaluate(()=>window.__wallet.calls);const sent=calls.filter(c=>c.method==='eth_sendTransaction').at(-1).params[0];const preflight=calls.filter(c=>c.method==='eth_call').at(-1).params[0];
      assert.deepEqual(sent,preflight);assert.equal(sent.to,CONTRACTS[key].address);assert.equal(sent.data,CONTRACTS[key].data);assert.equal(sent.value,'0x0');assert.equal(sent.from,OWNER);
      assert.match(await page.locator(`#tx-${key} a`).getAttribute('href'),/^https:\/\/sepolia.etherscan.io\/tx\/0x/);
    }
    assert.match(await page.locator('#loot-badges').innerText(),/Sepolia tester/);
    pass('wallet: all three exact preflight/send payloads, receipts, explorer links and confirmed Tester badge');
    await page.evaluate(()=>{window.__wallet.reject=true;});await page.locator('[data-tx="claim"]').click();await page.waitForFunction(()=>document.querySelector('#tx-claim').textContent.includes('cancelled'));assert.ok(await page.locator('[data-tx="claim"]').isEnabled());
    await page.evaluate(()=>{window.__wallet.reject=false;window.__wallet.failCall=true;});const before=await page.evaluate(()=>window.__wallet.calls.filter(c=>c.method==='eth_sendTransaction').length);await page.locator('[data-tx="claim"]').click();await page.waitForFunction(()=>document.querySelector('#tx-claim').textContent.includes('Simulation failed'));assert.equal(await page.evaluate(()=>window.__wallet.calls.filter(c=>c.method==='eth_sendTransaction').length),before);
    await page.evaluate(()=>{window.__wallet.failCall=false;window.__wallet.revert=true;});await page.locator('[data-tx="claim"]').click();await page.waitForFunction(()=>document.querySelector('#tx-claim').textContent.includes('reverted'));
    pass('wallet: rejection is recoverable; preflight failure never sends; reverted receipt is explicit');
    await page.evaluate(()=>{window.__wallet.revert=false;window.__wallet.pending=true;});await page.locator('[data-tx="checkpoint"]').click();await page.waitForFunction(()=>document.querySelector('#tx-checkpoint').textContent.includes('Submitted'));assert.ok(await page.locator('[data-tx="checkpoint"]').isDisabled());
    await page.evaluate(()=>{window.__wallet.pending=false;});await advance(5100);await page.waitForFunction(()=>document.querySelector('#tx-checkpoint').textContent.includes('confirmed'));
    await page.evaluate(()=>{window.__wallet.chain='0x1';window.__emit('chainChanged','0x1');});assert.ok(await page.locator('[data-tx="ping"]').isDisabled());await page.locator('#switch-network').click();assert.ok(await page.locator('[data-tx="ping"]').isEnabled());
    await page.evaluate(()=>window.__emit('accountsChanged',[]));assert.ok(await page.locator('[data-tx="ping"]').isDisabled());
    pass('wallet: pending receipt, chain-change and account-change gating');
    assert.deepEqual(errors,[]);pass('wallet: zero JavaScript errors (mock wallet; no actual transaction broadcast)');
  } finally {await context.close();}
}
async function liveEventTests(browser) {
  const {page,context,state,advance,errors}=await setup(browser);
  try {
    await page.locator('[data-stance="surge"]').click();await page.locator('#lock-stance').click();
    state.settled++;state.height++;state.work+=10;
    await page.locator('#refresh').click();await page.waitForFunction(()=>document.querySelector('#combat-log').textContent.includes('Prediction landed'));
    assert.equal(await page.locator('#raid-points').innerText(),'100 RP');
    await page.locator('#refresh').click();await page.waitForFunction(()=>!document.querySelector('#refresh').disabled);assert.equal(await page.locator('#raid-points').innerText(),'100 RP');
    await advance(600000);assert.ok(await page.locator('#lock-stance').isEnabled());
    await page.locator('#refresh').click();await page.waitForFunction(()=>!document.querySelector('#refresh').disabled);
    await page.locator('[data-stance="surge"]').click();await page.locator('#lock-stance').click();state.settled++;
    await page.locator('#refresh').click();await page.waitForFunction(()=>document.querySelector('#combat-log').textContent.includes('no new blocks'));
    assert.equal(await page.locator('#raid-points').innerText(),'100 RP');
    pass('live events: prediction wins once, no-block batches lose, next round unlocks');
    await advance(600000);await page.locator('#refresh').click();await page.waitForFunction(()=>!document.querySelector('#refresh').disabled);
    await page.locator('[data-stance="overclock"]').click();await page.locator('#lock-stance').click();await page.locator('#start-raid').click();
    const idleDps=Number((await page.locator('#dps').innerText()).replace(' DPS',''));
    state.spinning=true;state.work+=30;state.settled++;
    await advance(12000);await page.waitForFunction(()=>document.querySelector('#rpm').textContent==='60');
    assert.ok(Number((await page.locator('#dps').innerText()).replace(' DPS',''))>idleDps);
    assert.ok((await page.locator('#hardware-wheel').getAttribute('class')).includes('spinning'));
    assert.match(await page.locator('#combat-log').innerText(),/Overclock bonus/);
    assert.ok(Number((await page.locator('#damage-done').innerText()).replaceAll(',',''))>0);
    pass('live events: 12s auto-refresh, spinning multiplier, new-work damage and Overclock settlement bonus');
    await page.locator('#pause-raid').click();await page.locator('#token-1').fill('7');await page.locator('#load-squad').click();await page.waitForFunction(()=>document.querySelector('#squad-total').textContent==='25,426');
    state.spinning=false;await page.locator('#refresh').click();await page.waitForFunction(()=>!document.querySelector('#refresh').disabled);
    await page.locator('[data-boss="0"]').click();await page.locator('#start-raid').click();
    for(let i=0;i<25;i++){if(await page.locator('#victory').isVisible())break;await advance(210);await page.locator('#start-raid').click();}
    assert.ok(await page.locator('#victory').isVisible());assert.match(await page.locator('#loot-badges').innerText(),/Golem breaker/);
    const oldXP=Number((await page.locator('#xp').innerText()).replaceAll(',',''));assert.ok(oldXP>=250);
    await page.locator('#start-raid').click();assert.ok(!(await page.locator('#victory').isVisible()));assert.ok(await page.locator('#boost').isEnabled());
    await page.locator('[data-boss="1"]').click();await page.locator('#start-raid').click();
    for(let i=0;i<30;i++){if(await page.locator('#victory').isVisible())break;await advance(210);await page.locator('#start-raid').click();}
    assert.ok(await page.locator('#victory').isVisible());assert.match(await page.locator('#loot-badges').innerText(),/Night watcher/);assert.notEqual(await page.locator('#rank').innerText(),'Wheel recruit');
    pass('live events: boss victory, +250 XP, distinct loot badges, replay and rank progression');
    assert.deepEqual(errors,[]);
  }finally{await context.close();}
  const cold=await setup(browser,{offline:true});
  try{
    assert.match(await cold.page.locator('#feed-tag').innerText(),/unavailable/);assert.equal(await cold.page.locator('#work').innerText(),'—');
    await cold.page.locator('#start-raid').click();await cold.advance(1000);await cold.page.locator('#start-raid').click();assert.ok(Number(await cold.page.locator('#xp').innerText())>0);assert.deepEqual(cold.errors,[]);
    pass('offline: first visit without a cache is playable and invents no telemetry');
  }finally{await cold.context.close();}
}
try {
  const chromium=await pw.chromium.launch();try{await check(chromium,'Chromium');await walletTests(chromium);await liveEventTests(chromium);}finally{await chromium.close();}
  try {const webkit=await pw.webkit.launch();try{await check(webkit,'WebKit');}finally{await webkit.close();}}catch(error){if(String(error).includes('Host system')||String(error).includes('shared libraries')||String(error).includes('Executable doesn'))console.log('LIMITATION WebKit could not launch: '+String(error).slice(0,1000));else throw error;}
  console.log(`Browser validation finished: ${count} assertion groups passed.`);
} finally {await new Promise(r=>server.close(r));}
