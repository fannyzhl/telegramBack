const express = require('express')

let router = express.Router()

router.use('/user', require('./user'));
router.use('/profile', require('./profile'));

module.exports = router;