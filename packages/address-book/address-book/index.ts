import { polygon } from './polygon';
import { bsc } from './bsc';
import { avax } from './avax';
import { fantom } from './fantom';
import { heco } from './heco';
import { one } from './one';
import { bomb } from './bomb';
import { arbitrum } from './arbitrum';
import { celo } from './celo';
import { moonriver } from './moonriver';
import { cronos } from './cronos';
//import { aurora } from './aurora';
import Chain from '../types/chain';
import { ChainId } from '../types/chainid';
import { ConstRecord } from '../types/const';

export * from '../types/chainid';

const _addressBook = {
  polygon,
  bsc,
  bomb,
  avax,
  fantom,
  heco,
  one,
  arbitrum,
  celo,
  //  moonriver,
  cronos,
} as const;

const _addressBookByChainId = {
  [ChainId.polygon]: polygon,
  [ChainId.bsc]: bsc,
  [ChainId.bomb]: bomb,
  [ChainId.avax]: avax,
  [ChainId.fantom]: fantom,
  [ChainId.heco]: heco,
  [ChainId.one]: one,
  [ChainId.arbitrum]: arbitrum,
  [ChainId.celo]: celo,
  // [ChainId.moonriver]: moonriver,
  [ChainId.cronos]: cronos,
  // [ChainId.aurora]: aurora,
} as const;

export const addressBook: ConstRecord<typeof _addressBook, Chain> = _addressBook;

export const addressBookByChainId: ConstRecord<typeof _addressBookByChainId, Chain> =
  _addressBookByChainId;
