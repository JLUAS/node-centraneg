const { check } = require('express-validator'); // Importación correcta
const { validateResult } = require('../helpers/validateHelper');

const validateCreateNumber = [
    check('nombre')
        .exists().withMessage('El nombre es requerido') 
        .isLength({ min: 3 }).withMessage('El nombre debe tener minimo tres caracteres'),
    check('numero')
        .exists().withMessage('El numero es requerido')
        .isLength({ min: 12 }).withMessage('El numero debe tener 12 numeros'),
    (req, res, next) => {
        validateResult(req, res, next); // Llama al helper para procesar resultados
    }
];

module.exports = { validateCreateNumber }