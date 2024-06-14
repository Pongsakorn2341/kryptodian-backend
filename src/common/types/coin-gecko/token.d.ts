export type IGeckoTokenResponse = {
  data: IGeckoToken;
};

export type IGeckoToken = {
  id: string;
  type: 'token';
  attributes: {
    address: string;
    name: string;
    symbol: string;
    image_url: string;
    coingecko_coin_id: string;
    decimals: number;
    total_supply: string;
    price_usd: string;
    fdv_usd: string;
    total_reserve_in_usd: string;
    volume_usd: {
      h24: string;
    };
    market_cap_usd: string;
  };
};
