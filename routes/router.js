const express = require('express')
const router = express.Router()

// Manage top-level request first
router.get('/', (req, res, next) => {
  // res.sendFile('index.html')
  res.render('index.ejs', { title: 'MVC' })
})

router.get('/index', (req, res, next) => {
  res.render('index.ejs', { title: 'MVC' })
})

// Route requests that start with '/dev' to a particular controller
router.use('/instructor', require('../controllers/instructor.js'))
router.use('/course', require('../controllers/course.js'))
router.use('/student', require('../controllers/student.js'))
router.use('/section', require('../controllers/section.js'))
router.get('/section', (req, res, next) => {
  // res.sendFile('index.html')
  res.render('index')})
// catch 404 and forward to error handler
router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})

// error handler
router.use((err, req, res, next) => {
  // render the error page
  res.status(err.status || 500)
  res.render('error', { status: err.status, message: err.message })
})

module.exports = router