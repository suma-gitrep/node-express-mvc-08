/**
*  Developer model
*  Describes the characteristics of each attribute in a developer resource.
*
* @author Suma Soma
* @requires mongoose
*
*/
  const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({

  _id: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    minlength: 5,
    maxlength: 100,
    required: true,
    unique: true
  },
  given: {
    type: String,
    minlength: 3,
    maxlength: 100,
    required: false,
    default: 'Given name'
  },
  family: {
    type: String,
    minlength: 3,
    maxlength: 100,
    required: false,
    default: 'Family name'
  },
  GitHub: {
    type: String,
    minlength: 3,
    maxlength: 100,
    required: true
    
  },
  Website: {
    type: String,
    minlength: 2,
    maxlength: 100,
    required: true
    
  },
  GPA: {
      type : Number,
      minlength: 2,
      maxlength: 5,
      required: true
  },

  SectionID: {
    type : Number,
    
    required: true
}

})
module.exports = mongoose.model('student', studentSchema)