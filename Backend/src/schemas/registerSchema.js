const Joi = require('joi');

const registerSchema = Joi.object({
    username: Joi.string().min(3).pattern(new RegExp('^[a-zA-Z0-9_]*$')).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
    .required()
    .messages({
      'string.pattern.base': 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    })
});

module.exports = registerSchema;