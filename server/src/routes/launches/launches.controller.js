const {
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunch
} = require('../../models/launches.model')

const doesIdExists = id => {
  const launches = getAllLaunches()
  for (let launch of launches) {
    if (launch.flightNumber === Number(id)) {
      return true
    }
  }
  return false
}

async function httpAddNewLaunch (req, res) {
  const launch = req.body
  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target ||
    launch.launchDate < new Date().toISOString().substring(0, 10) ||
    isNaN(new Date(launch.launchDate).valueOf())
  ) {
    return res.status(400).json({
      error: 'Missing required launch property'
    })
  }
  scheduleNewLaunch(launch)
  return res.status(201).send(launch)
}
async function httpGetAllLaunches (req, res) {
  return await res.status(200).json(Array.from(getAllLaunches().values()))
}

async function httpAbortLaunch (req, res) {
  if (doesIdExists(req.params.id)) {
    const launchId = req.params.id
    abortLaunch(launchId)
    return res.status(200).send({ ok: true })
  } else {
    return res.status(404).send({ error: 'Launch not found' })
  }
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch
}
