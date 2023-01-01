// make sure to sure https://api.* url. The endpoint for api data is different than for the UI data
// i.e, for https://bscscan.com, use https://api.bscscan.com

export const etherscanApiUrlMap = {
  bsc: {
    url: 'https://api.bscscan.com',
    apiToken: 'YWA6YXGBRV3279EMVUPICMWR5TZC1K4UUC',
  },
  avax: {
    url: 'https://api.snowtrace.io',
    apiToken: 'RAQVQ1H9766QWV3JYF49CCYCB6WAK8STVB',
  },
  bomb: {
    url: 'https://bombscan.com',
  },
  // arbitrum: {
  //   url: 'https://api.arbiscan.io',
  //   apiToken: 'QR9KETWZEU64T1TQN4V8VD7H6HIE3X95UW',
  // },
} as const;
