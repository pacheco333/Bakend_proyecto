// se importan las versiones de myql2 que trabajan con promesas
const mysql = require('mysql2/promise');

//importar el dotenv para manejar variables de entorno desde un archivo .env
const dotenv = require('dotenv');
//dontev permite leer varoles como usuario y contraseña de la base de datos en un  archivo .env

dotenv.config();//esta linea lee los archivos y carga sus valores

//se crera un grupo de conexiones para las consultas
//estas conexiones traen datos de la base 
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true, // espera cuando todas las conexionezs esten ocupadas
    connectionLimit: 10,  // limite de conexiones al mismo tiempo
    queueLimit: 0  // no hay limite de espera en la cola
});

// exportar el pool para yusarlo en otros archivos del proyecto
module.exports = pool;