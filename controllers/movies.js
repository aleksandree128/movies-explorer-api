const Movie = require('../models/movie');
const NotFoundError = require('../code_errors/notFound-errors');
const ForbiddenError = require('../code_errors/forbidden-errors');
const BadRequstError = require('../code_errors/req-errors');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.creatMovie = (req, res, next) => {
  const owner = req.user._id;

  Movie.create({ owner, ...req.body })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequstError('Введенные данные некорректны'));
        return;
      }
      next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм не найден');
      }
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Недостаточно прав для удаления фильма');
      }
      Movie.findByIdAndRemove(req.params.movieId)
        .then(() => res.send(movie))
        .catch(next);
    })
    .catch(next);
};
