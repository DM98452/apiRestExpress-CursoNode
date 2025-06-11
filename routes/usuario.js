const express = require('express')
const joi = require("@hapi/joi");


/* crear router */
const ruta = express.Router();


const usuarios = [
  { id: 1, nombre: "Mariano" },
  { id: 2, nombre: "Anna" },
  { id: 3, nombre: "Jose" },

];


// todos los get, post , van al raiz porque ya se recibe todo desde la peticion cuando se invoca en app.js

ruta.get("/:id/:id2", (req, res) => {
  let usuario = usuarios.find((u) => u.id === parseInt(req.params.id));
  if (!usuario) {
    res.status(404).send("no encontrado");
  } else {
    res.status(200).send(usuario);
  }
}); // peticion

ruta.get("/:id", (req, res) => {
  let usuario = usuarios.find((u) => u.id === parseInt(req.params.id));
  if (!usuario) {
    res.status(404).send("no encontrado");
  } else {
    res.status(200).send(usuario);
  }
}); // peticion


ruta.get("/", (req, res) => {
    res.status(200).send(usuarios);
  
}); // peticion



ruta.post("/", (req, res) => {
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

ruta.put("/:id", (req, res) => {
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


ruta.delete("/:id", (req, res) => {
  let usuario = existeUsuario(parseInt(req.params.id));
  if (!usuario) {
    res.status(404).send("no encontrado");
    return;
  }
  const index = usuarios.indexOf(usuario)

  usuarios.splice(index, 1);
  res.send(usuarios);
  

});

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

module.exports=ruta