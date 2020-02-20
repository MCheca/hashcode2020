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
let arrayLibreriasB = []
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
    this.cantidadDias = Number(l1[1]) // Para el signup
    this.librosPorDia = Number(l1[2])

    // A libros vamos subiendo objetos de Libro
    this.libros = []
    for (let libro of l2) {
      this.libros.push(arrayLibros[Number(libro)])
    }

    //Ordenamos los libros de mas a menos valoracion
    this.libros.sort(this.ordenarLibros)
  }

  ordenarLibros(a, b) {
    const libroA = a.score
    const libroB = b.score

    let comparison = 0
    if (libroA < libroB) {
      comparison = 1
    } else if (libroA > libroB) {
      comparison = -1
    }
    return comparison
  }

  getSuma(Drestantes) {
    Drestantes = Drestantes - this.cantidadDias
    var suma = 0
    var numero = Drestantes * this.librosPorDia
    if (numero > this.cantidadLibros) {
      numero = this.cantidadLibros
    }

    for (var i = 0; i < numero; i++) {
      suma = suma + this.libros[i].score
    }
    return suma
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

function algoritmo(restantes) {
  var ganadora = 0
  var sumaGanadora = arrayLibreriasB[0].getSuma(restantes)
  for (let i = 1; i < arrayLibreriasB.length; i++) {
    var sumaAux = arrayLibreriasB[i].getSuma(restantes)
    if (sumaAux > sumaGanadora) {
      ganadora = i
      sumaGanadora = sumaAux
    }
  }
  return [arrayLibreriasB[ganadora], ganadora]
}

async function main() {
  //var fichero = await leerFichero('./input/a_example.txt')
  var fichero = await leerFichero('./input/e_so_many_books.txt')
  getMetaData(fichero)
  /*console.log(`Numero libros: ${libros}`)
  console.log(`Numero librerias: ${librerias}`)
  console.log(`Numero dias: ${dias}`)
  console.log(`\n=========================\n`)*/

  getLibros(fichero)
  getLibrerias(fichero)
  arrayLibreriasB = arrayLibrerias
  //console.log(arrayLibreriasB)

  //console.log('Mostrando las librerias')
  for (let libreria of arrayLibrerias) {
    //console.log(libreria)
  }

  //console.log('\nMostrando los libros')
  for (let libro of arrayLibros) {
    //console.log(libro)
  }

  // Lineas salida que luego pasaremos al array de salida
  let lineasSalida = []
  //lineasSalida.push(String(librerias)) // Primera linea
  console.log(librerias)
  let acumulado = dias
  while (acumulado > 0) {
    let a = algoritmo(acumulado)

    let ganadora = a[1]
    let libreriaActual = a[0]

    arrayLibreriasB.splice(ganadora, 1)

    //console.log(libreriaActual)
    let librosEscanear = acumulado - libreriaActual.cantidadDias
    if (librosEscanear > libreriaActual.cantidadLibros) {
      librosEscanear = libreriaActual.cantidadLibros
    }
    console.log(`${libreriaActual.id} ${librosEscanear}`) // Numero de libros a escanear

    let l2 = ''
    for (let i = 0; i < librosEscanear; i++) {
      l2 += libreriaActual.libros[i].id + ' '
    }
    console.log(l2)

    acumulado -= libreriaActual.cantidadDias // Pasamos del tiempo que estamos en signup
  }
}

main()
