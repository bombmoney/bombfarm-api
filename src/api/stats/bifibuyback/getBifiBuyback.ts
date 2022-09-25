import { BlockApiResponse, ERC20TxApiResponse } from './etherscanApiResponseTypes';

import BigNumber from 'bignumber.js';
import fetch from 'node-fetch';
import { addressBook } from '../../../../packages/address-book/address-book';

import fetchPrice from '../../../utils/fetchPrice';
import { getUtcSecondsFromDayRange } from '../../../utils/getUtcSecondsFromDayRange';
import { getEDecimals } from '../../../utils/getEDecimals';
import { etherscanApiUrlMap } from './etherscanApiUrlMap';
import { bifiLpMap } from './bifiLpMap';
import { bscWeb3 as web3 } from '../../../utils/web3';
const PhubfeedistributorABI = require('../../../abis/PhubfeedistributorABI.json');

const INIT_DELAY = 40 * 1000;
const REFRESH_INTERVAL = 15 * 60 * 1000;

export interface DailyBifiBuybackStats {
  buybackTokenAmount: BigNumber;
  buybackUsdAmount: BigNumber;
}

const getOneDayBlocksFromEtherscan = async (scanUrl: string, apiToken: string) => {
  const [start, end] = getUtcSecondsFromDayRange(0, 1);
  const startBlock = await getBlockFromEtherscan(scanUrl, start, apiToken);
  const endBlock = await getBlockFromEtherscan(scanUrl, end, apiToken);
  return [startBlock, endBlock];
};

const getBlockFromEtherscan = async (scanUrl: string, timestamp: number, apiToken?: string) => {
  const token = apiToken ? apiToken : 'YourApiKeyToken';
  const url = `${scanUrl}/api?module=block&action=getblocknobytime&timestamp=${timestamp}&closest=after&apikey=${token}`;
  const resp = await fetch(url);
  const json: BlockApiResponse = await resp.json();
  return json.result;
};

const getBuyback = async (
  chainName: string,
  scanUrl: string,
  apiToken: string,
  PHUB: any, // TODO type this with brknrobot's address book types, once merged
  bifiMaxiAddress: string,
  bifiLpAddress: string
): Promise<{ [key: string]: BigNumber }> => {
  let bifiBuybackTokenAmount = new BigNumber(0);
  const [startBlock, endBlock] = await getOneDayBlocksFromEtherscan(scanUrl, apiToken);
  const url = `${scanUrl}/api?module=account&action=tokentx&address=${bifiMaxiAddress}&startblock=${startBlock}&endblock=${endBlock}&sort=asc&apikey=${apiToken}`;
  const resp = await fetch(url);
  const json: ERC20TxApiResponse = await resp.json();
  let txCount = 0;
  for (const entry of json.result) {
    // actually should use the lp pool data here instead of address-book. Will change after converging address-book and api
    if (entry.from === bifiLpAddress.toLowerCase()) {
      const tokenAmount = new BigNumber(entry.value).dividedBy(getEDecimals(18));
      bifiBuybackTokenAmount = bifiBuybackTokenAmount.plus(tokenAmount);
      txCount += 1;
    }
  }
  console.log(`Harvest count: ${txCount}`);
  return { [chainName]: bifiBuybackTokenAmount };
};

let dailyBifiBuybackStats: DailyBifiBuybackStats | undefined = undefined;

const updateBifiBuyback = async () => {
  console.log('> updating bifi buyback');

  try {
    let promises = [];

    const chainNames = Object.keys(etherscanApiUrlMap);

    chainNames.forEach(chainName => {
      const { url, apiToken } = etherscanApiUrlMap[chainName];
      const lp = bifiLpMap[chainName];
      const chainAddressBook = addressBook[chainName];
      const chainBIFI = chainAddressBook.PHUB;
      const chainBifiMaxi = '0xa9def29db63ef56e1aee4a695109911dded8c644';
      const prom = getBuyback(chainName, url, apiToken, chainBIFI, chainBifiMaxi, lp);
      promises.push(prom);
    });

    const bifiPrice = await fetchPrice({ oracle: 'tokens', id: 'PHUB' });

    const results = await Promise.allSettled<{ [key: string]: BigNumber }[]>(promises);
    let dailyBifiBuybackAmountByChain: { [key: string]: BigNumber } = {};
    for (const result of results) {
      if (result.status !== 'fulfilled') {
        console.warn('getBifiBuyback error', result.reason);
        continue;
      }

      dailyBifiBuybackAmountByChain = { ...dailyBifiBuybackAmountByChain, ...result.value };
    }

    for (const key in dailyBifiBuybackAmountByChain) {
      const buybackTokenAmount = dailyBifiBuybackAmountByChain[key];
      const buybackUsdAmount = buybackTokenAmount.times(new BigNumber(bifiPrice));
      let buybackTotalBoughtAmount;
      if (key === 'bsc') {
        const phubfeedistributorContract = new web3.eth.Contract(
          PhubfeedistributorABI,
          '0xa9def29db63ef56e1aee4a695109911dded8c644'
        );
        const balance = await phubfeedistributorContract.methods.totalBought().call({});
        const digits = 18;
        let adjustedBalance = balance / Math.pow(10, digits);
        if (adjustedBalance < 0) {
          adjustedBalance = 0;
        }

        buybackTotalBoughtAmount = adjustedBalance;
      } else {
        buybackTotalBoughtAmount = 0;
      }
      dailyBifiBuybackStats = {
        ...dailyBifiBuybackStats,
        [key]: {
          buybackTokenAmount,
          buybackUsdAmount,
          buybackTotalBoughtAmount,
        },
      };
    }

    console.log('> updated bifi buyback');
  } catch (err) {
    console.error('> bifi buyback initialization failed', err);
  }

  setTimeout(updateBifiBuyback, REFRESH_INTERVAL);
};

setTimeout(updateBifiBuyback, INIT_DELAY);

export const getBifiBuyback = (): DailyBifiBuybackStats | undefined => {
  return dailyBifiBuybackStats;
};
