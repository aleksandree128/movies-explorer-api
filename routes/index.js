const router = require('express').Router();
const { createUser, login } = require('../controllers/users');
const NotFound = require('../errors/NotFound');
const auth = require('../middlewares/auth');
const { validationCreateUser, validationLogin } = require('../middlewares/validations');
const usersRoutes = require('./users');
const movieRoutes = require('./movies');

router.post('/signup', validationCreateUser, createUser);

router.post('/signin', validationLogin, login);

router.use(auth);

router.use('/users', usersRoutes);
router.use('/movies', movieRoutes);

router.use('*', (req, res, next) => {
  next(new NotFound('Неправильный путь. Error 404'));
});

module.exports = router;
