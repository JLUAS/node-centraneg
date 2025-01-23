const { check } = require('express-validator') //TODO <---
const { validateResult } = require('../helpers/validateHelper')

const validateCreateUser = [
    check('firstName')
        .exists()
        .not()
        .isLength({ min: 3 })
        .isEmpty(),
    check('middleName')
        .exists()
        .not()
        .isLength({ min: 3 })
        .isEmpty(),
    ,
    check('lastName')
        .exists()
        .not()
        .isLength({ min: 3 })
        .isEmpty(),
    ,
    check('password')
        .exists()
        .not()
        .isLength({ min: 8 })
        .isEmpty(),
    ,
    check('authCode')
        .exists()
        .not()
        .isLength({ min: 8 })
        .isEmpty(),
    ,
    check('rol')
        .exists()
        .not()
        .isLength({ min:  3})
        .isEmpty(),
    ,
    check('email')
        .exists()
        .isEmail(),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

module.exports = { validateCreateUser }