const { getPlanets } = require('../../models/planets.model')

function getAllPlanets (req, res) {
  return res.status(200).send(getPlanets())
}

module.exports = {
  getAllPlanets
}
//
