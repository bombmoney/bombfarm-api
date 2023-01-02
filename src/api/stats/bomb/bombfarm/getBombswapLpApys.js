import { bombWeb3 as web3, multicallAddress, web3Factory, bombWeb3 } from '../../../../utils/web3';
import { BOMB_CHAIN_ID } from '../../../../constants';
import { getMasterChefApys } from '../../common/getMasterChefApys';
import pools from '../../../../data/bombswapLpPools.json';
//import pools from './vaults.json';
import MasterChef from '../../../../abis/BombMasterChef.json';
import { AbiItem } from 'web3-utils';

import { addressBook } from '../../../../../packages/address-book/address-book';

// const
//   bomb: {
//     platforms: {
//       bombswap: { masterchef },
//     },
//     tokens: { BOMB, BOMBSWAP },
//   },
// } = addressBook;

const masterChef = '0x024D3963A413F745A5328388937755B4f14cbcc5';

export const getBombSwapLpApys = () => {
  return getMasterChefApys({
    web3: web3,
    chainId: BOMB_CHAIN_ID,
    masterchef: masterChef,
    pools,
    masterchefAbi: MasterChef,
    tokenPerBlock: 'rewardPerBlock',
    secondsPerBlock: 3,
    hasMultiplier: true,
    oracle: 'tokens',
    oracleId: 'BOMBSWAP',
    decimals: '1e18',
    log: true,
  });
};

// const rewardPool = '0x1083926054069AaD75d7238E9B809b0eF9d94e5B';
// const oracleId = 'BSHARE';
// const oracle = 'tokens';
// const DECIMALS = '1e18';

// const getBombswapLpApys = async () => {
//   let apys = {};
//   const bakeryMaster = '0x1083926054069AaD75d7238E9B809b0eF9d94e5B';

//   let promises = [];
//   pools.forEach(pool => promises.push(getPoolApy(bakeryMaster, pool)));
//   const values = await Promise.all(promises);

//   for (let item of values) {
//     apys = { ...apys, ...item };
//   }

//   return apys;
// };

// const getPoolApy = async (bakeryMaster, pool) => {
//   const [yearlyRewardsInUsd, totalStakedInUsd] = await Promise.all([
//     getYearlyRewardsInUsd(bakeryMaster, pool.address),
//     getTotalLpStakedInUsd(bakeryMaster, pool, BOMB_CHAIN_ID),
//   ]);

//   const simpleApy = yearlyRewardsInUsd.dividedBy(totalStakedInUsd);

//   const apy = compound(simpleApy, BASE_HPY, 1, 0.955);
//   return { [pool.name]: apy };
// };

//odule.exports = getBombswapLpApys;
