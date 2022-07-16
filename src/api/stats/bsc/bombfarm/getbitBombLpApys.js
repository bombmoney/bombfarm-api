const { bscWeb3: web3, multicallAddress } = require('../../../../utils/web3');
const BigNumber = require('bignumber.js');

const RewardPool = require('../../../../abis/BombRewardCz.json');
const pools = require('../../../../data/bitbombLpPools.json');
const fetchPrice = require('../../../../utils/fetchPrice');
const { getTotalLpStakedInUsd } = require('../../../../utils/getTotalStakedInUsd');
const { getTradingFeeApr } = require('../../../../utils/getTradingFeeApr');
const { cakeClient } = require('../../../../apollo/client');
import { SPOOKY_LPF } from '../../../../constants';
import getApyBreakdown from '../../common/getApyBreakdown';
//const SPOOKY_LPF = 0.0017;

const rewardPool = '0xaAfc6D149Da6dc460D306c794B4a0bdD727204a9';
const oracleId = 'BITSHARE';
const oracle = 'tokens';
const DECIMALS = '1e18';

const getbitBombLpApys = async () => {
  let promises = [];
  pools.forEach(pool => promises.push(getPoolApy(rewardPool, pool)));
  const farmAprs = await Promise.all(promises);

  const pairAddresses = pools.map(pool => pool.address);
  // console.log('pairAddresses', pairAddresses);

  const tradingAprs = await getTradingFeeApr(cakeClient, pairAddresses, SPOOKY_LPF);
  // console.log('pools', tradingAprs);
  return getApyBreakdown(pools, tradingAprs, farmAprs, SPOOKY_LPF);
};

const getPoolApy = async (rewardPool, pool) => {
  const [yearlyRewardsInUsd, totalStakedInUsd] = await Promise.all([
    getYearlyRewardsInUsd(rewardPool, pool.poolId),
    getTotalLpStakedInUsd(rewardPool, pool, pool.chainId),
  ]);
  //console.log('totalStakedInUsd pool: ', pool.poolId, Number(totalStakedInUsd));
  return yearlyRewardsInUsd.dividedBy(totalStakedInUsd);
};

const getYearlyRewardsInUsd = async (rewardPool, poolId) => {
  const rewardPoolContract = new web3.eth.Contract(RewardPool, rewardPool);

  let { allocPoint } = await rewardPoolContract.methods.poolInfo(poolId).call();
  allocPoint = new BigNumber(allocPoint);

  const fromTime = Math.floor(Date.now() / 1000);
  let [secondRewards, totalAllocPoint] = await Promise.all([
    rewardPoolContract.methods.getGeneratedReward(fromTime, fromTime + 1).call(),
    rewardPoolContract.methods.totalAllocPoint().call(),
  ]);

  secondRewards = new BigNumber(secondRewards);
  totalAllocPoint = new BigNumber(totalAllocPoint);

  const secondsPerYear = 31536000;
  const yearlyRewards = secondRewards
    .times(secondsPerYear)
    .times(allocPoint)
    .dividedBy(totalAllocPoint);

  const price = await fetchPrice({ oracle: oracle, id: oracleId });
  const yearlyRewardsInUsd = yearlyRewards.times(price).dividedBy(DECIMALS);
  // console.log('yearlyRewardsInUsd pool: ', poolId, Number(yearlyRewardsInUsd));

  return yearlyRewardsInUsd;
};

module.exports = getbitBombLpApys;
