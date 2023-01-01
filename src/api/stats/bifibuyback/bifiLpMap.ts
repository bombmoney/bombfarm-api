import { addressBook } from '../../../../packages/address-book/address-book';
const { bsc, heco, polygon, fantom, avax, arbitrum } = addressBook;

// BIFI lp pair bifi maxi uses per chain
export const bifiLpMap = {
  bsc: '0x0ccf8B264A333d73162c2Bb32dFE27187703ccfa',
  heco: heco.platforms.mdex.usdtBifiLp,
  polygon: polygon.platforms.quickswap.wethBifiLp,
  fantom: fantom.platforms.spookyswap.wftmBifiLp,
  avax: avax.platforms.joe.avaxBifiLp,
  //  moonriver: moonriver.platforms.sushi.bifiMovrLp,
  arbitrum: arbitrum.platforms.sushi.bifiEthLp,
} as const;

export const phubLpMap = {
  bsc: bsc.platforms.pancake.phubBtcbLp,
} as const;
