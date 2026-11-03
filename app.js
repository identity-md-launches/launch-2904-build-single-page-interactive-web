// @ts-check
/** Squeek Raid has no runtime dependencies. API responses are data, never executable markup. */
export const API = 'https://api.squeekchain.com/v1';
export const SEPOLIA = '0xaa36a7';
export const CONTRACTS = Object.freeze({
  ping: { address: '0x5501e1fa81be1c3f49225fa7668da0245d07db60', data: '0x095ea7b30000000000000000000000004b67b739dfd832f4eac67a7aa3bc244fb74cea4f0000000000000000000000000000000000000000000000000000000000000000' },
  claim: { address: '0x1ff6485abfbb2d183cd673d78e1ab31c098e04dd', data: '0x379607f50000000000000000000000000000000000000000000000000000000000000001' },
  checkpoint: { address: '0xcd46990f8349057335289ef282c276204b6cdc62', data: '0xc2c4c5c1' }
});
export const BOSSES = [
  { key: 'golem', sprite: 'golem.svg', hp: 12000, badge: 'golemLoot' },
  { key: 'leviathan', sprite: 'leviathan.svg', hp: 16000, badge: 'leviathanLoot' },
  { key: 'dragon', sprite: 'dragon.svg', hp: 20000, badge: 'dragonLoot' }
];
/** @param {number} p @param {number} s @param {number} [c] */
export function effectivePower(p, s, c = 40) {
  if (![p, s, c].every(Number.isFinite) || p < 0 || s < 0 || c <= 0) return null;
  return p + s * (1 + p / 1000) / c;
}
/** @param {unknown} value */
export function finite(value) { const n = Number(value); return Number.isFinite(n) ? n : 0; }
/** @param {number} value @param {number} min @param {number} max */
export function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }
/** @param {unknown} id */
export function validTokenId(id) { return /^\d+$/.test(String(id)) && Number(id) >= 1 && Number(id) <= 9999; }
/** @param {string} value */
export function baseUnits(value) {
  try { const n = BigInt(value); return Number(n / 10n ** 14n) / 1e4; } catch { return 0; }
}
/** @param {number} power @param {number} speed @param {number} rpm @param {string} stance @param {boolean} workBonus */
export function damagePerSecond(power, speed, rpm, stance, workBonus = false) {
  const base = 12 + Math.max(0, power) / 100;
  const live = 1 + clamp(speed / 1000, 0, 1);
  const stanceBuff = stance === 'overclock' && (rpm > 0 || workBonus) ? 1.5 : 1;
  return base * live * stanceBuff;
}
/** @param {number} maxHP @param {number} hp @param {number} work @param {number} work24 @param {number} speed */
export function shieldPhase(maxHP, hp, work, work24, speed) {
  if (hp <= maxHP * .25) return { key: 'enraged', absorb: 0 };
  if (speed > 25 || Math.floor(work / 20 + work24 / 100) % 2 === 1) return { key: 'exposed', absorb: 0 };
  return { key: 'armored', absorb: .3 };
}
/** @param {number} now */
export function roundCountdown(now) { return 600 - Math.floor((now / 1000) % 600); }
/** @param {string} s */
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));

