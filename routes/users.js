const router = require('express').Router();

const { getMe, updateUser } = require('../controllers/users');
const { validationUpdateUser } = require('../middlewares/validations');

router.get('/me', getMe);

router.patch('/me', validationUpdateUser, updateUser);

module.exports = router;
