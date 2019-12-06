/**
*  Developer controller
*  Handles requests related to developer resources.
*
* @author SaiPrasad Bobbilla
*
*/
const express = require('express')
const api = express.Router()
const SectionSchema = require('../models/section.js')
const find = require('lodash.find')
const notfoundstring = 'Could not find developer with id='

// RESPOND WITH JSON DATA  --------------------------------------------

api.get('/findall', (req, res) => {
  
  SectionSchema.find({}, (err, data) => {
    if (err) { return res.end('Error finding all') }
    res.json(data)
  })
})

// GET one JSON by ID
api.get('/findone/:id', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  const id = parseInt(req.params.id)
  SectionSchema.find({ _id: id }, (err, results) => {
    if (err) { return res.end(`notfoundstring ${id}`) }
    res.json(results[0])
  })
})

// RESPOND WITH VIEWS  --------------------------------------------

//GET to this controller base URI (the default)
api.get('/', (req, res) => {
  // LOG.info(`Handling GET / ${req}`)
  SectionSchema.find({}, (err, data) => {
    if (err) { return res.end('Error') }
    res.locals.sections = data
    res.render('section/index.ejs')
  })
})

// GET create
api.get('/create', (req, res) => {
  SectionSchema.find({}, (err, data) => {
    if (err) { return res.end('error on create')
   }
    res.locals.sections = data
    res.locals.section = new SectionSchema()

    res.render('section/create')
  })
})

// GET /delete/:id
api.get('/delete/:id', (req, res) => {
  // LOG.info(`Handling GET /delete/:id ${req}`)
  const id = parseInt(req.params.id)
  SectionSchema.find({ _id: id }, (err, results) => {
    if (err) { return res.end(notfoundstring) }
    // LOG.info(`RETURNING VIEW FOR ${JSON.stringify(results)}`)
    res.locals.section = results[0]
    return res.render('section/delete')
  })
})

// GET /details/:id
api.get('/details/:id', (req, res) => {
  // LOG.info(`Handling GET /details/:id ${req}`)
  const id = parseInt(req.params.id)
  SectionSchema.find({ _id: id }, (err, results) => {
    if (err) { return res.end(notfoundstring) }
    // LOG.info(`RETURNING VIEW FOR ${JSON.stringify(results)}`)
    res.locals.section = results[0]
    return res.render('section/details')
  })
})

// GET one
api.get('/edit/:id', (req, res) => {
  // LOG.info(`Handling GET /edit/:id ${req}`)
  const id = parseInt(req.params.id)
  SectionSchema.find({ _id: id }, (err, results) => {
    if (err) { return res.end(notfoundstring) }
    // LOG.info(`RETURNING VIEW FOR${JSON.stringify(results)}`)
    res.locals.section = results[0]
    return res.render('section/edit')
  })
})

// // HANDLE EXECUTE DATA MODIFICATION REQUESTS --------------------------------------------

// POST new
api.post('/save', (req, res) => {
  console.info(`Handling POST ${req}`)
  console.debug(JSON.stringify(req.body))
  const item = new SectionSchema()
  console.info(`NEW ID ${req.body._id}`)
  item._id = parseInt(req.body._id)
  item.SectionNumber = req.body.SectionNumber
  item.Days = req.body.Days
  item.StartTime = req.body.StartTime
  item.RoomNumber = req.body.RoomNumber
  item.InstructorID = req.body.InstructorID
  item.CourseID = req.body.CourseID
  //console.log(item);

  item.save((err) => {
    console.log(err);
    if (err) { return res.end('ERROR: item could not be saved') }
   
    return res.redirect('/section')
  })
})

// POST update with id
api.post('/save/:id', (req, res) => {
  // LOG.info(`Handling SAVE request ${req}`)
  const id = parseInt(req.params.id)
  // LOG.info(`Handling SAVING ID=${id}`)
  SectionSchema.updateOne({ _id: id },
    { // use mongoose field update operator $set
      $set: {
        SectionNumber: req.body.Given,
        Days: req.body.Days,
        StartTime: req.body.StartTime,
        RoomNumber:req.body.RoomNumber,
        InstructorID: req.body.InstructorID,
        CourseID: req.body.CourseID,


      }
    },
    (err, item) => {
      if (err) { return res.end(notfoundstring) }
      // LOG.info(`ORIGINAL VALUES ${JSON.stringify(item)}`)
      // LOG.info(`UPDATED VALUES: ${JSON.stringify(req.body)}`)
      // LOG.info(`SAVING UPDATED item ${JSON.stringify(item)}`)
      return res.redirect('/section')
    })
})

// DELETE id (uses HTML5 form method POST)
api.post('/delete/:id', (req, res) => {
  // LOG.info(`Handling DELETE request ${req}`)
  const id = parseInt(req.params.id)
  // LOG.info(`Handling REMOVING ID=${id}`)
  SectionSchema.remove({ _id: id }).setOptions({ single: true }).exec((err, deleted) => {
    if (err) { return res.end(notfoundstring) }
    console.log(`Permanently deleted item ${JSON.stringify(deleted)}`)
    return res.redirect('/section')
  })
})

module.exports = api