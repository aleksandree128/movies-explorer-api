const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMovies, creatMovie, deleteMovie,
} = require('../controllers/movies');

router.get('/movies', getMovies);

router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2),
    director: Joi.string().required().min(2),
    duration: Joi.number().required(),
    year: Joi.number().required(),
    description: Joi.string().required().min(2),
    image: Joi.string().required().pattern(/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.,~#?&//=!]*$)/),
    trailerLink: Joi.string().required().pattern(/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.,~#?&//=!]*$)/),
    thumbnail: Joi.string().required().pattern(/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.,~#?&//=!]*$)/),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required().min(2),
    nameEN: Joi.string().required().min(2),

  }),
}), creatMovie);

router.delete('/movies/:Id', celebrate({
  params: Joi.object().keys({
    Id: Joi.number().required(),
  }),
}), deleteMovie);

module.exports.moviesRouter = router;
