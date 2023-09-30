const launches = require('./launches.mongo')
const planets = require('./planets.mongo')
const axios = require('axios')

const DEFAULT_FLIGHT_NUMBER = 100

async function getLastFlightId () {
  const lastLaunch = await launches.findOne().sort('-flightNumber')

  if (!lastLaunch) {
    return DEFAULT_FLIGHT_NUMBER
  }

  return lastLaunch.flightNumber
}

async function populateLaunches () {
  const response = await axios.post(SPACEX_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: 'rocket',
          select: {
            name: 1
          }
        },
        {
          path: 'payloads',
          select: {
            customers: 1
          }
        }
      ]
    }
  })

  if (response.status !== 200) {
    console.log('Problem downloading launch data')
    throw new Error('Launch data download failed')
  }

  const launchData = response.data.docs.map(launch => ({
    flightNumber: launch.flight_number,
    mission: launch.name,
    rocket: launch.rocket.name,
    launchDate: launch.date_local,
    upcoming: launch.upcoming,
    success: launch.success,
    customer: launch.payloads.flatMap(payload => payload.customers)
  }))
  for (const launch of launchData) {
    await saveLaunch(launch)
  }
}

const SPACEX_URL = 'https://api.spacexdata.com/v5/launches/query'
async function loadLaunchData () {
  const firstLaunch = await findLauch({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat'
  })
  if (!firstLaunch) {
    await populateLaunches()
  } else {
    console.log('Launch data already loaded!')
  }
}

async function getAllLaunches (skip, limit) {
  return await launches
    .find({}, { _id: 0, __v: 0 })
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit)
}

async function findLauch (filter) {
  return await launches.findOne(filter)
}

async function existsLaunchId (launchId) {
  return await findLauch({ flightNumber: launchId })
}

async function doesPlanetExist (keplerName) {
  return await planets.findOne({ keplerName })
}

async function saveLaunch (launch) {
  await launches.updateOne(
    { flightNumber: launch.flightNumber },
    { $set: launch },
    { upsert: true }
  )
}

async function scheduleNewLaunch (launch) {
  const planet = await doesPlanetExist(launch.target)
  if (!planet) {
    throw new Error('No matching planet found')
  }
  const newFlightNumber = (await getLastFlightId()) + 1
  const newLaunch = Object.assign(launch, {
    flightNumber: newFlightNumber,
    customer: ['ZTM', 'NASA'],
    upcoming: true,
    success: true
  })
  await saveLaunch(newLaunch)
  return newLaunch
}

async function abortLaunch (id) {
  const aborted = await launches.findOneAndUpdate(
    { flightNumber: id },
    { upcoming: false, success: false }
  )
  getAllLaunches()
  return aborted.modifiedCount === 1
}

module.exports = {
  loadLaunchData,
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunch
}
