import { registerAs } from '@nestjs/config';
type INodeEnv = 'development' | 'staging' | 'production';
type IEnvConfig = {
  NODE_ENV: INodeEnv;
  BASE_ENDPOINT: string;

  JWT_SECRET: string;

  // COIN_GECKO_ENDPOINT: string;
  // COIN_GECKO_API_VERSION: string;
  COIN_GECKO_API_URL: string;
  COIN_GECKO_API_KEY: string;
};

type PrefixedKeys<T, Prefix extends string> = {
  [K in keyof T & string as `${Prefix}${K}`]: T[K];
};

export type EnvConfigProps = PrefixedKeys<IEnvConfig, 'envConfig.'>;

const envConfigObject = registerAs<IEnvConfig>('envConfig', (): IEnvConfig => {
  return {
    NODE_ENV: process.env.NODE_ENV as INodeEnv,
    BASE_ENDPOINT: process.env.BASE_ENDPOINT,

    JWT_SECRET: process.env.JWT_SECRET,

    // COIN_GECKO_ENDPOINT: process.env.COIN_GECKO_ENDPOINT,
    // COIN_GECKO_API_VERSION: process.env.COIN_GECKO_API_VERSION,
    COIN_GECKO_API_URL: process.env.COIN_GECKO_API_URL,
    COIN_GECKO_API_KEY: process.env.COIN_GECKO_API_KEY,
  };
});
console.log('🚀 ENV CONFIGURATION', envConfigObject());

export { envConfigObject };
