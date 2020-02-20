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

let libros // Numero de libros
let librerias // Numero de librerias
let dias // Numero dias totales
let puntuaciones

// Arrays
let arrayLibrerias = []
let arrayLibros = []

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

class Libro {
  constructor(id, score) {
    this.id = id
    this.score = score
  }
}

let actualLibraryID = 0 // Auxiliar para Libreria
class Libreria {
  constructor(l1, l2) {
    l1 = l1.split(' ')
    l2 = l2.split(' ')

    this.id = actualLibraryID++
    this.cantidadLibros = Number(l1[0])
    this.cantidadDias = Number(l1[1])
    this.librosPorDia = Number(l1[2])

    // A libros vamos subiendo objetos de Libro
    this.libros = []
    for (let libro of l2) {
      this.libros.push(arrayLibros[Number(libro)])
    }
  }
}

function getMetaData(fichero) {
  //Obtiene la primera linea
  let aux = fichero[0].split(' ')
  libros = aux[0]
  librerias = aux[1]
  dias = aux[2]

  //Obtiene la segunda linea
  puntuaciones = fichero[1].split(' ')
}

function getLibros(fichero) {
  let librosLine = fichero[1].split(' ')

  for (let i = 0; i < libros; i++) {
    arrayLibros.push(new Libro(i, librosLine[i]))
  }
}

function getLibrerias(fichero) {
  for (let i = 2; i < librerias * 2 + 1; i = i + 2) {
    arrayLibrerias.push(new Libreria(fichero[i], fichero[i + 1]))
  }
}

async function main() {
  var fichero = await leerFichero('./input/a_example.txt')
  getMetaData(fichero)
  console.log(`Numero libros: ${libros}`)
  console.log(`Numero librerias: ${librerias}`)
  console.log(`Numero dias: ${dias}`)
  console.log(`\n=========================\n`)
  getLibros(fichero)
  getLibrerias(fichero)

  console.log('Mostrando las librerias')
  for (let libreria of arrayLibrerias) {
    console.log(libreria)
  }

  console.log('\nMostrando los libros')
  for (let libro of arrayLibros) {
    console.log(libro)
  }

  let lineasSalida = []

  // Buscamos la primera libreria
  let menorLibreria = arrayLibrerias[0]
  for (let libreria of arrayLibrerias) {
    if (libreria.dias < menorLibreria.dias) {
      menor = libreria
    }
  }
}

main()
