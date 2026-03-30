const Joi = require("joi");

const createErrorLogSchema = Joi.object({
  message: Joi.string().required(),
  level: Joi.string().valid("error", "warn", "info", "debug").required(),
});

module.exports = { createErrorLogSchema };