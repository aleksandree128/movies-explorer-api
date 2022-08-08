const movie = require('../models/movie');
const NotFoundError = require('../code_errors/notFound-errors');
const ForbiddenError = require('../code_errors/forbidden-errors');
const BadRequstError = require('../code_errors/req-errors');

const getMovies = (req, res, next) => {
  movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

const creatMovie = (req, res, next) => {
  const owner = req.user._id;

  movie.create({ owner, ...req.body })
    .then((movies) => res.send(movies))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequstError('Введенные данные некорректны'));
        return;
      }
      next(err);
    });
};

async function deleteMovie(req, res, next) {
  movie.findById(req.params.movieId)
    .then((movies) => {
      if (!movies) {
        throw new NotFoundError('Фильм не найден');
      }
      if (movies.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Недостаточно прав для удаления фильма');
      }
      movie.findByIdAndRemove(req.params.movieId)
        .then(() => res.send(movies))
        .catch(next);
    })
    .catch(next);
}

module.exports = {
  creatMovie,
  getMovies,
  deleteMovie,
};
