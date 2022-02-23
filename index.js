const { response } = require('express');
const { Client } = require('pg');
const errores = require('./errores.js');

const express = require('express');
const { password } = require('pg/lib/defaults');
const app = express();
const port = 9000;

//Configurando la base de datos postgresql
const pgConexion = new Client({
     user: 'postgres', 
     password: 'root', 
     database: 'bancomex',
     port: '5432', 
     host: 'localhost',
});

//Conectamos la base de datos
try {
     pgConexion.connect();
     console.log('Conexión exitosa!') 
} catch (error) {
     console.error(error);
}

//colocar para recibir datps
app.use( express.json() );
app.use( express.urlencoded( ({ extended:true })));

app.listen( port, () => {
     console.log(`El servidor está activo en el puerto ${ port }`);
});

//RUTAS **
app.get( '/', (req, res) => {
     res.sendFile('login.html', {root: __dirname});

 } );

 app.post( '/login', ( req, res ) => {

     const { clave, password } = req.body;
     const sqlQuery = `SELECT p.nombre FROM  ejecutivos e JOIN puestos p ON e.id_puesto = p.id_puesto WHERE clave = '${clave}' AND password = '${password}'`;
     
     pgConexion.query(sqlQuery, (err, result) => {
          
          if (err) {
               return res.send( errores[0] );
          }

          if (result.rowCount === 1) {
               const puesto = result.rows[0];
               const { nombre } = puesto;
               res.send( { status: true, puestoUsuario : nombre } );

          } else {
               res.send( errores[1] );
          }   
     });

 });

 app.post('/registrarGerente', ( req, res ) => {

     const { nombre, apellido, clave, password, id_sucursal, id_puesto, id_area, psw } = req.body;
     const passwordPermiso = 'abc579fw2';

     if (psw !== passwordPermiso) return res.send({ err: 'no hay permisos para realizar esta acción'});
    


     //const bandera = buscarClave( clave );
     //BUSCAR SI EXISTE LA CLAVE PORQUE DEJA REGISTRAR CLAVES REPETIDAS
     //if ( !bandera ) return res.send({ err: 'Se repitieron claves' }); 

     //si coloca correctamente la contraseña de permiso, se hace la query
     const querySQL = `INSERT INTO public.ejecutivos(
           nombre, apellido, clave, password, status, id_sucursal, id_puesto, id_area)
          VALUES ('${nombre}', '${apellido}', ${clave}, '${password}', 'activo', ${id_sucursal}, ${id_puesto}, ${id_area});`;

     pgConexion.query( querySQL, (err, result) => {
          
          if (err) {
               console.log(err);
               return res.send( errores[0] );

          }

          res.send( { message: "El gerente se ha registrado correctamente" } );
     });
 });

 async function buscarClave( clave ) {
     const sqlQuery = `SELECT * FROM  ejecutivos WHERE clave = ${clave}`;
     let resultado;
     
     pgConexion.query(sqlQuery, (err, result) => {
          
          if (err) {
               resultado = false;
          }

          console.log(result.rowCount);
          if (result.rowCount == 0) {
               resultado = true;
          } 

          resultado = false;
     });

     return resultado;
 }

 //console.log(buscarClave('12345'))

