// l1: NumeroLibros NumeroLibrerias NumeroDias
// l2: Score de cada libro
// numero de librerias Segmentos de dos lineas:
// s1: NUmeroLibrosEnLibreria NumeroDiasParaTerminarElSignUp NumeroLibrosQueSePuedenEscanearPorDia
// s2: NumeroLibrosEnLibreria que contiene las ids

const readline = require('readline')
const fs = require('fs')

let lineas = []

function leerFichero(filename) {
  return new Promise((res, rej) => {
    try {
        var text = [];
        var readInterface = readline.createInterface({
            input: fs.createReadStream(filename),
            terminal: false
        });

        readInterface
            .on('line', function (line) {
                line = line.trim();
                text.push(line);
            })
            .on('close', function () {
                res(text);
            });
    } catch(err){
        rej(err)
    }
});
}

function escribirSalida(lineas, filename) {
  console.log('Escribiendo en el fichero: ', filename)
  let wstream = fs.createWriteStream(`${filename}`)

  // Write number of slides
  wstream.write(lineas.length + '\n')

  // Write each slide
  lineas.forEach(s => {
    wstream.write('hola')
  })

  wstream.end()
}

async function main(){
  var fichero = await leerFichero('./input/a_example.txt')
  console.log(fichero)
}

main()

