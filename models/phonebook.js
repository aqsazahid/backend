const mongoose = require('mongoose');
require('dotenv').config();

const url = process.env.MONGODB_URI;

mongoose.set('strictQuery', false);
mongoose.connect(url).then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  });
  const phoneNumberValidator = (phoneNumber) => {
    if (phoneNumber.length < 8) {
      return false;
    }
    
    // Split the phone number into two parts
    const parts = phoneNumber.split('-');
    
    // Validate the format: two parts separated by '-'
    if (parts.length !== 2) {
      return false;
    }
  
    // Validate each part: should be numbers and of correct length
    const [firstPart, secondPart] = parts;
    return (
      /^\d{2,3}$/.test(firstPart) && // First part: 2 or 3 digits
      /^\d+$/.test(secondPart) // Second part: only digits
    );
  };
const phonebookSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [3, 'Name must be at least 3 characters long'],
    required: [true, 'Name is required']
  },
  number: {
    type: String,
    validate: {
      validator: phoneNumberValidator,
      message: 'Invalid phone number format',
    },
    required: [true, 'Number is required']
  }
});

phonebookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })


  module.exports = mongoose.model('Phonebook', phonebookSchema);