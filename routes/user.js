const router = require('express').Router();

const { getUserI, getUsers } = require('../controllers/users');
const { validationUpdateUser } = require('../middlewares/validations');

router.get('/me', getUserI);

router.patch('/me', validationUpdateUser, getUsers);

module.exports = router;
