const express = require('express')
const forecastRouter = require('./routers/forecastRouter')

const app = express()


app.use(express.json())

app.use(forecastRouter)

module.exports = app