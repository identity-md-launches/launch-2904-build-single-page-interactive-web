// Deterministic fixtures used ONLY by the browser tests. Production never imports this file.
export const FIXED_NOW = Date.UTC(2026,10,3,4,1,0);
export const OWNER = '0x598958abf7d8db8dd468cb53dd6ba705581bff54';
export const SETTLEMENT_HASH = '0xeec0e28c5c6ffcbb82dddc6afa11f6c1d034e5c4b7446d5d99ef75f72e7aaac3';
export function fixtures(state, art) {
  const generatedAt = new Date(state.now).toISOString();
  const basePower = ['1000','2200','4840','10648','23426','51536','113380','249436','548759','1207269'];
  return {
    status:{generatedAt,measurement:{freshness:'online',observedAt:generatedAt,staleAfterSeconds:120,counterEpoch:'test-epoch',coreStatus:state.spinning?'SPINNING':'IDLE',rpmMilli:state.spinning?60000:0,speedMmPerSecond:state.spinning?800:0,distanceMm:6374280,cumulativeWorkUnits:String(state.work)},builder:{anchor:{blockHeight:String(state.height),blockProgress:'258812397',settledThroughRound:String(state.settled),workPerThousandBlocks:'10362',cumulativeWork:String(state.work)}},signer:{kind:'trust-m',keySlot:'0xE0F3',lastSignature:'explicit-test-fixture-signature'},modules:[{driverId:'usb-rp2040-a3144e-lm393'}]},
    'economy/state':{generatedAt,lifecycle:{currentRound:String(1100+Math.floor((state.now-FIXED_NOW)/600000))},supply:{totalMintedBaseUnits:'29926212078853957523222689'},staking:{totalNftPower:'116800000000000000000000',sqkPerPower:'40000000000000000000'},nft:{basePower,cooldownBlocks:['0','3000','7000','14000','21000','28000','35000','42000','49000','0']}},
    settlements:{generatedAt,summary:{workAdded:'9219',completedBlockCount:'901',settlementCount:'139'},buckets:Array.from({length:24},(_,i)=>({startAt:new Date(state.now-(23-i)*3600000).toISOString(),workAdded:String(i%4===0?i*60:0)})),recentSettlements:[{transactionHash:SETTLEMENT_HASH,settledThroughRound:String(state.settled),workAdded:'36',completedBlockCount:'4'}]},
    nft:id=>({tokenId:String(id),level:id===7?5:1,basePower:id===7?'23426':'1000',mergeState:'ready',custody:{owner:OWNER,burned:false},metadata:{name:`Squeek #${id}`,imageDataUri:art,attributes:[{traitType:'Palette',value:'Test fixture gold'},{traitType:'Body Glyph',value:'Diamond'}]}})
  };
}
