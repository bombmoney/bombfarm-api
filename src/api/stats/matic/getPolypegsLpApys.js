const BigNumber = require('bignumber.js');
const { MultiCall } = require('eth-multicall');
const { polygonWeb3: web3, multicallAddress } = require('../../../utils/web3');

const RewardPool = require('../../../abis/SnowPegsRewards.json');
const ERC20 = require('../../../abis/ERC20.json');
const fetchPrice = require('../../../utils/fetchPrice');
const pools = require('../../../data/bombPolyLpPools.json');
const { getTotalLpStakedInUsd } = require('../../../utils/getTotalStakedInUsd');
import { getFarmWithTradingFeesApy } from '../../../utils/getFarmWithTradingFeesApy';
const { getYearlyPlatformTradingFees } = require('../../../utils/getTradingFeeApr');
const { BASE_HPY, AVAX_CHAIN_ID, SPOOKY_LPF } = require('../../../constants');
const { getTradingFeeApr } = require('../../../utils/getTradingFeeApr');

// import { getFarmWithTradingFeesApy } from '../../../utils/getFarmWithTradingFeesApy';
import getApyBreakdown from '../common/getApyBreakdown';

const { quickClient } = require('../../../apollo/client');
const { compound } = require('../../../utils/compound');

const rewardPool = '0x2Ec1Be1dceA5c9fB040419DEDA55B1aC39e9387f';
const oracleId = 'PSHARE';
const oracle = 'tokens';
const DECIMALS = '1e18';
const secondsPerBlock = 1;
const secondsPerYear = 31536000;

const liquidityProviderFee = 0.0025;
const beefyPerformanceFee = 0.045;
const shareAfterBeefyPerformanceFee = 1 - beefyPerformanceFee;

const getPolypegsLpApys = async () => {
  let promises = [];
  const tokenPrice = await fetchPrice({ oracle, id: oracleId });

  pools.forEach(pool => promises.push(getPoolApy(rewardPool, pool)));
  const farmAprs = await Promise.all(promises);

  const pairAddresses = pools.map(pool => pool.address);
  console.log('pairAddresses', pairAddresses);
  // const pairAddresses = pools.map(pool => pool.address);
  // const tradingAprs = await getTradingFeeApr(quickClient, pairAddresses, liquidityProviderFee);
  // const tradingAprs = await getTradingFeeApr(quickClient, pairAddresses, SPOOKY_LPF);
  // const yearlyTradingFees = await getYearlyJoePlatformTradingFees(joeClient, liquidityProviderFee);
  //const yearlyTradingFees = await getYearlyPlatformTradingFees(quickClient, liquidityProviderFee);
  // const totalStakedInQUickUsd = getTotalLpStakedInUsd(rewardPool, pool, pool.chainId);
  const tradingAprs = getTradingFeeApr(quickClient, pairAddresses, liquidityProviderFee);

  //  const tradingAprs = await getTradingFeeAprSushi(quickClient, pairAddresses, liquidityProviderFee);

  // console.log('pools', tradingAprs);
  return getApyBreakdown(pools, tradingAprs, farmAprs, liquidityProviderFee);
};

const getPoolApy = async (rewardPool, pool) => {
  const [yearlyRewardsInUsd, totalStakedInUsd] = await Promise.all([
    getYearlyRewardsInUsd(rewardPool, pool.poolId),
    getTotalLpStakedInUsd(rewardPool, pool, pool.chainId),
  ]);
  console.log('totalStakedInUsd pool: ', pool.poolId, Number(totalStakedInUsd));
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
  console.log('yearlyRewardsInUsd pool: ', poolId, Number(yearlyRewardsInUsd));

  return yearlyRewardsInUsd;
};

module.exports = getPolypegsLpApys;
