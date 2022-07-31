const movie = require('../models/movie');
const NotFoundError = require('../code_errors/notFound-errors');
const ForbiddenError = require('../code_errors/forbidden-errors');

const getMovies = (req, res, next) => {
  movie.find({})
    .then((movies) => res.send(movies))
    .catch((err) => next(err));
};

const creatMovie = (req, res, next) => {
  const {
    nameEN,
    nameRU,
    movieId,
    thumbnail,
    trailerLink,
    image,
    description,
    year,
    duration,
    director,
    country,
  } = req.body;
  const owner = req.user;
  return movie.create({
    nameEN,
    nameRU,
    movieId,
    thumbnail,
    trailerLink,
    image,
    description,
    year,
    duration,
    director,
    country,
    owner,
  })
    .then((newMovie) => res.send(newMovie))
    .catch((err) => next(err));
};

async function deleteMovie(req, res, next) {
  movie.findOne({ movieId: req.params.id })
    .then((thisMovie) => {
      if (!thisMovie) {
        throw new NotFoundError('Фильм не найден');
      } else if (!thisMovie.owner._id.equals(req.user._id)) {
        throw new ForbiddenError('Чужой фильм');
      }
      return movie.findByIdAndRemove(thisMovie._id)
        .then((newMovie) => {
          if (newMovie === null) {
            throw new NotFoundError('Фильм не найден');
          }
          res.send({ newMovie });
        });
    })
    .catch((err) => next(err));
}

module.exports = {
  creatMovie,
  getMovies,
  deleteMovie,
};
