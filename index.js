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

const fs = require('fs')
const path = require('path')
const readline = require('readline')

// Leer que ficheros hay
const listInputs = dir => {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, filenames) => {
      if (err) reject(err)
      resolve(filenames)
    })
  })
}

// Leer fichero especifico
const readInput = inputFile => {
  /* Otra manera
    return fs
    .readFileSync(path.join(__dirname, '/input/a_example.txt'), {
      encoding: 'utf-8'
    })
    .split('\n')
  */
  return new Promise((resolve, reject) => {
    let lineas = []

    let lineReader = readline.createInterface({
      input: fs.createReadStream(path.join(__dirname, 'input', inputFile))
    })

    lineReader.on('line', function(linea) {
      lineas.push(linea)
    })

    lineReader.on('close', () => {
      resolve(lineas)
    })
  })
}

class Libro {
  constructor(id, score) {
    this.id = id
    this.score = score
  }
}

class Libreria {
  constructor(id, cantidadLibros, signupDias, librosDia, libros) {
    this.id = id
    this.cantidadLibros = cantidadLibros
    this.signupDias = signupDias
    this.librosDia = librosDia
    this.libros = libros // Array de objetos ordenados por score de Libro

    // A libros vamos subiendo objetos de Libro
    /*for (let libro of l2) {
      this.libros.push(arrayLibros[Number(libro)])
    }*/
  }
}

const main = async () => {
  const inputList = await listInputs(path.join(__dirname, 'input'))

  // Loop para cada archivo
  for (let inputFile of inputList) {
    const input = await readInput(inputFile)
    //const input = await readInput('a_example.txt')
    //let inputFile = 'a_example.txt'

    // Declaramos las variables
    let libros = [] // Array de objetos de Libro. Ordenado por su id
    let librerias = [] // Array de objetos de Libreria. Ordenado por su id

    // Parseamos la primera linea
    const totalLibros = input[0].split(' ')[0]
    const totalLibrerias = input[0].split(' ')[1]
    const totalDias = input[0].split(' ')[2]

    console.log(
      `${inputFile}:\n - totalLibros: ${totalLibros}\n - totalLibrerias: ${totalLibrerias}\n - totalDias: ${totalDias}`
    )

    // Parseamos la segunda linea (los libros y sus scores)
    for (let libro in input[1].split(' ')) {
      let objeto = new Libro(libro, input[1].split(' ')[libro])
      libros.push(objeto)
    }

    // Parseamos las demas lineas (las librerias)
    let actualLibraryID = 0
    for (let i = 2; i < totalLibrerias * 2 + 1; i += 2) {
      const s1 = input[i].split(' ')
      const s2 = input[i + 1].split(' ')

      let librosLibreria = []
      for (let libro in s2) {
        librosLibreria.push(new Libro(s2[libro], libros[s2[libro]].score))
      }

      let objeto = new Libreria(
        actualLibraryID,
        s1[0],
        s1[1],
        s1[2],
        librosLibreria
      )
      librerias.push(objeto)
      actualLibraryID++
    }

    // TODO PARSEADO
  }
}
main()
