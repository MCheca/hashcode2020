// l1: NumeroLibros NumeroLibrerias NumeroDias
// l2: Score de cada libro
// numero de librerias Segmentos de dos lineas:
// s1: NUmeroLibrosEnLibreria NumeroDiasParaTerminarElSignUp NumeroLibrosQueSePuedenEscanearPorDia
// s2: NumeroLibrosEnLibreria que contiene las ids

// OUTPUT
// A: Numero de librerias por signup
// Las siguientes lineas son las librerias en orden que queramos que empiece el signup. Contendra:
// IDLibreria NumeroLibrosAEscanear
// IDLibrosEscanear

/*
Cosas claras: Hay que empezar por la libreria con el menor tiempo de sign up y con la mayor cantidad de libros
*/

const readline = require('readline')
const fs = require('fs')

let lineas = []

function leerFichero(filename) {
  const readInterface = readline.createInterface({
    input: fs.createReadStream(filename)
  })

  readInterface.on('line', function(line) {
    // Leemos todas las lineas del fichero @line es cada linea
    lineas.push(line)
    console.log(line)
  })
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

leerFichero('a_example.in')
escribirSalida(lineas, 'exit.out')
console.log(lineas)
