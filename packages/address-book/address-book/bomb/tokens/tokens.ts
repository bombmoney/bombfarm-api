import { ConstRecord } from '../../../types/const';
import Token from '../../../types/token';

const BOMB = {
  name: 'WBOMB Token',
  symbol: 'WBOMB',
  address: '0x87460B9F21763aee800b94362062a06dA1B5f6Ee',
  chainId: 2300,
  decimals: 18,
  website: 'https://www.bombmoney.com/',
  description:
    'BOMB is an token originally pegged 10:000:1 to BTC, it is now the native token of BOMB Chain.',
  logoURI: 'https://raw.githubusercontent.com/bombmoney/bomb-assets/master/bombchain.png',
} as const;

const _tokens = {
  BOMB,
  WBOMB: BOMB,
  WNATIVE: BOMB,
  BOMBSWAP: {
    name: 'BOMBSWAP Token',
    symbol: 'BOMBSWAP',
    address: '0xaC029BF2871b3f810AAbF836Adc4F89369027971',
    chainId: 2300,
    decimals: 18,
    logoURI: 'https://raw.githubusercontent.com/bombmoney/bomb-assets/master/bombswap.png',
    website: 'https://bombswap.xyz/',
    description: 'BOMBSWAP Token',
  },
  XBOMBSWAP: {
    name: 'XBOMBSWAP Token',
    symbol: 'XBOMBSWAP',
    address: '0x4b6e421e1753Cc25c0f3719f16C5d2388172171c',
    chainId: 2300,
    decimals: 18,
    logoURI: 'https://raw.githubusercontent.com/bombmoney/bomb-assets/master/xbombswap.png',
    website: 'https://bombswap.xyz/',
    description: 'XBOMBSWAP Token',
  },
  BOHM: {
    name: 'BOHM.MONEY',
    symbol: 'BOHM',
    address: '0x2C6a12d0fAFc78Ff1F7cf8a37F949601c6c8c0ae',
    chainId: 2300,
    decimals: 9,
    logoURI: 'https://raw.githubusercontent.com/bombmoney/bomb-assets/master/bohm.png',
    website: 'https://bohm.money/',
    description: 'BOHM Token',
  },
  PHUB: {
    name: 'PegHub',
    symbol: 'PHUB',
    address: '0x27Efe14C951631aF75C4c6B618EFA03634aFb5D0',
    chainId: 2300,
    decimals: 18,
    logoURI: 'https://raw.githubusercontent.com/bombmoney/bomb-assets/master/PHUB.png',
    website: 'https://bombswap.xyz/',
    description: 'PHUB Token',
  },
  WBTC: {
    name: 'BITCOIN',
    symbol: 'WBTC',
    address: '0x140F62aCCC69cb24eABdC0E00b7caaC577cA5b24',
    chainId: 2300,
    decimals: 18,
    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3717.png',
    website: 'https://bombswap.xyz/',
    description: 'Bitcoin',
  },
  BUSD: {
    name: 'BUSD Token',
    symbol: 'BUSD',
    address: '0x1356Cff3ffDDF918F13A549861b4Fe936Ff895D4',
    chainId: 2300,
    decimals: 18,
    website: 'https://www.binance.com/en/busd',
    description:
      'Binance USD (BUSD) is a 1:1 USD-backed stable coin issued by Binance (in partnership with Paxos), Approved and regulated by the New York State Department of Financial Services (NYDFS), The BUSD Monthly Audit Report can be viewed from the official website.',
    logoURI:
      'https://pancakeswap.finance/images/tokens/0xe9e7cea3dedca5984780bafc599bd69add087d56.png',
  },
  USDC: {
    name: 'BOMB-Wrapped USD Coin',
    symbol: 'USDC',
    address: '0x75942DD8bD0C6F845a647E0Fa157b5725077960D',
    chainId: 2300,
    decimals: 18,
    website: 'https://www.circle.com/usdc',
    description:
      'USDC is a fully collateralized US dollar stablecoin. USDC is issued by regulated financial institutions, backed by fully reserved assets, redeemable on a 1:1 basis for US dollars.',
    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
  },
  USDT: {
    name: 'Tether USD',
    symbol: 'USDT',
    address: '0x0FCbc0baCaD8C73be4Fad141682542b44C4737bB',
    chainId: 2300,
    decimals: 18,
    website: 'https://tether.to/',
    description:
      'Tether is a stablecoin pegged to the US Dollar. A stablecoin is a type of cryptocurrency whose value is pegged to another fiat currency like the US Dollar or to a commodity like Gold.',
    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
  },
  WETH: {
    name: 'Ethereum Token',
    symbol: 'ETH',
    address: '0x128E2b86F42BDB3B646D9B9666B8F8E9cdcEC495',
    chainId: 2300,
    decimals: 18,
    website: 'https://ethereum.org/',
    description:
      'The native currency that flows within the Ethereum economy is called Ether (ETH).',
    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2396.png',
  },
} as const;
export const tokens: ConstRecord<typeof _tokens, Token> = _tokens;
