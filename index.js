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
    // return resolve(['b_read_on.txt']) // Para hacer un fichero en especifico

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

// Busca la mejor libreria que dar de alta en relacion con el tiempo restante de dias
const searchBestLibrary = (diasRestantes, librerias, librosEscaneados) => {
  let bestLibrary = librerias[0]
  let bestLibraryScore = 0
  let bestLibraryLibrosPuedeEscanear = librerias[0].libros

  // Para cada libreria calculamos el score que daria si fuera la siguiente en ser dada de alta
  for (let libreria in librerias) {
    let currentLibraryScore = 0

    let librosPuedeEscanear = [] // Array de objetos los libros que puede escanear
    for (let libro of librerias[libreria].libros) {
      if (!librosEscaneados.includes(libro.id)) {
        librosPuedeEscanear.push(libro)
      }
    }

    // Decidimos cual es la cantidad total de libros que podria escanear
    let maxLibrosEscanear = (diasRestantes - librerias[libreria].signupDias) * librerias[libreria].librosDia // Maximo numero de libros que le da tiempo a escanear
    if (librosPuedeEscanear.length > maxLibrosEscanear) {
      librosPuedeEscanear = librosPuedeEscanear.slice(0, maxLibrosEscanear)
    }

    // Calculamos el maximo score que obtendriamos con esta libreria
    for (let libro of librosPuedeEscanear) {
      currentLibraryScore += libro.score
    }

    // Si el score de esta es mejor, sustituimos la mejor hasta ahora
    if (currentLibraryScore > bestLibraryScore) {
      bestLibrary = librerias[libreria]
      bestLibraryScore = currentLibraryScore
      bestLibraryLibrosPuedeEscanear = librosPuedeEscanear
    }
  }

  //console.log(`Best score: ${bestLibraryScore}`)
  return [bestLibrary, bestLibraryLibrosPuedeEscanear] // Tendriamos que eliminar de librerias la libreria que hayamos sacado como bestLibrary
}

const main = async () => {
  const inputList = await listInputs(path.join(__dirname, 'input'))

  // Loop para cada archivo
  for (let inputFile of inputList) {
    const input = await readInput(inputFile)

    // Declaramos las variables
    let libros = [] // Array de objetos de Libro. Ordenado por su id (practicamente ni se usa)
    let librerias = [] // Array de objetos de Libreria. Ordenado por su id

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

    let output = []
    let librosEscaneados = [] // Contiene las id de los libros escaneados
    let diasPasados = 0

    // Ordenamos las librerias por dias
    librerias.sort((a, b) => {
      return a.signupDias - b.signupDias
    })

    // for (let libreria of librerias) console.log(libreria) // Debugging

    // Preparar output
    output.push(String(totalLibrerias)) // Primera linea del output (posiblemente luego es editada)

    let numeroFinalLibrerias = 0
    while (totalDias - diasPasados > 0 && librerias.length > 0) { // Buscamos la mejor libreria para los dias restantes
      let bestLibrarySearch = searchBestLibrary(
        totalDias - diasPasados,
        librerias,
        librosEscaneados
      )
      let bestLibrary = bestLibrarySearch[0] // Es un objeto de Libreria
      let librosPuedeEscanear = bestLibrarySearch[1] // Es un array de objetos de Libro. Esta es ya directamente la cantidad de libros que puede escanear sin pasarse

      if (bestLibrary.signupDias < totalDias - diasPasados) { // El numero dias que tarde en dar de alta debe ser menor que el total de dias restante para que merezca la pena meterlo en el archivo de salida
        // Eliminamos bestLibrary del array de librerias
        librerias.splice(librerias.indexOf(bestLibrary), 1)

        numeroFinalLibrerias++

        let librosString = ''
        for (let libroEscanear of librosPuedeEscanear) {
          librosEscaneados.push(libroEscanear.id)
          librosString += libroEscanear.id + ' '
        }

        output.push(`${bestLibrary.id} ${librosPuedeEscanear.length}`)
        output.push(librosString)
        console.log(`a`)

        //console.log(bestLibrary)
      }
      diasPasados += bestLibrary.signupDias
    }

    output[0] = numeroFinalLibrerias
    // Escribir output
    writeOutput(inputFile, output)

    console.log('')
  }
}
main()
