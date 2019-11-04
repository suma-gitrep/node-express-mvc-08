/**
 * @file app.js
 * The starting point of the application.
 * Express allows us to configure our app and use
 * dependency injection to add it to the http server.
 *
 * The server-side app starts and begins listening for events.
 *
 *  @requires config
 *  @requires express
 **/
const config = require('config')
const express = require('express')
const path = require('path')
const logger = require('morgan')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const engines = require('consolidate')
const expressLayouts = require('express-ejs-layouts')
const app = express() // create an Express web app

// Use hosting values if available, otherwise default
const environment = process.env.NODE_ENV || 'development'
const hostname = process.env.HOSTNAME || config.get('hostname')
const port = process.env.PORT || config.get('port')

// By default, Express does not serve static files.
// use middleware to define a static assets folder 'public'
app.use(express.static('public'))

// Helmet helps you secure Express apps by setting various HTTP headers.
// It's not a silver bullet, but it can help!
// https://github.com/helmetjs/helmet
app.use(helmet())

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.engine('ejs', engines.ejs)

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(expressLayouts)

// load seed data
require('./utils/seeder.js')(app)

// Use Express middleware to configure routing
const routing = require('./routes/router.js')
app.use('/', routing)

app.listen(port, hostname, () => {
  console.log(`App running at http://${hostname}:${port}/ in ${environment}`)
  console.log('Hit CTRL-C CTRL-C to stop\n')
})
