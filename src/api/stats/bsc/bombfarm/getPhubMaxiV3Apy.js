const BigNumber = require('bignumber.js');
const { bscWeb3: web3 } = require('../../../../utils/web3');

const IRewardPool = require('../../../../abis/IRewardPool.json');
const fetchPrice = require('../../../../utils/fetchPrice');
const { getTotalStakedInUsd } = require('../../../../utils/getTotalStakedInUsd');
const { compound } = require('../../../../utils/compound');
const { DAILY_HPY } = require('../../../../constants');

const BIFI = '0x95A6772a2272b9822D4b3DfeEaedF732F1D28DB8';
const REWARDS = '0x5a4C619B62398Ba13275c5b48a40DcaFC49B1420';
const ORACLE = 'tokens';
const ORACLE_ID = 'PHUB';
const DECIMALS = '1e18';
const BLOCKS_PER_DAY = 28800;

const getPhubMaxiV3Apy = async () => {
  const [yearlyRewardsInUsd, totalStakedInUsd] = await Promise.all([
    getYearlyRewardsInUsd(),
    getTotalStakedInUsd(REWARDS, BIFI, ORACLE, ORACLE_ID, DECIMALS),
  ]);

  const simpleApy = yearlyRewardsInUsd.dividedBy(totalStakedInUsd);
  const apy = compound(simpleApy, DAILY_HPY, 1, 1);

  return { 'bomb-phub': apy };
};

const getYearlyRewardsInUsd = async () => {
  const bnbPrice = await fetchPrice({ oracle: 'tokens', id: 'PHUB' });

  const rewardPool = new web3.eth.Contract(IRewardPool, REWARDS);
  const rewardRate = new BigNumber(await rewardPool.methods.rewardRate().call());
  const yearlyRewards = rewardRate.times(3).times(BLOCKS_PER_DAY).times(365);
  const yearlyRewardsInUsd = yearlyRewards.times(bnbPrice).dividedBy(DECIMALS);

  return yearlyRewardsInUsd;
};

module.exports = getPhubMaxiV3Apy;
