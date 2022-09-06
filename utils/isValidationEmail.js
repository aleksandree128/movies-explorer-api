const validator = require('validator');
const BadRequest = require('../errors/BadRequest');

module.exports.isValidationEmail = (email) => {
  if (!validator.isEmail(email)) {
    throw new BadRequest('Некорректная ссылка');
  }
  return email;
};
