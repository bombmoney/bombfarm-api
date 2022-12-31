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
  logoURI: 'https://raw.githubusercontent.com/bombmoney/bomb-assets/master/bomb-512.png',
} as const;

const _tokens = {
  BOMB,
  WBOMB: BOMB,
  WNATIVE: BOMB,
  BOMBSWAP: {
    name: 'BOMBSWAP',
    symbol: 'BOMBSWAP',
    address: '0xaC029BF2871b3f810AAbF836Adc4F89369027971',
    chainId: 2300,
    decimals: 18,
    logoURI: 'https://raw.githubusercontent.com/bombmoney/bomb-assets/master/bitbtc.png',
    website: 'https://bombswap.xyz/',
    description: 'BOMBSWAP Token',
  },
} as const;
export const tokens: ConstRecord<typeof _tokens, Token> = _tokens;
