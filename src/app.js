const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const funciones = require('./files/funciones');
require('./helpers/helpers');


const dirNodeModules = path.join(__dirname, '../node_modules');
app.use('/css', express.static(dirNodeModules + '/bootstrap/dist/css'));
app.use('/js', express.static(dirNodeModules + '/jquery/dist'));
app.use('/js', express.static(dirNodeModules + '/popper.js/dist'));
app.use('/js', express.static(dirNodeModules + '/bootstrap/dist/js'));


const directoriopublico = path.join(__dirname, '../public');
app.use(express.static(directoriopublico));

const directoriopartials = path.join(__dirname, '../templates/partials');
hbs.registerPartials(directoriopartials);

app.use(bodyParser.urlencoded({ extended: false }))
app.set('views', './templates/views/')
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
  res.render('index', {
    titulo: 'Inicio'
  });
});

app.get('/registrarusuario', (req, res) => {
  res.render('registrarusuario');
});

app.post('/registrarusuario', (req, res) => {
  res.render('registrouser', {
    identificacion: Number(req.body.identificacion),
    nombre: req.body.nombre,
    correo: req.body.correo,
    telefono: req.body.telefono,
    rol: Number(1),
    pass: req.body.pass
  });
});

app.post('/iniciarsesion', (req, res) => {
  var user = funciones.validarLogin(req.body.identificacion, req.body.pass);
  if (user != false) {

    if (user.rol == 1) {
      res.render('vercursosactivos', {
        usuario: user
      });
    } else {
      res.render('vercursos', {
        usuario: user
      });
    }
  } else {
    res.render('index', {
      message: "El usuario no existe actualmente"
    })
  }
});

app.get('/listado', (req, res) => {
  res.render('listado', {
    titulo: 'Listado'
  });
});

app.get('/crearcursos', (req, res) => {
  res.render('crearcursos', {
    titulo: 'Crear Curso'
  });
});

app.get('/vercursosactivos', (req, res) => {
  res.render('vercursosactivos');
});

app.get('/vercursos', (req, res) => {
  res.render('vercursos');
});

app.get('/matricular', (req, res) => {
  res.render('matricular');
});

app.post('/matricular', (req, res) => {
  console.log(req.body)
  var mensaje = funciones.matricularAspirante(req.body.identificacion, req.body.curso);
  res.render('matricular', {
    message: mensaje
  });
});


app.post('/crearcursos', (req, res) => {
  var mensaje = funciones.crearCurso(Number(req.body.id), req.body.nombre, req.body.descripcion, Number(req.body.valor), Number(req.body.modalidad), Number(req.body.horas), 1)

  res.render('crearcursos', {
    message: mensaje
  });
});

app.get('/inscritos', (req, res) => {
  res.render('inscritos');
});

app.post('/cambiarestado', (req, res) => {
  funciones.cambiarEstadoCurso(req.body.curso)
  res.render('inscritos', {
    message: "Estado del curso cambiado a cerrado"
  });
});

app.get('/eliminaraspirantes', (req, res) => {
  res.render('eliminaraspirantes');
});

app.post('/eliminaraspirantes', (req, res) => {
  funciones.eliminarAspirante(req.body.identificacion, req.body.curso);
  res.render('verinscritos', {
    message: "Aspirante eliminado exitosamente",
    curso: req.body.curso
  });
});


app.get('/actualizar', (req, res) => {
  res.render('actualizar');
});

app.post('/actualizar', (req, res) => {
  var user = funciones.obtenerUsuario(req.body.identificacion);
  if (user == false) {
    res.render('actualizar', {
      message: "No se encontró el usuario"
    });
  } else {
    res.render('actualizarusuario', {
      identificacion: user.identificacion,
      nombre: user.nombre,
      correo: user.correo,
      telefono: user.telefono,
      rol: user.rol
    });
  }
});


app.post('/actualizarusuario', (req, res) => {
  funciones.actualizarUsuario(Number(req.body.identificacion), req.body.nombre, req.body.correo, req.body.telefono, Number(req.body.rol));
  var user = funciones.obtenerUsuario(req.body.identificacion);
  res.render('actualizarusuario', {
    identificacion: user.identificacion,
    nombre: user.nombre,
    correo: user.correo,
    telefono: user.telefono,
    rol: user.rol,
    message: "Informacion actualizada correctamente"
  });
});


app.get('/buscarcursos', (req, res) => {
  res.render('buscarcursos');
});

app.post('/buscarcursos', (req, res) => {
  res.render('miscursos', {
    identificacion: req.body.identificacion
  });
});

app.post('/cancelarinscripcion', (req, res) => {
  funciones.eliminarAspirante(req.body.identificacion, req.body.curso);
  res.render('miscursos', {
    identificacion: req.body.identificacion,
    message: "Cancelacion exitosa"
  });
});

app.get('*', (req, res) => {
  res.render('error', {
    estudiante: "error"
  });
})

app.listen(3001, () => {
  console.log("Server en puerto 3001")
})