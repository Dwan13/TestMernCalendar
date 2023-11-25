const express = require('express');
require('dotenv').config();
const cors = require('cors');
const {dbConnection} = require('./database/config');
//console.log(process.env.DB_CNN);

//Crear el servidor de express

const app = express();

//Base de datos
dbConnection();

//Directorio publico
app.use(express.static('public'));

// Lectura y parseo del body
app.use(express.json());

//Rutas
//todo: auth // crear, login, renew
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events') );

//TODO: CRUD: Eventos




//Escuchar Peticiones
app.listen(process.env.PORT, ()=>{
    console.log(`servidor corriendo en puerto ${process.env.PORT}`);
})