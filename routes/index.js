const router = require('express').Router();
const { createUser, getlogin } = require('../controllers/users');
const NotFoundError = require('../code_errors/notFound-errors');
const auth = require('../middlewares/auth');
const { validationCreateUser, validationLogin } = require('../middlewares/validations');
const user = require('./user');
const movie = require('./movie');

router.post('/signup', validationCreateUser, createUser);

router.post('/signin', validationLogin, getlogin);

router.use('/users', auth, user);
router.use('/movies', auth, movie);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Неправильный путь. Error 404'));
});

module.exports = router;
