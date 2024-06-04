const express = require('express')
const vendor = require('./vendorRoutes')
const auth = require('./authRoutes')

const routes = express.Router()


routes.get('/vercel', (req, res) => {
    res.send('Hello from routes')
})

routes.use('/admin', auth)

routes.use('/vendor', vendor)


module.exports = routes