const ZH = {
  burstDirection:'在金色区域加速。也可按空格键。',
  skip:'跳到战场',by:'由 Squeekchain 驱动',navArena:'战场',navSquad:'小队',navTelemetry:'遥测',navTerminal:'终端 ↗',connect:'连接钱包',title:'小小爪子。<span>超强伤害。</span>',subtitle:'由真实仓鼠硬件驱动的 Squeekchain 首领战。',raidXp:'战斗经验',savedLocally:'· 本地保存',bossRaid:'首领战场',localSimulation:'本地模拟',golem:'噬块魔像',leviathan:'慵懒利维坦',dragon:'延迟巨龙',armored:'护甲阶段 · 吸收 30% 伤害',exposed:'破防阶段 · 全额伤害',enraged:'狂暴阶段 · 全额伤害',squadPower:'小队战力',damageDone:'已造成伤害',liveBonus:'实时转轮加成',enterRaid:'进入战斗',readyFight:'小队已就绪。选择战术，开始战斗。',pauseMotion:'暂停动画',resumeMotion:'恢复动画',bossDefeated:'首领已击败！',victoryLoot:'+250 战斗经验 · 获得地牢徽章',wheelLive:'实时仓鼠转轮',connecting:'正在连接',awaitingTelemetry:'等待遥测数据',idleNote:'英雄也需要小睡。',wheelRpm:'转轮转速',speed:'速度',distance:'距离',totalWork:'累计工作量',squeekBlock:'Squeek 区块',toNextBlock:'距离下一区块',proofPending:'等待硬件证明',proofExplanation:'签名验证结果由 Squeekchain API 提供。',signer:'签名器',keySlot:'密钥槽',driver:'驱动',signature:'最新签名',settledRound:'已结算轮次',workThousand:'每千区块工作量',refresh12:'每 12 秒刷新',tacticalStance:'选择你的战术姿态',stanceHint:'每个 10 分钟 SqueekCore 轮次可锁定一种战术。',overclock:'转轮超频',overclockDesc:'转轮旋转或结算新增工作量时，伤害提升至 1.5 倍。',spinningBonus:'旋转加成',bastion:'守夜堡垒',bastionDesc:'稳定获取战斗积分。仓鼠休息时积蓄反击能量。',idleAdvantage:'休息优势',surge:'破块突袭',surgeDesc:'预测下次结算是否完成至少一个新区块。',predictionBonus:'预测加成',stancePreview:'已选择守夜堡垒。锁定后可获得本轮奖励。',lockStance:'锁定战术',combatSimulator:'实时战斗与转轮爆发',burstHint:'进入战斗后，在节拍中心加速可获得额外伤害。快捷键：空格。',wheelBurst:'转轮爆发',seedStrike:'种子打击',counterAttack:'反击',counterCharge:'反击充能',localOnly:'战斗、经验与战利品仅保存在此浏览器。加速不会改变真实硬件或链上余额。',combatLog:'战斗日志',loot:'战利品',noLoot:'击败首领可获得徽章。',yourSquad:'组建仓鼠突袭小队',squadHint:'真实链上 Squeek。可输入 1 至 9999 的任意代币编号。',randomSquad:'随机召唤小队',slot1:'小队位置 1',slot2:'小队位置 2',slot3:'小队位置 3',loadSquad:'载入小队',squadTotal:'总基础战力',squadBuff:'每 100 点战力增加 1 点基础秒伤。',wheelWork:'链上转轮工作量',last24:'最近 24 小时',workAdded:'新增工作量',blocksCompleted:'已完成区块',settlements:'结算次数',awaitingChart:'等待结算历史。',hourlyWork:'每小时工作量 · UTC',viewChartData:'查看图表数据',recentSettlements:'最近结算',awaitingSettlement:'等待结算 API。你可以先进入战斗。',mergeStaking:'合成与质押战力',sqkSupply:'SQK 已铸造总量',stakedPower:'已质押 NFT 战力',nftBasePower:'NFT 基础战力 (P)',sqkStake:'质押 SQK (S)',effectivePower:'有效战力',mergePyramid:'查看 10 级合成金字塔',mergeHint:'两只同级 Squeek 可合成下一级。此处仅计算，不会转移 NFT。',testerTerminal:'Sepolia 测试终端',realTransactions:'真实测试网交易',terminalHint:'探索真实 Squeekchain 合约。每个操作都需要在钱包中确认。',switchSepolia:'切换到 Sepolia',gasNote:'合约转账金额为 0 ETH。仍需 Sepolia ETH 支付 gas。这些操作不会花费 SQK 或合成小队。',walletPrompt:'连接浏览器钱包以启用终端。',pingTitle:'测试 SQK 代币',pingDesc:'将质押授权额度设为零。交易确认后解锁测试员徽章。',contractDetails:'合约详情',spender:'被授权方（质押合约）',pingButton:'授权 0 SQK',notConnected:'钱包未连接',claimTitle:'免费领取测试 Squeek',claimDesc:'从官方分发器申请一只测试 NFT。需符合合约领取条件。',claimButton:'领取 1 只 Squeek · 0 ETH',checkpointTitle:'触发挖矿检查点',checkpointDesc:'请求挖矿代理处理符合条件的轮次并更新奖励。',checkpointButton:'触发检查点',preflight:'每笔交易发送前均使用 eth_call 模拟。',disconnect:'断开钱包',footerCopy:'真实仓鼠驱动，由你来战斗。',dataSource:'实时数据来源 ↗',backTop:'回到顶部 ↑',connectWallet:'连接钱包',walletDialogHint:'连接 Sepolia 网络。不连接钱包也可以战斗。',
  wheelRecruit:'转轮新兵',seedScout:'种子侦察兵',dungeonKeeper:'地牢守卫',wheelChampion:'转轮冠军',hamsterLegend:'仓鼠传奇',spinning:'正在奔跑',idle:'正在休息',spinningNote:'每一次转动都为战斗注入能量。',offline:'遥测不可用',cached:'缓存数据',live:'实时在线',verified:'硬件仓鼠证明已验证 · Infineon Trust-M',proofUnverified:'硬件证明未确认',freshAt:'更新于 {time} · 每 12 秒刷新',cachedAt:'缓存于 {time} · 正在重试',noFeed:'实时数据不可用 · 12 秒后重试',round:'第 {n} 轮',localRound:'本地练习轮次',nextRound:'API 轮次估计',pauseRaid:'暂停战斗',resumeRaid:'继续战斗',fightAgain:'再次挑战',raidRunning:'战斗进行中。转轮爆发已就绪。',raidPaused:'战斗已暂停。你的进度仍在。',victoryState:'首领已击败。再次挑战或选择另一位首领。',raidStarted:'小队进入了地牢。',raidResumed:'小队回到了战场。',raidPausedLog:'战斗暂停。',bossSelected:'已选择：{boss}。',boostLog:'转轮爆发造成 {n} 点伤害。',perfectLog:'完美节拍！造成 {n} 点伤害。',strikeLog:'种子打击造成 {n} 点伤害。',counterLog:'反击造成 {n} 点伤害。',defeatedLog:'击败了{boss}！+250 经验。',golemLoot:'魔像破坏者',leviathanLoot:'守夜者',dragonLoot:'延迟猎手',testerLoot:'Sepolia 测试员',welcomeLog:'地牢已准备就绪。进入战斗即可开始。',stanceSelected:'已选择{stance}。锁定以获取本轮奖励。',stanceLocked:'{stance}已锁定本轮。',stanceLockedLog:'已锁定：{stance}。',locked:'已锁定',lockFirst:'先锁定战术以获取轮次奖励。',stanceWait:'本轮战术已锁定。下轮可重新选择。',surgeWin:'预测成功：新增区块！+100 战斗积分。',surgeMiss:'结算完成，没有新增区块。下轮再试。',overclockWin:'结算新增工作量：超频加成已激活。',workHit:'实时硬件新增工作量：造成 {n} 点伤害。',newRound:'新轮次开始。可选择新的战术。',power:'战力',level:'等级',ready:'可合成',burned:'已销毁',owner:'持有者',traits:'属性与持有者',metadataLoading:'正在读取链上数据…',nftUnavailable:'此 Squeek 不可用。请尝试其他编号。',loadingSquad:'正在载入小队…',squadLoaded:'已载入 {n}/3 只链上 Squeek。',squadError:'部分 Squeek 暂不可用。已保留可用成员，请重试。',duplicateSquad:'请选择三个不同的代币编号。',invalidSquad:'请输入 1 至 9999 的整数。',calcInvalid:'请输入有效的非负数值。',unavailable:'未提供',cooldown:'冷却区块',basePower:'基础战力',mergeLevel:'等级',chartHour:'小时 (UTC)',chartWork:'工作量',settlementRound:'轮次 {n}',newBlocks:'{n} 个新区块',noSettlements:'最近没有结算记录。',waitingSettlement:'等待结算数据。',walletUnavailable:'未检测到浏览器钱包。请安装 EVM 钱包或在钱包应用中打开本页面。',browserWallet:'浏览器钱包',connectPending:'请在钱包中确认连接。',walletRejected:'已取消连接。可以重新尝试。',walletError:'无法连接钱包，请重试。',wrongChain:'请先切换到 Sepolia 再使用终端。',connected:'已连接 Sepolia：{address}',switchFirst:'切换到 Sepolia',checking:'正在模拟合约调用…',awaitingWallet:'等待钱包确认…',txSubmitted:'交易已提交。等待回执…',txConfirmed:'交易已确认。',txReverted:'交易执行失败。你可以查看链上详情。',txRejected:'已取消交易。未提交任何交易。',txError:'无法完成交易。请查看钱包中的详情后重试。',preflightFailed:'模拟失败。请检查领取资格或 Sepolia gas 余额后重试。',receiptPending:'交易仍待确认。点击链接查看或重新检查。',checkReceipt:'检查回执',viewTx:'在 Etherscan 查看交易',readyTx:'已就绪 · Sepolia',networkPending:'正在请求切换网络…',networkError:'无法切换网络。请在钱包中选择 Sepolia 后重试。',readOnly:'浏览器钱包在此直接连接。不需要中继或项目 ID。',mobileOpen:'也可在钱包应用内打开：',storageUnavailable:'浏览器存储不可用。本次游戏可继续，但进度不会保存。',changeWallet:'钱包账户已变更。',contractRevert:'合约调用被拒绝：{message}'
};
const EN = {
  burstDirection:'Boost in the gold zone. Space works too.',
  exposed:'Exposed · full damage',enraged:'Enraged · full damage',
  wheelRecruit:'Wheel recruit',seedScout:'Seed scout',dungeonKeeper:'Dungeon keeper',wheelChampion:'Wheel champion',hamsterLegend:'Hamster legend',spinning:'Spinning',idle:'Resting · idle',spinningNote:'Every revolution feeds the raid.',offline:'Telemetry unavailable',cached:'Cached data',live:'Live feed',verified:'Hardware Proof-of-Hamster Verified · Infineon Trust-M',proofUnverified:'Hardware proof not confirmed',freshAt:'Updated {time} · refreshes every 12s',cachedAt:'Cached {time} · retrying',noFeed:'Live feed unavailable · retrying in 12s',round:'Round #{n}',localRound:'Local practice round',nextRound:'API round estimate',pauseRaid:'Pause raid',resumeRaid:'Resume raid',fightAgain:'Fight again',raidRunning:'Raid in progress. Wheel burst is ready.',raidPaused:'Raid paused. Your progress is safe.',victoryState:'Boss defeated. Fight again or choose another boss.',raidStarted:'Your squad entered the dungeon.',raidResumed:'Your squad returned to the fight.',raidPausedLog:'Raid paused.',bossSelected:'Selected {boss}.',boostLog:'Wheel burst dealt {n} damage.',perfectLog:'Perfect beat! Dealt {n} damage.',strikeLog:'Seed strike dealt {n} damage.',counterLog:'Counter-attack dealt {n} damage.',defeatedLog:'Defeated {boss}! +250 XP.',golemLoot:'Golem breaker',leviathanLoot:'Night watcher',dragonLoot:'Latency slayer',testerLoot:'Sepolia tester',welcomeLog:'The dungeon is ready. Enter the raid to begin.',stanceSelected:'{stance} selected. Lock it for round rewards.',stanceLocked:'{stance} locked for this round.',stanceLockedLog:'Locked {stance}.',locked:'Stance locked',lockFirst:'Lock a stance to earn round rewards.',stanceWait:'Stance locked. Choose again next round.',surgeWin:'Prediction landed: new blocks! +100 Raid Points.',surgeMiss:'Batch settled with no new blocks. Try next round.',overclockWin:'Settlement added work. Overclock bonus activated.',workHit:'Live hardware work dealt {n} damage.',newRound:'A new round begins. Choose a fresh stance.',power:'power',level:'Level',ready:'Merge ready',burned:'Burned',owner:'Owner',traits:'Traits & owner',metadataLoading:'Reading on-chain data…',nftUnavailable:'This Squeek is unavailable. Try another ID.',loadingSquad:'Loading squad…',squadLoaded:'Loaded {n}/3 on-chain Squeeks.',squadError:'Some Squeeks are unavailable. Available members are kept; try again.',duplicateSquad:'Choose three different token IDs.',invalidSquad:'Enter whole token IDs from 1 to 9999.',calcInvalid:'Enter valid, non-negative numbers within the shown limits.',unavailable:'Not provided',cooldown:'Cooldown blocks',basePower:'Base power',mergeLevel:'Level',chartHour:'Hour (UTC)',chartWork:'Work',settlementRound:'Round {n}',newBlocks:'{n} new blocks',noSettlements:'No recent settlements.',waitingSettlement:'Waiting for settlement data.',walletUnavailable:'No browser wallet detected. Install an EVM wallet or open this page in a wallet app.',browserWallet:'Browser wallet',connectPending:'Confirm the connection in your wallet.',walletRejected:'Connection cancelled. You can try again.',walletError:'Unable to connect the wallet. Please try again.',wrongChain:'Switch to Sepolia to use the terminal.',connected:'Connected to Sepolia: {address}',switchFirst:'Switch to Sepolia',checking:'Simulating the contract call…',awaitingWallet:'Waiting for wallet approval…',txSubmitted:'Submitted. Waiting for a receipt…',txConfirmed:'Transaction confirmed.',txReverted:'Transaction reverted. View the on-chain details.',txRejected:'Transaction cancelled. Nothing was submitted.',txError:'Unable to complete the transaction. Check your wallet details and try again.',preflightFailed:'Simulation failed. Check eligibility or your Sepolia gas balance, then retry.',receiptPending:'Still pending. Follow the link or check the receipt again.',checkReceipt:'Check receipt',viewTx:'View transaction on Etherscan',readyTx:'Ready · Sepolia',networkPending:'Requesting network change…',networkError:'Unable to switch. Select Sepolia in your wallet and try again.',readOnly:'Browser wallets connect directly. No relay or project ID required.',mobileOpen:'Or open this page inside a wallet:',storageUnavailable:'Browser storage is unavailable. You can play, but progress will not persist.',changeWallet:'Wallet account changed.',contractRevert:'Contract call rejected: {message}'
};

