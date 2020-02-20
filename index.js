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
const path = require('path')

let lineas = []

function leerFichero(filename) {
  return new Promise((res, rej) => {
    try {
      var text = []
      var readInterface = readline.createInterface({
        input: fs.createReadStream(filename),
        terminal: false
      })

      readInterface
        .on('line', function(line) {
          line = line.trim()
          text.push(line)
        })
        .on('close', function() {
          res(text)
        })
    } catch (err) {
      rej(err)
    }
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

let actualLibraryID = 0

class Libreria {
  constructor(l1, l2) {
    l1 = l1.split(' ')
    l2 = l2.split(' ')
    this.id = actualLibraryID++
    this.cantidadLibros = l1[0]
    this.cantidadDias = l1[1]
    this.librosPorDia = l1[1]
    this.libros = l2.split(' ')
  }
}

const main = async () => {
  let fichero = await leerFichero('./input/a_example.txt')
  console.log(fichero)
}

main()
