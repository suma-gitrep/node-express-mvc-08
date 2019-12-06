/**
*  Developer controller
*  Handles requests related to developer resources.
*
* @author Mohan
*
*/
const express = require('express')
const api = express.Router()
const CourseSchema = require('../models/course.js')

const find = require('lodash.find')
const notfoundstring = 'Could not find student with id='

// RESPOND WITH JSON DATA  --------------------------------------------

// GET all JSON
api.get('/findall', (req, res) => {
  
  CourseSchema.find({}, (err, data) => {
    if (err) { return res.end('Error finding all') }
    res.json(data)
  })
})

// GET one JSON by ID
api.get('/findone/:id', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  const id = parseInt(req.params.id)
  CourseSchema.find({ _id: id }, (err, results) => {
    if (err) { return res.end(`notfoundstring ${id}`) }
    res.json(results[0])
  })
})

// RESPOND WITH VIEWS  --------------------------------------------

//GET to this controller base URI (the default)
api.get('/', (req, res) => {
  // LOG.info(`Handling GET / ${req}`)
  CourseSchema.find({}, (err, data) => {
    if (err) { return res.end('Error') }
    res.locals.courses = data
    res.render('course/index.ejs')
  })
})

// GET create
api.get('/create', (req, res) => {
  CourseSchema.find({}, (err, data) => {
    if (err) { return res.end('error on create')
   }
    res.locals.courses = data
    res.locals.course = new CourseSchema()

    res.render('course/create')
  })
})

// GET /delete/:id
api.get('/delete/:id', (req, res) => {
  // LOG.info(`Handling GET /delete/:id ${req}`)
  const id = parseInt(req.params.id)
  CourseSchema.find({ _id: id }, (err, results) => {
    if (err) { return res.end(notfoundstring) }
    // LOG.info(`RETURNING VIEW FOR ${JSON.stringify(results)}`)
    res.locals.course = results[0]
    return res.render('course/delete')
  })
})

// GET /details/:id
api.get('/details/:id', (req, res) => {
  // LOG.info(`Handling GET /details/:id ${req}`)
  const id = parseInt(req.params.id)
  CourseSchema.find({ _id: id }, (err, results) => {
    if (err) { return res.end(notfoundstring) }
    // LOG.info(`RETURNING VIEW FOR ${JSON.stringify(results)}`)
    res.locals.course = results[0]
    return res.render('course/details')
  })
})

// GET one
api.get('/edit/:id', (req, res) => {
  // LOG.info(`Handling GET /edit/:id ${req}`)
  const id = parseInt(req.params.id)
  CourseSchema.find({ _id: id }, (err, results) => {
    if (err) { return res.end(notfoundstring) }
    // LOG.info(`RETURNING VIEW FOR${JSON.stringify(results)}`)
    res.locals.course = results[0]
    return res.render('course/edit')
  })
})

// // HANDLE EXECUTE DATA MODIFICATION REQUESTS --------------------------------------------

// POST new
api.post('/save', (req, res) => {
  console.info(`Handling POST ${req}`)
  console.debug(JSON.stringify(req.body))
  const item = new CourseSchema()
  console.info(`NEW ID ${req.body._id}`)
  item._id = parseInt(req.body._id)
  item.schoolnumber = req.body.schoolnumber
  item.coursenumber = req.body.coursenumber
  item.name = req.body.name
  item.inspring = req.body.inspring
  item.insummer = req.body.insummer
  item.infall = req.body.infall

  //console.log(item);

  item.save((err) => {
    console.log(err);
    if (err) { return res.end('ERROR: item could not be saved') }
   
    return res.redirect('/course')
  })
})

// POST update with id
api.post('/save/:id', (req, res) => {
  // LOG.info(`Handling SAVE request ${req}`)
  const id = parseInt(req.params.id)
  // LOG.info(`Handling SAVING ID=${id}`)
  CourseSchema.updateOne({ _id: id },
    { // use mongoose field update operator $set
      $set: {
        schoolnumber: req.body.schoolnumber,
        coursenumber: req.body.coursenumber,
        name: req.body.name,
        inspring:req.body.inspring,
        insummer: req.body.insummer,
        infall: req.body.infall,
      }
    },
    (err, item) => {
      if (err) { return res.end(notfoundstring) }
      // LOG.info(`ORIGINAL VALUES ${JSON.stringify(item)}`)
      // LOG.info(`UPDATED VALUES: ${JSON.stringify(req.body)}`)
      // LOG.info(`SAVING UPDATED item ${JSON.stringify(item)}`)
      return res.redirect('/course')
    })
})

// DELETE id (uses HTML5 form method POST)
api.post('/delete/:id', (req, res) => {
  // LOG.info(`Handling DELETE request ${req}`)
  const id = parseInt(req.params.id)
  // LOG.info(`Handling REMOVING ID=${id}`)
  CourseSchema.remove({ _id: id }).setOptions({ single: true }).exec((err, deleted) => {
    if (err) { return res.end(notfoundstring) }
    console.log(`Permanently deleted item ${JSON.stringify(deleted)}`)
    return res.redirect('/course')
  })
})

module.exports = api
