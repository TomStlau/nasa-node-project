const http = require('http')
const app = require('./app')
require('dotenv').config()
const PORT = process.env.PORT || 3001
const { loadLaunchData } = require('./models/launches.model')
const { loadPlanetsData } = require('./models/planets.model')
const mongoose = require('mongoose')
const server = http.createServer(app)
const MONGO_URL = process.env.MONGO_URL

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB')
})

mongoose.connection.on('error', err => {
  console.error(err)
})

async function startServer () {
  await mongoose.connect(MONGO_URL)
  await loadPlanetsData()
  await loadLaunchData()
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

startServer()
