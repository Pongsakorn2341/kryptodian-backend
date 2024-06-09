import { registerAs } from '@nestjs/config';
type INodeEnv = 'development' | 'staging' | 'production';
type IEnvConfig = {
  NODE_ENV: INodeEnv;
};

type PrefixedKeys<T, Prefix extends string> = {
  [K in keyof T & string as `${Prefix}${K}`]: T[K];
};

export type EnvConfigProps = PrefixedKeys<IEnvConfig, 'envConfig.'>;

const envConfigObject = registerAs<IEnvConfig>('envConfig', (): IEnvConfig => {
  return {
    NODE_ENV: process.env.NODE_ENV as INodeEnv,
  };
});
console.log('🚀 ENV CONFIGURATION', envConfigObject());

export { envConfigObject };
