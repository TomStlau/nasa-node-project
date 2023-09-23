const launches = new Map()

let latestFlightNumber = 100

const launch = {
  flightNumber: 100,
  mission: 'Kepler Exploration X',
  rocket: 'Explorer IS1',
  launchDate: new Date('December 27, 2030'),
  target: 'Kepler-442 b',
  customers: ['ZTM'],
  upcoming: true,
  success: true
}

launches.set(launch.flightNumber, launch)

function getAllLaunches () {
  return Array.from(launches.values())
}

function scheduleNewLaunch (launch) {
  latestFlightNumber++
  console.log(launch)
  launches.set(
    latestFlightNumber,
    Object.assign(launch, {
      launchDate: new Date(launch.launchDate).toISOString(),
      mission: launch.mission,
      rocket: launch.rocket,
      customers: ['Zero to Mastery', 'NASA'],
      flightNumber: latestFlightNumber,
      upcoming: true,
      success: true,
      destination: launch.target
    })
  )
}

function abortLaunch (id) {
  const aborted = launches.get(Number(id))
  aborted.upcoming = false
  aborted.success = false
  return aborted
}

module.exports = {
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunch
}
