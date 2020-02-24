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
    return resolve(['a_example.txt']) // Para hacer solo un fichero en especifico

    const inputDir = path.join(__dirname, 'input')
    // Comprobamos que exista el directorio input
    if (!fs.existsSync(inputDir)) {
      fs.mkdirSync(inputDir)
      throw new Error('Debes introducir los archivos input en la carpeta input')
    }

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

    lineReader.on('line', function (linea) {
      lineas.push(linea)
    })

    lineReader.on('close', () => {
      resolve(lineas)
    })
  })
}
// Escribir fichero especifico
const writeOutput = (outputFile, lines) => {
  return new Promise((resolve, reject) => {
    const outputDir = path.join(__dirname, 'output')

    // Comprobamos que expista el directorio output
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir)
    }

    const writeStream = fs.createWriteStream(path.join(outputDir, outputFile))

    for (let line in lines) {
      line = lines[line] + '\n'

      writeStream.write(line, 'utf8') // A lo mejor deberiamos hacer esta funcion async
    }
  })
}

class Libro {
  constructor(id, score) {
    this.id = Number(id)
    this.score = Number(score)
    this.scanned = false
  }
}

class Libreria {
  constructor(id, cantidadLibros, signupDias, librosDia, libros) {
    this.id = Number(id)
    this.cantidadLibros = Number(cantidadLibros)
    this.signupDias = Number(signupDias)
    this.librosDia = Number(librosDia)
    this.libros = libros // Array de objetos ordenados por score de Libro

    // Ordenamos los libros por score
    this.libros.sort((a, b) => {
      return b.score - a.score
    })
  }
}

const calculatePermutationScore = (array, metadata) => {
  let libros = [...metadata.libros]
  let score = 0
  let diasRestantes = metadata.totalDias
  let i = 0

  while (diasRestantes > 0 && metadata.librerias.length > i) {
    const libreriaID = array[i]
    const libreria = metadata.librerias[libreriaID]

    if (libreria.signupDias < diasRestantes) {
      for (let libro of libreria.libros) {
        if (libros[libro.id].scanned == false) {
          score += libro.score
          libros[libro.id].scanned = true
        }
      }
    }

    diasRestantes -= libreria.signupDias
    i++
  }

  console.log(score)
}

const searchBestPermutation = (k, array, metadata) => {
  if (k === 1) { // New permutation found
    console.log(metadata.libros)

    calculatePermutationScore(array, metadata)
  } else {
    searchBestPermutation(k - 1, array, metadata)

    for (let i = 0; i < k - 1; i++) {
      if (k % 2 === 0) {
        const tmp = array[i]
        array[i] = array[k - 1]
        array[k - 1] = tmp
      } else {
        const tmp = array[0]
        array[0] = array[k - 1]
        array[k - 1] = tmp
      }
      searchBestPermutation(k - 1, array, metadata)
    }
  }
}

const range = (n) => {
  let array = []

  for (let i = 0; i < n; i++) {
    array.push(i)
  }

  return array
}

const main = async () => {
  const inputList = await listInputs(path.join(__dirname, 'input'))

  // Loop para cada archivo
  for (let inputFile of inputList) {
    const input = await readInput(inputFile)

    // Declaramos las variables
    let librerias = [] // Array de objetos de Libreria. Ordenado por su id
    let libros = [] // Array de objetos de Libro. Ordenado por su id (practicamente ni se usa)

    // Parseamos la primera linea
    const totalLibros = Number(input[0].split(' ')[0])
    const totalLibrerias = Number(input[0].split(' ')[1])
    const totalDias = Number(input[0].split(' ')[2])

    console.log(
      `${inputFile}:\n - totalLibros: ${totalLibros}\n - totalLibrerias: ${totalLibrerias}\n - totalDias: ${totalDias}`
    )

    // Parseamos la segunda linea (los libros y sus scores)
    let librosLine = input[1].split(' ')
    for (let libro in librosLine) {
      let objeto = new Libro(libro, librosLine[libro])
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

    // ===================== TODO PARSEADO =====================

    let idArray = range(librerias.length)
    searchBestPermutation(idArray.length, idArray, { librerias, libros, totalLibrerias, totalLibros, totalDias })
    //calculatePermutationScore(range(totalLibrerias), { librerias, libros, totalLibrerias, totalLibros, totalDias })
  }
}
main()