if (typeof document !== 'undefined') init();
function init() {
  /** @returns {any} */
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const staticEnglish = {};
  $$('[data-i18n]').forEach(el => { staticEnglish[el.dataset.i18n] = el.innerHTML; });
  let storageOK = true;
  try { localStorage.setItem('squeek:storage-probe','1'); localStorage.removeItem('squeek:storage-probe'); } catch { storageOK = false; }
  const readStore = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
  const writeStore = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch { storageOK = false; } };
  let lang = readStore('squeek:lang', 'en') === 'zh' ? 'zh' : 'en';
  const t = (key, vars = {}) => {
    const source = (lang === 'zh' ? ZH[key] : null) ?? EN[key] ?? staticEnglish[key] ?? key;
    return String(source).replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
  };
  const fmt = (n, digits = 0) => finite(n).toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US', { maximumFractionDigits: digits });
  const text = (selector, value) => { $(selector).textContent = String(value); };
  const icon = id => `<svg class="icon" aria-hidden="true"><use href="#i-${id}"/></svg>`;
  const shortAddress = a => `${a.slice(0, 6)}…${a.slice(-4)}`;
  const saved = readStore('squeek:player:v1', {});
  let xp = Math.max(0, finite(saved.xp));
  let points = Math.max(0, finite(saved.points));
  let badges = Array.isArray(saved.badges) ? saved.badges.filter(b => ['golemLoot','leviathanLoot','dragonLoot','testerLoot'].includes(b)) : [];
  let stance = ['overclock','bastion','surge'].includes(saved.stance) ? saved.stance : 'bastion';
  let stanceLock = saved.stanceLock && typeof saved.stanceLock.round === 'string' ? saved.stanceLock : null;
  let bossIndex = 0, maxHP = BOSSES[0].hp, hp = maxHP, damageDone = 0, running = false, entered = false;
  let squadPower = 0, counter = 0, lastBoost = 0, lastSkill = 0, lastTick = performance.now(), lastSecond = Date.now();
  let workBonusUntil = 0, beat = 0, logs = [], motionPaused = false;
  let data = { status: null, settlements: null, economy: null };
  let health = {}, squad = [], squadLoading = false, squadVersion = 0, refreshBusy = false;
  let roundAnchor = null, lastRoundKey = '', lastWork = null, lastCounterEpoch = null;
  /** @type {any} */ let provider = null;
  let account = '', chainId = '', walletBusy = false, txBusy = false;
  const providers = new Map();
  const txs = readStore('squeek:tx:v1', {});
  const pendingTimers = new Map();
  const persist = () => writeStore('squeek:player:v1', { xp, points, badges, stance, stanceLock });
  const currentRound = () => {
    const boundary = Math.floor(Date.now() / 600000);
    if (!roundAnchor) return { key: `local-${boundary}`, label: t('localRound') };
    const round = roundAnchor.round + Math.max(0, boundary - roundAnchor.boundary);
    return { key: `chain-${round}`, label: t('round', { n: round }) };
  };
  const lockedNow = () => stanceLock?.round === currentRound().key;
  const currentStance = () => lockedNow() ? stanceLock.stance : stance;
  function log(key, vars = {}) {
    logs.unshift({ key, vars, at: new Date() });
    logs = logs.slice(0, 35);
    renderLog();
    text('#combat-announcement', t(key, vars));
  }
  function renderLog() {
    $('#combat-log').innerHTML = logs.map(l => `<li><time>${l.at.toLocaleTimeString('en-GB',{hour12:false})}</time><span>${esc(t(l.key,l.vars))}</span></li>`).join('');
  }
  function addXP(n) { xp += n; persist(); renderPlayer(); }
  function addBadge(key) { if (!badges.includes(key)) badges.push(key); persist(); renderPlayer(); }
  function renderPlayer() {
    const ranks = ['wheelRecruit','seedScout','dungeonKeeper','wheelChampion','hamsterLegend'];
    text('#rank', t(ranks[Math.min(4, Math.floor(xp / 500))]));
    text('#xp', fmt(xp)); $('#xp-fill').style.width = `${xp % 500 / 5}%`;
    text('#raid-points', `${fmt(points)} RP`);
    $('#loot-badges').innerHTML = badges.length ? badges.map(b => `<span class="loot-badge">${esc(t(b))}</span>`).join('') : `<span class="muted">${esc(t('noLoot'))}</span>`;
  }
  function phase() {
    return shieldPhase(maxHP, hp, finite(data.status?.measurement?.cumulativeWorkUnits), finite(data.settlements?.summary?.workAdded), liveStatus() ? finite(data.status?.measurement?.speedMmPerSecond) : 0);
  }
  function liveStatus() { return !!data.status && !health.status?.stale && Date.now() - Date.parse(data.status.measurement?.observedAt || data.status.generatedAt) < finite(data.status.measurement?.staleAfterSeconds || 120) * 1000; }
  function dps() {
    const m = liveStatus() ? data.status.measurement : {};
    return damagePerSecond(squadPower, finite(m.speedMmPerSecond), finite(m.rpmMilli), currentStance(), workBonusUntil > Date.now());
  }
  function renderCombat() {
    text('#boss-name', t(BOSSES[bossIndex].key));
    text('#boss-hp', `${fmt(Math.ceil(hp))} / ${fmt(maxHP)}`);
    $('#health-fill').style.width = `${hp / maxHP * 100}%`;
    $('#hp-progress').setAttribute('aria-valuenow', String(Math.round(hp / maxHP * 100)));
    text('#boss-phase', t(phase().key));
    text('#damage-done', fmt(Math.floor(damageDone)));
    text('#arena-power', fmt(squadPower));
    const speed = liveStatus() ? finite(data.status.measurement.speedMmPerSecond) : 0;
    text('#wheel-bonus', `×${(1 + clamp(speed / 1000, 0, 1)).toFixed(2)}`);
    text('#dps', `${fmt(running ? dps() * (1 - phase().absorb) : 0, 1)} DPS`);
    $('#counter-fill').style.width = `${counter}%`; text('#counter-value', `${Math.floor(counter)}%`);
    $('#start-raid span:first-of-type').textContent = t(hp <= 0 ? 'fightAgain' : running ? 'wheelBurst' : entered ? 'resumeRaid' : 'enterRaid');
    $('#start-raid use').setAttribute('href',running ? '#i-wheel' : '#i-swords');
    text('#game-state', t(hp <= 0 ? 'victoryState' : running ? 'burstDirection' : entered ? 'raidPaused' : 'readyFight'));
    $('#pause-raid').hidden = !running; $('#arena-beat').hidden = !running;
    $('#boost').disabled = !running; $('#skill').disabled = !running || Date.now() - lastSkill < 8000; $('#counter').disabled = !running || counter < 100;
    const remaining = Math.max(0, Math.ceil((8000 - (Date.now() - lastSkill)) / 1000));
    text('#skill-label', `${t('seedStrike')}${remaining ? ` (${remaining}s)` : ''}`);
    $('#victory').hidden = hp > 0;
  }
  function hit(raw, show = false) {
    if (!running || hp <= 0) return 0;
    const dealt = Math.min(hp, Math.max(0, Math.round(raw * (1 - phase().absorb))));
    hp -= dealt; damageDone += dealt;
    if (show) {
      text('#damage-number', `−${fmt(dealt)}`);
      $('#damage-number').classList.remove('hit'); $('#boss-sprite').classList.remove('hit');
      void $('#damage-number').offsetWidth;
      $('#damage-number').classList.add('hit'); $('#boss-sprite').classList.add('hit');
      setTimeout(() => { text('#damage-number',''); $('#boss-sprite').classList.remove('hit'); }, 620);
    }
    if (hp <= 0) {
      hp = 0; running = false; addXP(250); addBadge(BOSSES[bossIndex].badge);
      log('defeatedLog',{boss:t(BOSSES[bossIndex].key)});
    }
    renderCombat(); return dealt;
  }
  function selectBoss(index) {
    running = false; entered = false; bossIndex = index; hp = maxHP = BOSSES[index].hp; damageDone = 0; counter = 0;
    $('#boss-sprite').src = `./assets/${BOSSES[index].sprite}`;
    $$('[data-boss]').forEach(el => { const active = Number(el.dataset.boss) === index; el.classList.toggle('selected',active); el.setAttribute('aria-pressed',String(active)); });
    text('#encounter', `0${index + 1} / 03`); renderCombat(); log('bossSelected',{boss:t(BOSSES[index].key)});
  }
  $('#start-raid').addEventListener('click', () => {
    if (running) { boost(); return; }
    if (hp <= 0) { hp = maxHP; damageDone = 0; counter = 0; entered = false; }
    running = !running;
    log(running ? entered ? 'raidResumed' : 'raidStarted' : 'raidPausedLog');
    entered = true; lastTick = performance.now(); renderCombat();
  });
  $('#pause-raid').addEventListener('click', () => { running = false; log('raidPausedLog'); renderCombat(); });
  $$('[data-boss]').forEach(el => el.addEventListener('click', () => selectBoss(Number(el.dataset.boss))));
  function boost() {
    const now = Date.now();
    if (!running || now - lastBoost < 180) return;
    lastBoost = now;
    const perfect = beat >= .43 && beat <= .57;
    const dealt = hit(dps() * (perfect ? 3 : 1.2), true);
    addXP(perfect ? 5 : 1); counter = Math.min(100, counter + (perfect ? 8 : 3));
    log(perfect ? 'perfectLog' : 'boostLog',{n:fmt(dealt)}); renderCombat();
  }
  $('#boost').addEventListener('click', boost);
  document.addEventListener('keydown', e => {
    const target = /** @type {HTMLElement} */ (e.target);
    if (e.code === 'Space' && !e.repeat && running && !/INPUT|BUTTON|TEXTAREA|SELECT|SUMMARY|A/.test(target.tagName) && !target.isContentEditable && !$('#wallet-dialog').open) { e.preventDefault(); boost(); }
  });
  $('#skill').addEventListener('click', () => {
    if (!running || Date.now() - lastSkill < 8000) return;
    lastSkill = Date.now(); const n = hit(dps() * 12, true); addXP(8); log('strikeLog',{n:fmt(n)}); renderCombat();
  });
  $('#counter').addEventListener('click', () => {
    if (!running || counter < 100) return;
    counter = 0; const n = hit(dps() * 20, true); addXP(15); log('counterLog',{n:fmt(n)}); renderCombat();
  });
  function renderStance() {
    const locked = lockedNow();
    $$('[data-stance]').forEach(el => { const active = el.dataset.stance === currentStance(); el.classList.toggle('selected',active); el.setAttribute('aria-pressed',String(active)); el.disabled = locked; });
    $('#lock-stance').disabled = locked;
    $('#lock-stance span').textContent = t(locked ? 'locked' : 'lockStance');
    text('#stance-status', t(locked ? 'stanceLocked' : 'stanceSelected',{stance:t(currentStance())}));
    text('#round-label', currentRound().label);
  }
  $$('[data-stance]').forEach(el => el.addEventListener('click', () => { if (lockedNow()) return; stance = el.dataset.stance; persist(); renderStance(); renderCombat(); }));
  $('#lock-stance').addEventListener('click', () => {
    if (lockedNow()) return;
    stanceLock = { round: currentRound().key, stance, roundAtLock: finite(data.status?.builder?.anchor?.settledThroughRound), heightAtLock:finite(data.status?.builder?.anchor?.blockHeight), workAtLock:finite(data.status?.builder?.anchor?.cumulativeWork), hasAnchor:!!data.status?.builder?.anchor, lockedAt:Date.now(), resolved:false };
    persist(); renderStance(); log('stanceLockedLog',{stance:t(stance)});
  });
  const mediaMotion = matchMedia('(prefers-reduced-motion: reduce)');
  $('#motion-toggle').addEventListener('click', () => {
    motionPaused = !motionPaused; document.body.classList.toggle('motion-paused',motionPaused);
    $('#motion-toggle').setAttribute('aria-pressed',String(motionPaused)); text('#motion-toggle',t(motionPaused ? 'resumeMotion' : 'pauseMotion'));
  });
  function tick() {
    const now = performance.now(); const dt = Math.min((now - lastTick) / 1000, 1.25); lastTick = now;
    if (running && !document.hidden) {
      hit(dps() * dt);
      const idle = liveStatus() && data.status.measurement.coreStatus === 'IDLE';
      if (lockedNow() && currentStance() === 'bastion') {
        counter = clamp(counter + dt * (idle ? 5 : 1),0,100);
        if (Date.now() - lastSecond >= 1000) { points += idle ? 3 : 1; lastSecond = Date.now(); persist(); renderPlayer(); }
      }
    }
    const seconds = roundCountdown(Date.now()); text('#round-timer',`${String(Math.floor(seconds / 60)).padStart(2,'0')}:${String(seconds % 60).padStart(2,'0')}`);
    const key = currentRound().key;
    if (lastRoundKey && lastRoundKey !== key) { log('newRound'); renderStance(); }
    lastRoundKey = key; renderCombat();
  }
  setInterval(tick,250);
  function animate(now) {
    if (running && !document.hidden && !mediaMotion.matches && !motionPaused) { beat = (now % 1500) / 1500; $('#rhythm-needle').style.left = $('#arena-needle').style.left = `${beat * 100}%`; }
    else if (mediaMotion.matches || motionPaused) { beat = .5; $('#rhythm-needle').style.left = $('#arena-needle').style.left = '50%'; }
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
  document.addEventListener('visibilitychange', () => { lastTick = performance.now(); if (!document.hidden) refresh(); });

  function setMessage(selector, message, error = false) { text(selector,message); $(selector).classList.toggle('error',error); }
  function validPayload(key, value) {
    if (!value || typeof value !== 'object') return false;
    if (key === 'status') return value.measurement && value.builder && value.signer;
    if (key === 'settlements') return value.summary && Array.isArray(value.buckets) && Array.isArray(value.recentSettlements);
    if (key === 'economy') return value.supply && value.staking && value.nft;
    return value.metadata && String(value.tokenId) === key.replace('nft-','') && value.custody;
  }
  async function fetchData(key, path) {
    const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), 8500);
    try {
      const response = await fetch(`${API}/${path}`, { signal:controller.signal, cache:'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const value = await response.json();
      if (!validPayload(key,value)) throw new Error('Unavailable or invalid API response');
      const record = { value, at:Date.now() }; writeStore(`squeek:cache:v1:${key}`,record);
      return { ...record, stale:false };
    } catch {
      const cache = readStore(`squeek:cache:v1:${key}`,null);
      if (cache?.value && validPayload(key,cache.value)) return { ...cache, stale:true };
      return { value:null, at:0, stale:true };
    } finally { clearTimeout(timer); }
  }
  async function refresh() {
    if (refreshBusy) return;
    refreshBusy = true; $('#refresh').disabled = true;
    await Promise.allSettled([['status','status'],['settlements','settlements?range=24h'],['economy','economy/state']].map(async ([key,path]) => {
      const record = await fetchData(key,path); health[key] = record;
      if (record.value) {
        const old = data[key]; data[key] = record.value;
        if (key === 'status' && !record.stale) applyHardware(old,record.value);
        if (key === 'economy' && record.value.lifecycle?.currentRound) {
          const timestamp = Date.parse(record.value.generatedAt);
          if (Number.isFinite(timestamp)) roundAnchor = { round:finite(record.value.lifecycle.currentRound), boundary:Math.floor(timestamp / 600000) };
        }
      }
      renderData();
    }));
    refreshBusy = false; $('#refresh').disabled = false;
  }
  function applyHardware(old, value) {
    const current = finite(value.measurement.cumulativeWorkUnits); const epoch = value.measurement.counterEpoch;
    if (lastWork !== null && lastCounterEpoch === epoch && current > lastWork && running) {
      const n = hit(Math.min(1000,(current - lastWork) * 4),true); log('workHit',{n:fmt(n)});
    }
    lastWork = current; lastCounterEpoch = epoch;
    // The recent-settlements feed can omit zero-work batches. The settled anchor advances
    // for those batches too, so it is the authority for a block prediction's outcome.
    const anchor = value.builder.anchor;
    if (anchor && stanceLock?.hasAnchor && !stanceLock.resolved && finite(anchor.settledThroughRound) > stanceLock.roundAtLock) {
      if (stanceLock.stance === 'surge') {
        const win = finite(anchor.blockHeight) > stanceLock.heightAtLock;
        if (win) { points += 100; addXP(50); }
        log(win ? 'surgeWin' : 'surgeMiss'); stanceLock.resolved = true;
      } else if (stanceLock.stance === 'overclock' && finite(anchor.cumulativeWork) > stanceLock.workAtLock) {
        workBonusUntil = Date.now() + 60000; points += 25; log('overclockWin'); stanceLock.resolved = true;
      }
      persist(); renderPlayer();
    }
  }
  function renderData() {
    const s = data.status, settlements = data.settlements, e = data.economy;
    if (s) {
      const m = s.measurement, a = s.builder.anchor || {}, signer = s.signer || {};
      text('#rpm',fmt(finite(m.rpmMilli)/1000,1)); text('#speed',fmt(m.speedMmPerSecond)); text('#distance',fmt(finite(m.distanceMm)/1e6,3)); text('#work',fmt(m.cumulativeWorkUnits));
      text('#block-height',`#${fmt(a.blockHeight)}`);
      const progress = clamp(finite(a.blockProgress)/1e9*100,0,100); text('#block-percent',`${fmt(progress,1)}%`); $('#block-fill').style.width = `${progress}%`;
      const fresh = liveStatus();
      text('#hamster-state',fresh ? t(m.coreStatus === 'SPINNING' ? 'spinning' : 'idle') : t('cached'));
      text('#hamster-note', t(fresh && m.coreStatus === 'SPINNING' ? 'spinningNote' : 'idleNote'));
      $('#hardware-wheel').classList.toggle('spinning',fresh && m.coreStatus === 'SPINNING');
      const verified = signer.kind === 'trust-m' && !!signer.lastSignature && signer.keySlot === '0xE0F3' && s.modules?.[0]?.driverId === 'usb-rp2040-a3144e-lm393';
      $('.proof').classList.toggle('verified',verified && fresh);
      text('#proof-badge', t(verified ? 'verified' : 'proofUnverified') + (fresh ? '' : ` · ${t('cached')}`));
      text('#signer',signer.kind || t('unavailable')); text('#key-slot',signer.keySlot || t('unavailable')); text('#driver',s.modules?.[0]?.driverId || t('unavailable')); text('#signature',signer.lastSignature || t('unavailable')); text('#settled-round',a.settledThroughRound || '—'); text('#work-thousand',fmt(a.workPerThousandBlocks));
    }
    const fresh = liveStatus();
    $('#feed-tag').className = `feed-tag ${fresh ? 'live' : s ? 'cached' : ''}`;
    $('#feed-tag span').textContent = t(fresh ? 'live' : s ? 'cached' : 'offline');
    text('#last-sync', s ? t(fresh ? 'freshAt' : 'cachedAt',{time:new Date(health.status?.at || Date.now()).toLocaleTimeString('en-GB',{hour12:false})}) : t('noFeed'));
    if (settlements) {
      text('#work-added',fmt(settlements.summary.workAdded)); text('#blocks-completed',fmt(settlements.summary.completedBlockCount)); text('#settlement-count',fmt(settlements.summary.settlementCount));
      $('.settlement-panel .quiet-tag').textContent = `${t('last24')}${health.settlements?.stale ? ` · ${t('cached')}` : ''}`;
      drawChart(); renderSettlements();
    }
    if (e) {
      text('#sqk-supply',fmt(baseUnits(e.supply.totalMintedBaseUnits),2));
      text('#staked-power',fmt(baseUnits(e.staking.totalNftPower),2));
      const c = baseUnits(e.staking.sqkPerPower);
      text('#power-c',`c = ${fmt(c,2)} SQK / ${t('power')}${health.economy?.stale ? ` · ${t('cached')}` : ''}`);
      renderPyramid(); calculate();
    }
    renderStance(); renderCombat();
  }
  $('#refresh').addEventListener('click',refresh);
  setInterval(() => { if (!document.hidden) refresh(); },12000);

  const canvas = /** @type {HTMLCanvasElement} */ ($('#work-chart'));
  let chartHovered = -1;
  function drawChart() {
    const buckets = data.settlements?.buckets?.slice(-24) || [];
    const w = Math.max(1,canvas.clientWidth), h = 155, ratio = Math.min(devicePixelRatio || 1,2);
    canvas.width = w * ratio; canvas.height = h * ratio;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    ctx.scale(ratio,ratio); ctx.clearRect(0,0,w,h);
    const max = Math.max(1,...buckets.map(b => finite(b.workAdded))), plotHeight = 118;
    ctx.strokeStyle = '#2b2d35'; ctx.lineWidth = 1; ctx.setLineDash([3,4]);
    for (let y = 10; y <= 128; y += 39) { ctx.beginPath(); ctx.moveTo(0,y+.5); ctx.lineTo(w,y+.5); ctx.stroke(); }
    ctx.setLineDash([]);
    const step = w / Math.max(24,buckets.length);
    buckets.forEach((b,i) => {
      const amount = finite(b.workAdded); const bar = amount / max * plotHeight;
      ctx.fillStyle = i === chartHovered ? '#2fd6e8' : amount ? '#f8a838' : '#34343c';
      ctx.fillRect(i * step + 2,128 - Math.max(2,bar),Math.max(2,step - 5),Math.max(2,bar));
    });
    ctx.fillStyle = '#a4a5af'; ctx.font = '12px Consolas, monospace';
    [0,6,12,18,23].forEach(i => {
      if (!buckets[i]) return;
      const label = new Date(buckets[i].startAt).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:'UTC'});
      const x = Math.min(w-ctx.measureText(label).width,Math.max(0,i*step)); ctx.fillText(label,x,151);
    });
    $('#chart-empty').hidden = buckets.length > 0;
    canvas.setAttribute('aria-label',`${t('hourlyWork')}. ${fmt(data.settlements?.summary?.workAdded || 0)} ${t('chartWork')}.`);
    $('#chart-table').innerHTML = `<table><thead><tr><th>${esc(t('chartHour'))}</th><th>${esc(t('chartWork'))}</th></tr></thead><tbody>${buckets.map(b => `<tr><td>${new Date(b.startAt).toISOString().slice(5,16).replace('T',' ')}</td><td>${fmt(b.workAdded)}</td></tr>`).join('')}</tbody></table>`;
  }
  canvas.addEventListener('pointermove', e => {
    const rect = canvas.getBoundingClientRect(); chartHovered = Math.min(23,Math.floor((e.clientX - rect.left) / rect.width * 24));
    const bucket = data.settlements?.buckets?.slice(-24)[chartHovered];
    if (bucket) text('#chart-detail',`${new Date(bucket.startAt).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:'UTC'})} UTC · ${fmt(bucket.workAdded)} ${t('chartWork')}`);
    drawChart();
  });
  canvas.addEventListener('pointerleave', () => { chartHovered = -1; text('#chart-detail',''); drawChart(); });
  new ResizeObserver(drawChart).observe(canvas.parentElement);
  function renderSettlements() {
    const rows = data.settlements?.recentSettlements?.slice(0,4) || [];
    $('#settlement-list').innerHTML = rows.length ? rows.filter(row => /^0x[0-9a-fA-F]{64}$/.test(row.transactionHash)).map(row => `<a href="https://sepolia.etherscan.io/tx/${row.transactionHash}" target="_blank" rel="noopener noreferrer"><span class="tx-icon">${icon('box')}</span><span>${esc(t('settlementRound',{n:row.settledThroughRound}))}<small class="mono">${row.transactionHash.slice(0,8)}…${row.transactionHash.slice(-6)}</small></span><span class="settlement-data">+${fmt(row.workAdded)} ${esc(t('chartWork'))}<small>${esc(t('newBlocks',{n:fmt(row.completedBlockCount)}))}</small></span>${icon('external')}</a>`).join('') : `<p class="muted">${esc(t('noSettlements'))}</p>`;
  }
  function calculate() {
    const p = $('#calc-power'), s = $('#calc-stake');
    const valid = p.value !== '' && s.value !== '' && p.validity.valid && s.validity.valid;
    const c = data.economy ? baseUnits(data.economy.staking.sqkPerPower) : 40;
    const value = valid ? effectivePower(Number(p.value),Number(s.value),c) : null;
    text('#effective-power',value === null ? '—' : fmt(value,2));
    setMessage('#calc-error',value === null ? t('calcInvalid') : '',value === null);
    p.setAttribute('aria-invalid',String(!p.validity.valid || p.value === '')); s.setAttribute('aria-invalid',String(!s.validity.valid || s.value === ''));
  }
  $('#calc-power').setAttribute('aria-describedby','calc-error'); $('#calc-stake').setAttribute('aria-describedby','calc-error');
  $('#calc-power').addEventListener('input',calculate); $('#calc-stake').addEventListener('input',calculate);
  function renderPyramid() {
    const nft = data.economy?.nft;
    $('#merge-pyramid').innerHTML = `<div class="merge-row head"><span>${esc(t('mergeLevel'))}</span><span>${esc(t('basePower'))}</span><span>${esc(t('cooldown'))}</span></div>` + Array.from({length:10},(_,i) => `<div class="merge-row"><span class="mono">${String(i+1).padStart(2,'0')}</span><span class="merge-bar"><i style="--level-width:${(i+1)*6}px"></i><span class="mono">${nft?.basePower?.[i] !== undefined ? fmt(nft.basePower[i]) : esc(t('unavailable'))}</span></span><span class="mono">${nft?.cooldownBlocks?.[i] !== undefined ? fmt(nft.cooldownBlocks[i]) : '—'}</span></div>`).join('');
  }

  async function loadSquad(ids) {
    const version = ++squadVersion;
    squadLoading = true; $('#load-squad').disabled = true; $('#random-squad').disabled = true;
    setMessage('#squad-message',t('loadingSquad'));
    squad = ids.map(id => ({ id, value:null, loading:true, stale:false })); renderSquad();
    const results = await Promise.allSettled(ids.map(async (id,index) => {
      const record = await fetchData(`nft-${id}`,`squeeks/${id}`);
      if (version !== squadVersion) return;
      squad[index] = { id, value:record.value, loading:false, stale:record.stale }; renderSquad();
    }));
    if (version !== squadVersion) return;
    squadLoading = false; $('#load-squad').disabled = false; $('#random-squad').disabled = false;
    const count = squad.filter(s => s.value && !s.value.custody.burned).length;
    setMessage('#squad-message',count === 3 ? t('squadLoaded',{n:count}) : t('squadError'),count < 3);
    writeStore('squeek:squad',ids);
  }
  function renderSquad() {
    squadPower = squad.reduce((total,s) => total + (s.value && !s.value.custody.burned ? finite(s.value.basePower) : 0),0);
    text('#squad-total',fmt(squadPower)); text('#arena-power',fmt(squadPower));
    $('#squad-cards').innerHTML = squad.map(s => {
      const v = s.value;
      if (!v) return `<article class="squeek-card"><div class="squeek-placeholder">${icon('squad')}</div><div class="squeek-info"><h3>Squeek #${esc(s.id)}</h3><p class="muted">${esc(t(s.loading ? 'metadataLoading' : 'nftUnavailable'))}</p></div></article>`;
      const image = v.metadata.imageDataUri;
      const safeImage = typeof image === 'string' && /^data:image\/svg\+xml[;,]/i.test(image);
      const owner = v.custody.owner;
      const state = v.custody.burned ? t('burned') : v.mergeState === 'ready' ? t('ready') : String(v.mergeState || t('unavailable'));
      return `<article class="squeek-card">${safeImage ? `<img class="squeek-art" src="${esc(image)}" alt="${esc(v.metadata.name || `Squeek #${s.id}`)}" width="128" height="128">` : `<div class="squeek-placeholder">${icon('squad')}</div>`}<div class="squeek-info"><h3>${esc(v.metadata.name || `Squeek #${s.id}`)}</h3><span class="squeek-level">${esc(t('level'))} ${esc(v.level)}${s.stale ? ` · ${esc(t('cached'))}` : ''}</span><p class="squeek-power">${icon('bolt')} ${fmt(v.custody.burned ? 0 : v.basePower)}</p><p class="squeek-state">${esc(state)}</p></div><details class="squeek-details"><summary>${esc(t('traits'))}</summary><dl><dt>${esc(t('owner'))}</dt><dd>${/^0x[0-9a-fA-F]{40}$/.test(owner) ? `<a class="address" href="https://sepolia.etherscan.io/address/${owner}" target="_blank" rel="noopener noreferrer">${esc(owner)}</a>` : esc(owner || t('unavailable'))}</dd></dl><div class="traits">${(v.metadata.attributes || []).map(attr => `<span class="trait">${esc(attr.traitType || attr.trait_type || '')}: ${esc(attr.value)}</span>`).join('')}</div></details></article>`;
    }).join('');
    renderCombat();
  }
  $('#squad-form').addEventListener('submit', event => {
    event.preventDefault(); if (squadLoading) return;
    const ids = [1,2,3].map(i => $(`#token-${i}`).value.trim());
    if (!ids.every(validTokenId)) { setMessage('#squad-message',t('invalidSquad'),true); return; }
    if (new Set(ids.map(Number)).size !== 3) { setMessage('#squad-message',t('duplicateSquad'),true); $('#token-2').focus(); return; }
    loadSquad(ids.map(Number));
  });
  $('#random-squad').addEventListener('click', () => {
    if (squadLoading) return;
    const ids = new Set(); while (ids.size < 3) { const v = crypto.getRandomValues(new Uint32Array(1))[0]; if (v < 429496 * 9999) ids.add(v % 9999 + 1); }
    const values = [...ids]; values.forEach((id,i) => { $(`#token-${i+1}`).value = id; }); loadSquad(values);
  });
  // Wallets use raw EIP-1193. EIP-6963 keeps multiple extensions from competing for window.ethereum.
  const walletDialog = /** @type {HTMLDialogElement} */ ($('#wallet-dialog'));
  const mobileLinks = [
    { name:'MetaMask', href:url => `https://link.metamask.io/dapp/${url.replace(/^https?:\/\//,'')}` },
    { name:'Coinbase Wallet', href:url => `https://go.cb-w.com/dapp?cb_url=${encodeURIComponent(url)}` },
    { name:'Rabby', href:url => `https://go.rabby.io/mobile/dapp?url=${encodeURIComponent(url)}` },
    { name:'Phantom', href:url => `https://phantom.app/ul/browse/${encodeURIComponent(url)}?ref=${encodeURIComponent(new URL(url).origin)}` }
  ];
  const fallbackProvider = () => /** @type {any} */ (window).ethereum;
  function renderWalletOptions() {
    const discovered = [...providers.entries()];
    const choices = discovered.length ? discovered : fallbackProvider() ? [['browser',{info:{name:t('browserWallet'),icon:''},provider:fallbackProvider()}]] : [];
    $('#wallet-options').innerHTML = choices.length ? choices.map(([id,value]) => `<button class="wallet-option" data-wallet="${esc(id)}" ${walletBusy ? 'disabled' : ''}>${/^data:image\//.test(value.info.icon || '') ? `<img src="${esc(value.info.icon)}" width="28" height="28" alt="">` : icon('box')}<span>${esc(value.info.name)}</span>${icon('arrow')}</button>`).join('') : `<p class="muted">${esc(t('walletUnavailable'))}</p>`;
    if (account) {
      $('#wallet-options').insertAdjacentHTML('beforeend',`<button class="wallet-option" id="disconnect-dialog">${icon('external')}<span>${esc(t('disconnect'))}</span></button>`);
      $('#disconnect-dialog').addEventListener('click', () => { disconnectWallet(); walletDialog.close(); });
    }
    $('#mobile-wallets').innerHTML = `<p>${esc(t('mobileOpen'))}</p>` + mobileLinks.map(w => `<a href="${esc(w.href(location.href))}">${esc(lang === 'zh' ? `在 ${w.name} 中打开` : `Open in ${w.name}`)} ↗</a>`).join('');
    $$('[data-wallet]').forEach(el => el.addEventListener('click', () => {
      const item = providers.get(el.dataset.wallet); connectWallet(item?.provider || fallbackProvider());
    }));
  }
  window.addEventListener('eip6963:announceProvider', /** @param {any} event */ event => {
    const detail = event.detail;
    if (!detail?.info?.uuid || typeof detail.provider?.request !== 'function') return;
    providers.set(String(detail.info.uuid),detail);
    if (walletDialog.open) renderWalletOptions();
  });
  window.dispatchEvent(new Event('eip6963:requestProvider'));
  const onAccounts = accounts => {
    account = Array.isArray(accounts) && /^0x[0-9a-fA-F]{40}$/.test(accounts[0]) ? accounts[0] : '';
    setMessage('#wallet-status','');
    renderWallet();
  };
  const onChain = value => { chainId = String(value).toLowerCase(); setMessage('#wallet-status',''); renderWallet(); if (chainId === SEPOLIA) resumeReceipts(); };
  const onDisconnect = () => { account = ''; chainId = ''; renderWallet(); };
  function attachProvider(next) {
    if (provider?.removeListener) { provider.removeListener('accountsChanged',onAccounts); provider.removeListener('chainChanged',onChain); provider.removeListener('disconnect',onDisconnect); }
    provider = next;
    if (provider?.on) { provider.on('accountsChanged',onAccounts); provider.on('chainChanged',onChain); provider.on('disconnect',onDisconnect); }
  }
  async function connectWallet(next) {
    if (!next || walletBusy) return;
    walletBusy = true; renderWalletOptions(); setMessage('#connect-message',t('connectPending'));
    try {
      const accounts = await next.request({ method:'eth_requestAccounts' });
      if (!Array.isArray(accounts) || !/^0x[0-9a-fA-F]{40}$/.test(accounts[0])) throw new Error('No account returned');
      const network = await next.request({ method:'eth_chainId' });
      attachProvider(next); account = accounts[0]; chainId = String(network).toLowerCase();
      walletDialog.close(); setMessage('#connect-message',''); setMessage('#wallet-status',''); renderWallet(); resumeReceipts();
    } catch (err) {
      setMessage('#connect-message',t(/** @type {any} */ (err)?.code === 4001 ? 'walletRejected' : 'walletError'),true);
    } finally { walletBusy = false; renderWalletOptions(); renderWallet(); }
  }
  $('#connect').addEventListener('click', () => {
    if (account && chainId !== SEPOLIA) { switchNetwork(); return; }
    renderWalletOptions(); setMessage('#connect-message',account ? shortAddress(account) : ''); walletDialog.showModal();
  });
  $('#wallet-close').addEventListener('click', () => walletDialog.close());
  walletDialog.addEventListener('click', event => {
    const bounds = walletDialog.getBoundingClientRect();
    if (event.target === walletDialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) walletDialog.close();
  });
  walletDialog.addEventListener('close', () => $('#connect').focus());
  async function switchNetwork() {
    if (!provider || !account) { renderWalletOptions(); walletDialog.showModal(); return; }
    if (walletBusy) return;
    walletBusy = true; renderWallet(); setMessage('#wallet-status',t('networkPending'));
    try {
      try { await provider.request({method:'wallet_switchEthereumChain',params:[{chainId:SEPOLIA}]}); }
      catch (error) {
        if (/** @type {any} */ (error).code !== 4902) throw error;
        await provider.request({method:'wallet_addEthereumChain',params:[{chainId:SEPOLIA,chainName:'Sepolia',nativeCurrency:{name:'Sepolia Ether',symbol:'ETH',decimals:18},rpcUrls:['https://ethereum-sepolia-rpc.publicnode.com'],blockExplorerUrls:['https://sepolia.etherscan.io']}]});
        await provider.request({method:'wallet_switchEthereumChain',params:[{chainId:SEPOLIA}]});
      }
      chainId = String(await provider.request({method:'eth_chainId'})).toLowerCase();
    } catch { setMessage('#wallet-status',t('networkError'),true); }
    finally { walletBusy = false; renderWallet(); if (chainId === SEPOLIA) resumeReceipts(); }
  }
  $('#switch-network').addEventListener('click',switchNetwork);
  function disconnectWallet() {
    attachProvider(null); account = ''; chainId = ''; setMessage('#wallet-status','');
    for (const timer of pendingTimers.values()) clearTimeout(timer); pendingTimers.clear(); renderWallet();
  }
  $('#disconnect').addEventListener('click',disconnectWallet);
  function renderWallet() {
    const ready = !!account && chainId === SEPOLIA;
    $('#connect span').textContent = account ? chainId === SEPOLIA ? shortAddress(account) : t('switchFirst') : t('connect');
    $('#connect').setAttribute('aria-label',account ? `${account} · ${t(chainId === SEPOLIA ? 'connectWallet' : 'switchFirst')}` : t('connectWallet'));
    $('#switch-network').disabled = ready || walletBusy;
    $('#disconnect').hidden = !account;
    if (!$('#wallet-status').classList.contains('error')) setMessage('#wallet-status',!account ? t('walletPrompt') : ready ? t('connected',{address:account}) : t('wrongChain'));
    $$('[data-tx]').forEach(el => {
      const key = el.dataset.tx;
      el.disabled = !ready || txBusy || ['submitted','pending','checking','awaitingWallet'].includes(txs[key]?.status);
      if (!txs[key]) text(`#tx-${key}`,t(ready ? 'readyTx' : account ? 'wrongChain' : 'notConnected'));
      else renderTx(key);
    });
  }
  function renderTx(key) {
    const tx = txs[key]; if (!tx) return;
    const labels = {checking:'checking',awaitingWallet:'awaitingWallet',submitted:'txSubmitted',confirmed:'txConfirmed',reverted:'txReverted',rejected:'txRejected',failed:'txError',simulationFailed:'preflightFailed',pending:'receiptPending'};
    const el = $(`#tx-${key}`); el.classList.toggle('error',['failed','simulationFailed','reverted'].includes(tx.status));
    const hash = /^0x[0-9a-fA-F]{64}$/.test(tx.hash || '') ? tx.hash : '';
    el.innerHTML = `${esc(t(labels[tx.status] || 'txError'))}${tx.message ? `<span class="address">${esc(tx.message)}</span>` : ''}${hash ? `<a href="https://sepolia.etherscan.io/tx/${hash}" target="_blank" rel="noopener noreferrer">${esc(t('viewTx'))} ↗</a>` : ''}${hash && tx.status === 'pending' ? `<button class="text-button" data-receipt="${key}">${esc(t('checkReceipt'))}</button>` : ''}`;
    el.querySelector('[data-receipt]')?.addEventListener('click', () => { if (provider && chainId === SEPOLIA) pollReceipt(key,0); else setMessage('#wallet-status',t(account ? 'wrongChain' : 'walletPrompt'),true); });
  }
  function saveTxs() { writeStore('squeek:tx:v1',txs); }
  async function sendTransaction(key) {
    if (!provider || !account || txBusy) return;
    const selectedProvider = provider, from = account;
    const contract = CONTRACTS[key]; if (!contract) return;
    txBusy = true; txs[key] = {status:'checking',hash:'',from}; renderWallet();
    let stage = 'preflight';
    try {
      const network = await selectedProvider.request({method:'eth_chainId'});
      if (String(network).toLowerCase() !== SEPOLIA) { chainId = String(network).toLowerCase(); delete txs[key]; setMessage('#wallet-status',t('wrongChain'),true); return; }
      const transaction = { from, to:contract.address, data:contract.data, value:'0x0' };
      await selectedProvider.request({method:'eth_call',params:[transaction,'latest']});
      const accounts = await selectedProvider.request({method:'eth_accounts'});
      const finalChain = await selectedProvider.request({method:'eth_chainId'});
      if (provider !== selectedProvider || accounts[0]?.toLowerCase() !== from.toLowerCase() || String(finalChain).toLowerCase() !== SEPOLIA) throw new Error(t('changeWallet'));
      stage = 'send'; txs[key].status = 'awaitingWallet'; renderTx(key);
      const hash = await selectedProvider.request({method:'eth_sendTransaction',params:[transaction]});
      if (!/^0x[0-9a-fA-F]{64}$/.test(hash)) throw new Error('Wallet returned an invalid transaction hash');
      txs[key] = {status:'submitted',hash,from}; saveTxs(); renderTx(key); pollReceipt(key,0);
    } catch (error) {
      const err = /** @type {any} */ (error);
      txs[key] = {status:err?.code === 4001 ? 'rejected' : stage === 'preflight' ? 'simulationFailed' : 'failed',hash:'',from,message:typeof err?.message === 'string' ? err.message.slice(0,240) : ''};
      saveTxs(); renderTx(key);
    } finally { txBusy = false; renderWallet(); }
  }
  $$('[data-tx]').forEach(el => el.addEventListener('click', () => sendTransaction(el.dataset.tx)));
  async function pollReceipt(key,attempt) {
    if (!provider || chainId !== SEPOLIA || !txs[key]?.hash) return;
    if (pendingTimers.has(key)) { clearTimeout(pendingTimers.get(key)); pendingTimers.delete(key); }
    const hash = txs[key].hash, selectedProvider = provider;
    try {
      if (String(await selectedProvider.request({method:'eth_chainId'})).toLowerCase() !== SEPOLIA) return;
      const receipt = await selectedProvider.request({method:'eth_getTransactionReceipt',params:[hash]});
      if (provider !== selectedProvider || txs[key].hash !== hash) return;
      if (receipt && (receipt.status === '0x1' || receipt.status === '0x0')) {
        txs[key].status = receipt.status === '0x1' ? 'confirmed' : 'reverted'; saveTxs();
        if (receipt.status === '0x1' && key === 'ping') addBadge('testerLoot');
        renderTx(key); renderWallet(); return;
      }
    } catch { /* Keep the known hash; a network error does not mean a transaction failed. */ }
    if (attempt >= 24) { txs[key].status = 'pending'; saveTxs(); renderTx(key); renderWallet(); return; }
    pendingTimers.set(key,setTimeout(() => pollReceipt(key,attempt+1),5000));
  }
  function resumeReceipts() {
    if (chainId !== SEPOLIA) return;
    for (const key of Object.keys(CONTRACTS)) {
      if (txs[key]?.hash && ['submitted','pending'].includes(txs[key].status)) pollReceipt(key,0);
      else if (['checking','awaitingWallet'].includes(txs[key]?.status)) { delete txs[key]; saveTxs(); }
    }
  }
  function applyLanguage() {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    $$('[data-i18n]').forEach(el => { el.innerHTML = t(el.dataset.i18n); });
    text('#language',lang === 'en' ? '中文' : 'EN');
    $('#language').setAttribute('aria-label',lang === 'en' ? 'Switch to Chinese' : 'Switch to English');
    $('#refresh').setAttribute('aria-label',lang === 'zh' ? '刷新实时数据' : 'Refresh live data');
    text('#motion-toggle',t(motionPaused ? 'resumeMotion' : 'pauseMotion'));
    renderPlayer(); renderCombat(); renderStance(); renderLog(); renderData(); renderSquad(); renderPyramid(); calculate(); renderWallet();
  }
  $('#language').addEventListener('click', () => { lang = lang === 'en' ? 'zh' : 'en'; writeStore('squeek:lang',lang); applyLanguage(); });
  const sections = ['arena','squad','telemetry','terminal'];
  function updateNavigation() {
    const ordered = sections.map(id => $(`#${id}`)).sort((a,b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
    const visible = ordered.find(el => el.getBoundingClientRect().bottom > innerHeight * .25) || ordered.at(-1);
    $$('.main-nav a').forEach(a => a.classList.toggle('active',a.getAttribute('href') === `#${visible.id}`));
  }
  const observer = new IntersectionObserver(updateNavigation,{rootMargin:'-5% 0px -65% 0px',threshold:0});
  sections.forEach(id => observer.observe($(`#${id}`)));
  addEventListener('resize',updateNavigation);
  const rememberedIds = readStore('squeek:squad',[1,42,888]);
  const initialIds = Array.isArray(rememberedIds) && rememberedIds.length === 3 && rememberedIds.every(validTokenId) && new Set(rememberedIds.map(Number)).size === 3 ? rememberedIds.map(Number) : [1,42,888];
  initialIds.forEach((id,i) => { $(`#token-${i+1}`).value = id; });
  // Prime only real cached payloads. A failed request never replaces useful content with blanks.
  for (const key of ['status','settlements','economy']) {
    const cached = readStore(`squeek:cache:v1:${key}`,null);
    if (cached?.value && validPayload(key,cached.value)) { data[key] = cached.value; health[key] = {...cached,stale:true}; }
  }
  applyLanguage(); log('welcomeLog'); refresh(); loadSquad(initialIds);
  if (!storageOK) log('storageUnavailable');
}
