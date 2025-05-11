const app = require('./src/app'); //iene las instrucciones para usar Express, como si estuviera armando un restaurante

require('dotenv').config();  // .env, donde puedes guardar información importante como el puerto o contraseñas.

const PORT = process.env.PORT || 3000;

app.listen(PORT,() =>{
    console.log(`servidor corriendo en http://localhost:${PORT}`);
});
