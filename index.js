const readline = require('readline');
const fs = require('fs');

let lineas = [];

function leerFichero(filename) {
  const readInterface = readline.createInterface({
    input: fs.createReadStream(filename)
  });

  readInterface.on('line', function(line) {
    // Leemos todas las lineas del fichero @line es cada linea
    lineas.push(line);
    console.log(line);
  });
}

function escribirSalida(lineas, filename) {
  console.log('Escribiendo en el fichero: ', filename);
  let wstream = fs.createWriteStream(`${filename}`);

  // Write number of slides
  wstream.write(lineas.length + '\n');

  // Write each slide
  lineas.forEach((s) => {
    wstream.write('hola');
  });

  wstream.end();
}

leerFichero('a_example.in');
escribirSalida(lineas, 'exit.out');
console.log(lineas);