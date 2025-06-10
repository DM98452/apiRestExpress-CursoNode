const inicioDebug = require('debug')('app:inicio');
const dbDebug = require('debug')('app:database');

const express = require("express");
const app = express();
const joi = require("@hapi/joi");
const port = process.env.PORT || 3000;
const logger = require('./logger.js')
const aute = require('./autenticater.js')
const morgan = require('morgan')
const config = require('config')
// configuracion de entorno


console.log('Aplication:', config.get('nombre'))
console.log('BDD:', config.get('configDB.host'))

// get userID ,  importante para la migracion 
const os = require('os');

// Get the logged-in Windows username
const username = os.userInfo().username;

console.log(`Logged-in user: ${username}`);


// Middlewares
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

/*
app.get( '/api/usuarios/:id/:id2', (req,res ) =>
{
   res.send(req.params);

}); // peticion

/*
app.get( '/api/usuarios/:id/:id2', (req,res ) =>
{
   res.send(req.params);

}); // peticion
*/

const usuarios = [
  { id: 1, nombre: "Mariano" },
  { id: 2, nombre: "Anna" },
  { id: 3, nombre: "Jose" },

];

app.get("/api/usuarios/:id/:id2", (req, res) => {
  let usuario = usuarios.find((u) => u.id === parseInt(req.params.id));
  if (!usuario) {
    res.status(404).send("no encontrado");
  } else {
    res.status(200).send(usuario);
  }
}); // peticion

app.post("/api/usuarios/", (req, res) => {
  const schema = joi.object({
    nombre: joi.string().min(3).max(30).required(),
  });

  const { error, value } = schema.validate({ nombre: req.body.nombre });

  if (!error) {
    const usuario = {
      id: usuarios.length + 1,
      nombre: value.nombre,
    };
    usuarios.push(usuario);
    res.send(usuarios);
  } else {
    res.status(400).send(error.details[0].message);
  }
});

// put = update

app.put("/api/usuarios/:id", (req, res) => {
  // encontrar si existe el objeto usuario
  /*
  let usuario = usuarios.find((u) => u.id === parseInt(req.params.id));
  if (!usuario) {
    res.status(404).send("no encontrado");
    return;
  }
  */
  let usuario = existeUsuario(parseInt(req.params.id));
  if (!usuario) {
    res.status(404).send("no encontrado");
    return;
  }

  const { error, value } =  validarUsuario(req.body.nombre)

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  usuario.nombre = value.nombre;
  res.send(usuarios);
});


app.delete("/api/usuarios/:id", (req, res) => {
  let usuario = existeUsuario(parseInt(req.params.id));
  if (!usuario) {
    res.status(404).send("no encontrado");
    return;
  }
  const index = usuarios.indexOf(usuario)

  usuarios.splice(index, 1);
  res.send(usuarios);
  

});


/*
app.post();// envio
app.put(); // actualizacion
app.delete(); // eliminacionnod
*/

function existeUsuario(id) {
  return usuarios.find((u) => u.id === parseInt(id));
}

function validarUsuario(nombre) {
  // recibir el parametro a updatear
  const schema = joi.object({
    nombre: joi.string().min(3).max(30).required(),
  });
  return (schema.validate({ nombre: nombre }))
  
}
