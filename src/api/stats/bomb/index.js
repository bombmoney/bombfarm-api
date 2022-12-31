const getBombswapLpApys = require('./bombfarm/getBombswapLpApys');

const getApys = [getBombswapLpApys];

const getBombApys = async () => {
  let apys = {};
  let apyBreakdowns = {};

  let promises = [];
  getApys.forEach(getApy => promises.push(getApy()));
  const results = await Promise.allSettled(promises);

  for (const result of results) {
    if (result.status !== 'fulfilled') {
      console.warn('getBombApys error', result.reason);
      continue;
    }

    // Set default APY values
    let mappedApyValues = result.value;
    let mappedApyBreakdownValues = {};

    // Loop through key values and move default breakdown format
    // To require totalApy key
    for (const [key, value] of Object.entries(result.value)) {
      mappedApyBreakdownValues[key] = {
        totalApy: value,
      };
    }

    // Break out to apy and breakdowns if possible
    let hasApyBreakdowns = 'apyBreakdowns' in result.value;
    if (hasApyBreakdowns) {
      mappedApyValues = result.value.apys;
      mappedApyBreakdownValues = result.value.apyBreakdowns;
    }

    apys = { ...apys, ...mappedApyValues };

    apyBreakdowns = { ...apyBreakdowns, ...mappedApyBreakdownValues };
  }

  return {
    apys,
    apyBreakdowns,
  };
};

module.exports = { getBombApys };

// const getBombswapLpApys = require('./bombfarm/getBombswapLpApys');

// const getApys = [
//   // get1inchLpApys,
//   // get1inchApy,
//   // getAlpacaApys,
//   // getAutoApys,
//   // getBakePoolApy,
//   // getBakeryLpApys,
//   // getBeltApys,
//   // getBhcPoolApy,
//   // getBifiGovApy,
//   // getBifiMaxiApy,
//   // getBifiMaxiV2Apy,
//   getBombswapLpApys,
//   //getBombPrices,
//   // getBtdLpApys,
//   // getBtsLpApys,
//   // getBunnyRewardsApy,
//   // getComBscApys,
//   // getDegensLpApys,
//   // getDoppleApys,
//   // getElkApys,
//   // getEllipsisLpApys,
//   // getEllipsisSingleAssetApy,
//   // getFarmheroApys,
//   // getFortressApys,
//   // getGrandLpApys,
//   // getIcarusApys,
//   // getJetswapApys,
//   // getJulLpApys,
//   // getKebabLpApys,
//   // getKebabPoolApy,
//   // getMdexBscLpApys,
//   // getMdexMdxApy,
//   // getMerlinRewardsApy,
//   // getNarLpApys,
//   // getOmnifarmApys,
//   // getOOELpApys,
//   // getMoonpotApys,
//   // getSpongeLpApys,
//   // getSpongePoolApy,
//   // getSwipeLpApys,
//   // getTenfiApys,
//   // getTosdisLpApys,
//   // getVenusApys,
//   // getWaultLpApys,
//   // getYelApys,
// ];
// // ^^ APYs are sorted alphabetically

// const getBOMBApys = async () => {
//   let apys = {};
//   let apyBreakdowns = {};

//   let promises = [];
//   getApys.forEach(getApy => promises.push(getApy()));
//   const results = await Promise.allSettled(promises);

//   for (const result of results) {
//     if (result.status !== 'fulfilled') {
//       console.warn('getBombApys error', result.reason);
//       continue;
//     }

//     // Set default APY values
//     let mappedApyValues = result.value;
//     let mappedApyBreakdownValues = {};

//     // Loop through key values and move default breakdown format
//     // To require totalApy key
//     for (const [key, value] of Object.entries(result.value)) {
//       mappedApyBreakdownValues[key] = {
//         totalApy: value,
//       };
//     }

//     // Break out to apy and breakdowns if possible
//     let hasApyBreakdowns = 'apyBreakdowns' in result.value;
//     if (hasApyBreakdowns) {
//       mappedApyValues = result.value.apys;
//       mappedApyBreakdownValues = result.value.apyBreakdowns;
//     }

//     apys = { ...apys, ...mappedApyValues };

//     apyBreakdowns = { ...apyBreakdowns, ...mappedApyBreakdownValues };
//   }

//   return {
//     apys,
//     apyBreakdowns,
//   };
// };

// module.exports = { getBOMBApys };
