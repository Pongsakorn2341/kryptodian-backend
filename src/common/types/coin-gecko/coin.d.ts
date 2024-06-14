export type IGeckoCoin = {
  id: string;
  symbol: string;
  name: string;
  platforms: {
    [key: string]: string;
  }[];
};
