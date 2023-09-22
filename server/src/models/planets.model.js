const { parse } = require('csv-parse')
const fs = require('fs')
const path = require('path')
const dataFile = path.join(__dirname, '..', '..', 'data', 'kepler_data.csv')

const planets = []

function isHabitablePlanet (planet) {
  return (
    planet['koi_disposition'] === 'CONFIRMED' &&
    planet['koi_insol'] > 0.36 &&
    planet['koi_insol'] < 1.11 &&
    planet['koi_prad'] < 1.6
  )
}
function loadPlanetsData () {
  return (promise = new Promise((resolve, reject) => {
    fs.createReadStream(dataFile)
      .pipe(
        parse({
          comment: '#',
          columns: true
        })
      )
      .on('data', async data => {
        if (isHabitablePlanet(data)) {
          planets.push(data)
        }
      })
      .on('error', err => {
        console.log(err)
        reject(err)
      })
      .on('end', () => {
        console.log(`${planets.length} habitable planets found!`)
        resolve()
      })
  }))
}

function getPlanets () {
  return planets
}

module.exports = { loadPlanetsData, getPlanets }
