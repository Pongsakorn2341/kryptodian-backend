export type IGeckoNetworkResponse = {
  data: IGeckoNetwork[];
};

export type IGeckoNetwork = {
  id: string;
  type: 'network';
  attributes: {
    name: string;
    coingecko_asset_platform_id: string;
  };
};
