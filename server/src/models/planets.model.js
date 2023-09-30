const { parse } = require('csv-parse')
const fs = require('fs')
const path = require('path')
const dataFile = path.join(__dirname, '..', '..', 'data', 'kepler_data.csv')

const planets = require('./planets.mongo')

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
          await savePlanets(data)
        }
      })
      .on('error', err => {
        console.log(err)
        reject(err)
      })
      .on('end', async () => {
        const countPlanetsFound = (await getPlanets()).length
        console.log(`${countPlanetsFound} habitable planets found!`)
        resolve()
      })
  }))
}

async function getPlanets () {
  return await planets.find(
    {},
    {
      _id: 0,
      __v: 0
    }
  )
}

async function savePlanets (planet) {
  try {
    await planets.updateOne(
      {
        keplerName: planet.kepler_name
      },
      {
        keplerName: planet.kepler_name
      },
      {
        upsert: true
      }
    )
  } catch (err) {
    console.error(`Could not save planet ${err}`)
  }
}

module.exports = { loadPlanetsData, getPlanets }
