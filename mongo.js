const mongoose = require('mongoose');
require('dotenv').config();

const url = process.env.MONGODB_URI;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Phonebook = mongoose.model('Phonebook', phonebookSchema);

if (process.argv.length === 3) {
  // List all entries
  console.log(process.argv)
  Phonebook.find({}).then(result => {
    console.log('Phonebook:');
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length === 5) {
  // Add a new entry
  console.log(process.argv)
  const name = process.argv[3];
  const number = process.argv[4];

  const phonebook = new Phonebook({
    name: name,
    number: number,
  });

  phonebook.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  console.log('Please provide the password, name and number as arguments: node mongo.js <password> <name> <number>');
  process.exit(1);
}
