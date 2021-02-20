const BigNumber = require('bignumber.js');
const { web3Factory } = require('./web3');
const { BSC_CHAIN_ID } = require('../../constants');
const ERC20 = require('../abis/ERC20.json');

const fetchPoolTokenBalance = async (lpAddress, tokenAddress, chainId = BSC_CHAIN_ID) => {
  const web3 = web3Factory(chainId);

  const tokenContract = new web3.eth.Contract(ERC20, tokenAddress);
  const tokenBalance = new BigNumber(await tokenContract.methods.balanceOf(lpAddress).call());

  return tokenBalance;
};

const fetchPoolUnknownTokenPrice = async (
  lpAddress,
  unknownToken,
  knownToken,
  knownTokenPricePerUnit,
  chainId = BSC_CHAIN_ID
) => {
  const knownTokenBalance = await fetchPoolTokenBalance(lpAddress, knownToken.address, chainId);
  const knownTokenTotalValue = knownTokenBalance.times(knownTokenPricePerUnit);

  const unknownTokenBalance = await fetchPoolTokenBalance(lpAddress, unknownToken.address, chainId);
  const unknownTokenPriceUnit = knownTokenTotalValue.dividedBy(unknownTokenBalance);

  return (
    (unknownTokenPriceUnit.toNumber() / Number(knownToken.decimals)) * Number(unknownToken.decimals)
  );
};

const fetchPoolTokensPrices = async (oracle, pools, knownPrices, chainId = BSC_CHAIN_ID) => {
  let prices = { ...knownPrices };
  let knownToken, unknownToken, unknownTokenPrice;
  for (const pool of [...pools].reverse()) {
    if (pool.lp0.oracle != oracle || pool.lp1.oracle != oracle) {
      continue;
    }

    if (prices.hasOwnProperty(pool.lp0.oracleId) && prices.hasOwnProperty(pool.lp1.oracleId)) {
      continue;
    }

    if (prices.hasOwnProperty(pool.lp0.oracleId) || prices.hasOwnProperty(pool.lp1.oracleId)) {
      if (prices.hasOwnProperty(pool.lp0.oracleId)) {
        knownToken = pool.lp0;
        unknownToken = pool.lp1;
      } else {
        knownToken = pool.lp1;
        unknownToken = pool.lp0;
      }
    } else {
      console.warn('No path to resolve price of tokens in LP:', pool.name, 'Skipping it.');
      console.warn('Please move leading pairs to the bottom of .json pools file');
      continue;
    }

    unknownTokenPrice = await fetchPoolUnknownTokenPrice(
      pool.address,
      unknownToken,
      knownToken,
      prices[knownToken.oracleId],
      chainId
    );

    prices[unknownToken.oracleId] = unknownTokenPrice;
  }

  return prices;
};

module.exports = {
  fetchPoolUnknownTokenPrice,
  fetchPoolTokenBalance,
  fetchPoolTokensPrices,
};
