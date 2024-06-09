import * as Joi from 'joi';

export const JoiValidation = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'staging', 'production')
    .default('development'),
  DATABASE_URL: Joi.string().required(),
  PORT: Joi.number().port().default(3333),
});
