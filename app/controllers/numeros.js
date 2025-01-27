const fs = require('fs');
const path = require('path')
const XlsxPopulate = require('xlsx-populate');
const pool = require('../config/mysql'); // Importa el pool de conexiones

const getNewNumbers = async (req, res) => {
  console.log("new")
  const query = 'SELECT * FROM NuevosNumerosTest';

  pool.query(query, (err, users) => {
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

const getContactedNumbers = async (req, res) => {
  console.log("contacted")
  const query = 'SELECT * FROM NumerosContactadosTest';

  pool.query(query, (err, users) => {
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

const getInaccessibleNumbers = async (req, res) => {
  const query = 'SELECT * FROM NumerosInaccesiblesTest';

  pool.query(query, (err, users) => {
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

const getTimeUsed = async (req, res) => {
  const query = 'SELECT SUM(tiempo) AS totalTime FROM NumerosContactadosTest';
  pool.query(query, (err, results) => {
    if (err) {
      console.error('Error al recuperar el tiempo total de la base de datos:', err);
      return res.status(500).send('Error al obtener el tiempo total');
    }

    const totalTime = results[0].totalTime || 0; // Si no hay resultados, retorna 0.
    res.json({ totalTime });
  });
};

const insertNewNumber = async (req, res) => {
  const filePath = path.join(__dirname, '../public', req.file.filename); // Ruta del archivo temporal

  try {
    // Leer el archivo Excel
    const workbook = await XlsxPopulate.fromFileAsync(filePath);
    const sheet = workbook.sheet(0);
    const usedRange = sheet.usedRange();
    const data = usedRange.value();
    const headers = data[0];

    // Validar encabezados
    if (!headers.includes('nombre') || !headers.includes('numero')) {
      return res.status(400).send('El archivo debe contener las columnas "nombre" y "numero".');
    }

    // Procesar cada fila
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const nombre = row[headers.indexOf('nombre')];
      const numero = row[headers.indexOf('numero')];

      const query = `INSERT INTO NuevosNumerosTest (nombre, numero) VALUES (?, ?)`;

      await new Promise((resolve, reject) => {
        pool.query(query, [nombre, numero], (err, result) => {
          if (err) {
            console.error(`Error al insertar fila ${i}:`, err);
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    }

    res.status(200).send({upload:true});
  } catch (error) {
    console.error('Error procesando el archivo:', error);
    res.status(500).send('Ocurrió un error al procesar el archivo');
  } finally {
    // Eliminar archivo después de procesarlo
    fs.unlink(filePath, (err) => {
      if (err) console.error('Error al eliminar el archivo:', err);
    });
  }
}

const deleteNumber = (tableName) => async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).send('El ID es requerido');
  }

  const checkQuery = `SELECT id FROM ${tableName} WHERE id = ?`;
  const deleteQuery = `DELETE FROM ${tableName} WHERE id = ?`;

  pool.query(checkQuery, [id], (err, results) => {
    if (err) {
      console.error(`Error verificando en la tabla ${tableName}:`, err);
      return res.status(500).send(`Error verificando el registro en ${tableName}`);
    }

    if (results.length === 0) {
      return res.status(404).send(`El registro con ID ${id} no existe en la tabla ${tableName}`);
    }

    pool.query(deleteQuery, [id], (err) => {
      if (err) {
        console.error(`Error eliminando en la tabla ${tableName}:`, err);
        return res.status(500).send(`Error eliminando el registro en ${tableName}`);
      }

      res.status(200).send(`Registro eliminado exitosamente de ${tableName}`);
    });
  });
};

module.exports = { insertNewNumber, getNewNumbers, getContactedNumbers, getInaccessibleNumbers, getTimeUsed, deleteNumber }