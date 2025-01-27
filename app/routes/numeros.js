const express = require('express')
const router = express.Router()
const multer = require('multer');
const path = require('path');

const { validateUserRoleAdmin, validateUserRoleUser } = require('../validators/users')
const { insertNewNumber, getNewNumbers, getContactedNumbers, getInaccessibleNumbers, getTimeUsed, deleteNumber } = require('../controllers/numeros')
const { validateCreateNumber } = require('../validators/numbers')

const upload = multer({
    dest: path.join(__dirname, '../public'), // Carpeta temporal para guardar archivos
  });

router.post('/insertarNuevosNumeros/admin', validateUserRoleAdmin(['admin']),upload.single('myFile'), insertNewNumber)

router.get('/getNewNumbers/admin', validateUserRoleAdmin(['admin']), getNewNumbers)

router.get('/getContactedNumbers/admin', validateUserRoleAdmin(['admin']), getContactedNumbers)

router.get('/getInaccessibleNumbers/admin', validateUserRoleAdmin(['admin']), getInaccessibleNumbers)

router.get('/getTimeUsed/admin', validateUserRoleAdmin(['admin']), getTimeUsed)

router.post( '/deleteNumber/admin', deleteNumber);

router.get('/getContactedNumbers/user', validateUserRoleUser(['user']), getContactedNumbers)

module.exports = router