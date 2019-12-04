/**
*  Developer controller
*  Handles requests related to developer resources.
*
* @author Naveen
*
*/
const express = require('express')
const api = express.Router()
const InstructorSchema = require('../models/instructor.js')

const find = require('lodash.find')
const notfoundstring = 'Could not find instructor with id='

// RESPOND WITH JSON DATA  --------------------------------------------

// GET all JSON
api.get('/findall', (req, res) => {
  
  InstructorSchema.find({}, (err, data) => {
    if (err) { return res.end('Error finding all') }
    res.json(data)
  })
})

// GET one JSON by ID
api.get('/findone/:id', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  const id = parseInt(req.params.id)
  InstructorSchema.find({ _id: id }, (err, results) => {
    if (err) { return res.end(`notfoundstring ${id}`) }
    res.json(results[0])
  })
})

// RESPOND WITH VIEWS  --------------------------------------------

//GET to this controller base URI (the default)
api.get('/', (req, res) => {
  // LOG.info(`Handling GET / ${req}`)
  InstructorSchema.find({}, (err, data) => {
    if (err) { return res.end('Error') }
    res.locals.instructors = data
    res.render('instructor/index.ejs')
  })
})

// GET create
api.get('/create', (req, res) => {
  InstructorSchema.find({}, (err, data) => {
    if (err) { return res.end('error on create')
   }
    res.locals.instructors = data
    res.locals.instructor = new InstructorSchema()

    res.render('instructor/create')
  })
})

// GET /delete/:id
api.get('/delete/:id', (req, res) => {
  // LOG.info(`Handling GET /delete/:id ${req}`)
  const id = parseInt(req.params.id)
  InstructorSchema.find({ _id: id }, (err, results) => {
    if (err) { return res.end(notfoundstring) }
    // LOG.info(`RETURNING VIEW FOR ${JSON.stringify(results)}`)
    res.locals.instructor = results[0]
    return res.render('instructor/delete')
  })
})

// GET /details/:id
api.get('/details/:id', (req, res) => {
  // LOG.info(`Handling GET /details/:id ${req}`)
  const id = parseInt(req.params.id)
  InstructorSchema.find({ _id: id }, (err, results) => {
    if (err) { return res.end(notfoundstring) }
    // LOG.info(`RETURNING VIEW FOR ${JSON.stringify(results)}`)
    res.locals.instructor = results[0]
    return res.render('instructor/details')
  })
})

// GET one
api.get('/edit/:id', (req, res) => {
  // LOG.info(`Handling GET /edit/:id ${req}`)
  const id = parseInt(req.params.id)
  InstructorSchema.find({ _id: id }, (err, results) => {
    if (err) { return res.end(notfoundstring) }
    // LOG.info(`RETURNING VIEW FOR${JSON.stringify(results)}`)
    res.locals.instructor = results[0]
    return res.render('instructor/edit')
  })
})

// // HANDLE EXECUTE DATA MODIFICATION REQUESTS --------------------------------------------

// POST new
api.post('/save', (req, res) => {
  console.info(`Handling POST ${req}`)
  console.debug(JSON.stringify(req.body))
  const item = new InstructorSchema()
  console.info(`NEW ID ${req.body._id}`)
  item._id = parseInt(req.body._id)
  item.Email = req.body.Email
  item.Given = req.body.Given
  item.Family = req.body.Family
  item.Salary = req.body.Salary
  item.GitHub = req.body.GitHub
  console.log(item);

  item.save((err) => {
    console.log(err);
    if (err) { return res.end('ERROR: item could not be saved') }
   
    return res.redirect('/instructor')
  })
})

// POST update with id
api.post('/save/:id', (req, res) => {
  // LOG.info(`Handling SAVE request ${req}`)
  const id = parseInt(req.params.id)
  // LOG.info(`Handling SAVING ID=${id}`)
  InstructorSchema.updateOne({ _id: id },
    { // use mongoose field update operator $set
      $set: {
        Given: req.body.Given,
        Family: req.body.Family,
        Email: req.body.Email,
        Salary:req.body.Salary,
        Github: req.body.Github,
      }
    },
    (err, item) => {
      if (err) { return res.end(notfoundstring) }
      // LOG.info(`ORIGINAL VALUES ${JSON.stringify(item)}`)
      // LOG.info(`UPDATED VALUES: ${JSON.stringify(req.body)}`)
      // LOG.info(`SAVING UPDATED item ${JSON.stringify(item)}`)
      return res.redirect('/instructor')
    })
})

// DELETE id (uses HTML5 form method POST)
api.post('/delete/:id', (req, res) => {
  // LOG.info(`Handling DELETE request ${req}`)
  const id = parseInt(req.params.id)
  // LOG.info(`Handling REMOVING ID=${id}`)
  InstructorSchema.remove({ _id: id }).setOptions({ single: true }).exec((err, deleted) => {
    if (err) { return res.end(notfoundstring) }
    console.log(`Permanently deleted item ${JSON.stringify(deleted)}`)
    return res.redirect('/instructor')
  })
})

module.exports = api
