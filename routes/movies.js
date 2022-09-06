const router = require('express').Router();

const { getMovies, createMovie, deleteMovies, saveMovies } = require('../controllers/movies');
const { validationCreateMovie, validationDeleteMovie } = require('../middlewares/validations');
const { celebrate, Joi } = require('../utils/regular');
const { isValidationUrl } = require('../utils/isValidationUrl');

router.get('/', getMovies, saveMovies);

router.post('/', validationCreateMovie, createMovie);

router.delete('/:movieId', validationDeleteMovie, deleteMovies);

module.exports = router;
