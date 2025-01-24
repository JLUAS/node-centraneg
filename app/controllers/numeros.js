const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { httpError } = require('../helpers/handleError')
const pool = require('../config/mysql'); // Importa el pool de conexiones

const getNumbers = async (req, res) => {
  console.log("Numbers")
    const query = 'SELECT * FROM NuevosNumeros';
  
    pool.query(query,(err, users) => {
      if (err) {
        console.error('Error al recuperar los numeros de la base de datos:', err);
        return res.status(500).send('Error al obtener los numeros');
      }

      if (users.length === 0) {
        return res.status(404).send('No se encontraron numeros');
      }
  
      // Enviar los datos de los usuarios como respuesta en formato JSON
      res.json(users);
    });
}

const insertarNuevosNumeros = async (req, res) => {
    const { nombre, numero } = req.body;
    // Verificar que los datos están presentes
    if (!nombre || !numero) {
      return res.status(400).send('Faltan datos obligatorios');
    }

    pool.getConnection((err, connection) => {
      if (err) return res.status(500).send('Error al conectar con la base de datos');
  
      connection.query('INSERT INTO NuevosNumeros (nombre, numero) VALUES (?, ?)', [nombre, numero], (err, results) => {
        if (err) {
          connection.release();
          return res.status(500).send('Error en la consulta');
        }
        return res.status(200).send({inserted:true})
      });
    });
}
 
const deleteAdmin = async (req, res) => {
  const { id } = req.body;
  const query = `DELETE FROM users WHERE id = ?`;

  pool.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error borrando usuario:', err);
      return res.status(500).send('Error borrando usuario');
    }else{
      res.status(200).send('Usuario eliminado');
    }
  });
}

module.exports = { insertarNuevosNumeros, getNumbers }