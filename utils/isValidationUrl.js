const validator = require('validator');
const BadRequest = require('../errors/BadRequest');

module.exports.isValidationUrl = (url) => {
  if (!validator.isURL(url)) {
    throw new BadRequest('Некорректная ссылка');
  }
  return url;
};
