const { getPagination } = require('../../services/query')

const {
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunch
} = require('../../models/launches.model')

async function doesIdExists (id) {
  const launches = await getAllLaunches()
  return launches.some(launch => launch.flightNumber === id)
}

async function httpAddNewLaunch (req, res) {
  const launch = req.body
  console.log(launch)
  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      error: 'Missing required launch property'
    })
  } else if (isNaN(new Date(launch.launchDate).valueOf())) {
    return res.status(400).json({
      error: 'Invalid launch date'
    })
  }
  await scheduleNewLaunch(launch)
  await getAllLaunches()
  return res.status(201).send(launch)
}
async function httpGetAllLaunches (req, res) {
  const { skip, limit } = getPagination(req.query)
  const launches = await getAllLaunches(skip, limit)
  return await res.status(200).json(launches)
}

async function httpAbortLaunch (req, res) {
  if (doesIdExists(req.params.id)) {
    abortLaunch(req.params.id)

    return res.status(200).send({
      ok: true
    })
  }
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch
}
