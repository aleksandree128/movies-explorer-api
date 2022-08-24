const router = require('express').Router();

const { getMovies, creatMovie, deleteMovie } = require('../controllers/movies');
const { validationCreateMovie, validationDeleteMovie } = require('../middlewares/validations');

router.get('/', getMovies);

router.post('/', validationCreateMovie, creatMovie);

router.delete('/:movieId', validationDeleteMovie, deleteMovie);

module.exports = router;
