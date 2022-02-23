const errores = [
     {
          status: false,
          number: 1,
          message: 'error query',
          details: 'Hay algo mal en la query',
     },
     {
          status: 'error',
          number: 2,
          message: 'Las credenciales son incorrectas',
          details: 'Revise su clave y contraseña',
     },
     {
          status: 'error',
          number: 3,
          message: '',
          details: '',
     }
];

module.exports = errores;