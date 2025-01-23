const bcrypt = require('bcrypt')
const { httpError } = require('../helpers/handleError')
const pool = require('../config/mysql'); // Importa el pool de conexiones


const addUser = async (req, res) => {
    const { firstName, middleName, lastName, password, authCode, rol } = req.body;
    console.log(req.body)
    const hashedPassword = await bcrypt.hash(password, 10);
    pool.getConnection((err, connection) => {
        if (err) httpError(res, err)

        connection.beginTransaction(err => {
        if (err) {
            connection.release();
            httpError(res, err)
        }

        connection.query('INSERT INTO users ( firstName, middleName, lastName, password, authCode, authenticated, rol) VALUES (?, ?, ?, ?, ?, ?, ?)', [firstName, middleName, lastName, password, authCode, authenticated, rol], (err, result) => {
            if (err) {
            connection.rollback(() => {
                connection.release();
                httpError(res, err)
            });
            } else {
            connection.commit(err => {
                if (err) {
                connection.rollback(() => {
                    connection.release();
                    res.status(200).send({isRegistered:false});
                });
                } else {
                connection.release();
                res.status(200).send({isRegistered:true});
                }
            });
            }
        });
        });
    });
}

module.exports = { addUser}