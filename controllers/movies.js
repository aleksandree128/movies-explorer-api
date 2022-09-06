const Movies = require('../models/movies');
const BadRequest = require('../errors/BadRequest');
const Forbidden = require('../errors/Forbidden');

module.exports.getMovies = (req, res, next) => {
  Movies.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch((next));
};

module.exports.saveMovies = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movies.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.createMovie = (req, res, next) => {
  const owner = req.user._id;

  Movies.create({ owner, ...req.body })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Введенные данные некорректны'));
        return;
      }
      next(err);
    });
};

module.exports.deleteMovies = (req, res, next) => {
  const cardRemove = () => {
    Movies.findOneAndDelete({ _id: req.params._id })
      .then((movie) => {
        if (!movie) {
          throw new BadRequest('Карточка с указанным _id не найдена.');
        }
        res.send({ message: 'Карточка удалена' });
      })
      .catch(next);
  };

  Movies.findOne({ _id: req.params._id })
    .then((movie) => {
      if (!movie) {
        throw new BadRequest('Передан несуществующий _id карточки.');
      }
      if (req.user._id === movie.owner.toString()) {
        cardRemove(movie._id);
      } else {
        throw new Forbidden(
          'Карточка не содержит указанный идентификатор пользователя.',
        );
      }
    })
    .catch(next);
};
