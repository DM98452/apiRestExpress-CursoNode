const inicioDebug = require('debug')('app:inicio');
const dbDebug = require('debug')('app:database');

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const logger = require('./logger.js')
const aute = require('./autenticater.js')
const morgan = require('morgan')
const config = require('config')
const usuarios = require('./routes/usuario.js')
// configuracion de entorno


console.log('Aplication:', config.get('nombre'))
console.log('BDD:', config.get('configDB.host'))

// get userID ,  importante para la migracion 
const os = require('os');

// Get the logged-in Windows username
const username = os.userInfo().username;

console.log(`Logged-in user: ${username}`);

// *****************
// *  Middlewares
// *****************
app.use(logger)
app.use(aute)

console.log("AMBIENTE " , app.get('env'))

// middieware logger morgan (de 3ros porque tuve que instalarlo(

if (app.get('env') === 'development') {
  console.log('dentro')
  app.use(morgan('tiny'));
  inicioDebug('Mogan esta Habilitado.')

}

dbDebug('Conctando con la')

// pare recibir querystring moddleware
app.use(express.urlencoded({ extend: true }));
// para recibir json middleware
app.use(express.json());

// para recibir algo estatico
app.use(express.static('public'))

// cada vez que reciba /api/usuarios -> usar la importacion de usuarios
app.use('/api/usuarios', usuarios)

// *****************
// * Fin  Middlewares
// *****************




app.listen(port, () => {
  console.log("escuchando en el puerto ", port);
});

app.get("/", (req, res) => {
  res.send("hola mundo desde express");
}); // peticion

/*
app.get( '/api/usuarios', (req,res ) =>
{
    res.send([1,2,3,4]);
}); // peticion
*/
app.get("/api/usuarios", (req, res) => {
  res.send(usuarios);
}); // peticion

