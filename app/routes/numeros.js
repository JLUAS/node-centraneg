const express = require('express')
const router = express.Router()
const { validateUserRole } = require('../validators/users')
const { insertarNuevosNumeros, getNumbers } = require('../controllers/numeros')

router.post('/insertarNuevosNumeros/admin',validateUserRole , insertarNuevosNumeros)

router.get('/getNumbers/admin',validateUserRole(['admin']), getNumbers)

module.exports = router