import * as Joi from 'joi';

export const JoiValidation = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'staging', 'production')
    .default('development'),
  PORT: Joi.number().port().default(3333),
  DATABASE_URL: Joi.string().required(),

  BASE_ENDPOINT: Joi.string().required(),

  COIN_GECKO_ENDPOINT: Joi.string().required(),
  COIN_GECKO_API_VERSION: Joi.string().required(),
  COIN_GECKO_API_URL: Joi.string().required(),
  COIN_GECKO_API_KEY: Joi.string().required(),
});
