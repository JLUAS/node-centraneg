const express = require('express')
const router = express.Router()
const { addUser} = require('../controllers/users')
const { validateCreateUser } = require('../validators/users')

router.post('/',validateCreateUser ,addUser)

module.exports = router