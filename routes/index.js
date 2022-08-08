const router = require('express').Router();
const { createUser, getlogin } = require('../controllers/users');
const NotFoundError = require('../code_errors/notFound-errors');
const auth = require('../middlewares/auth');
const { validationCreateUser, validationLogin } = require('../middlewares/validations');
const userRoutes = require('./user');
const movieRoutes = require('./movie');

router.post('/signup', validationCreateUser, createUser);

router.post('/signin', validationLogin, getlogin);

router.use('/users', auth, userRoutes);
router.use('/movies', auth, movieRoutes);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Неправильный путь. Error 404'));
});

module.exports = router;
