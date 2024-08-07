require('dotenv').config()
const express = require('express')
const app = express();
const morgan = require('morgan');
app.use(express.json()); 
const cors = require('cors')
app.use(cors())
const Note = require('./models/note');
const Phonebook = require('./models/phonebook')

// Use Morgan with the custom token
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(express.static('dist'))

let persons = [
    {
      id: 1,
      name: "Arto Hellas",
      number: "040-123456"
    },
    {
      id: 2,
      name: "Ada Lovelace",
      number: "39-44-5323523"
    },
    {
      id: 3,
      name: "Dan Abramov",
      number: "12-43-234345"
    },
    {
      id: 4,
      name: "Mary Poppendieck",
      number: "39-23-6423122"
    }
]
let notes = [
    {
      id: "1",
      content: "HTML is easy",
      important: true
    },
    {
      id: "2",
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: "3",
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
]
//get data from database 
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

//post
app.post('/api/notes', (request, response) => {
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  })
})

app.post('/api/persons', async(req, res) => {
  const body = req.body;
  // Check if name or number is missing
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'name or number is missing'
    });
  }

  const person = new Phonebook({
    name: body.name,
    number: body.number
  })

  person.save().then(newPerson => {
    res.json(newPerson)
  })

 // Check if name already exists in the persons
  //const nameExists = persons.some(person => person.name === body.name);
  // if (nameExists) {
  //   return res.status(400).json({
  //     error: 'name must be unique'
  //   });
  // }

  // const newPerson = {
  //   id: generateId(),
  //   name: body.name,
  //   number: body.number
  // };

  // persons = persons.concat(newPerson);
  // res.json(newPerson);
});

app.get('/api/persons', (request, response) => {
  // response.json(persons)
  Phonebook.find({}).then(person => {
    response.json(person)
  })
})

// New /info route
app.get('/api/info', (request, response) => {
    const entryCount = notes.length
    const requestTime = new Date().toString()
  
    response.send(`
      <p>persons has info for ${entryCount} people</p>
      <p>${requestTime}</p>
    `)
})

// New /person route
 app.get('/api/persons/:id', (request,response) => {
    const id =  Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
      } else {
        response.status(404).send({ error: 'Person not found' })
      }
 })

 
const idExists = (array, id) => {
    return array.some(item => item.id === id);
}

//delet person
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    if (idExists(persons, id)) {
      persons = persons.filter(person => person.id !== id)
      res.status(204).end()
    } else {
      res.status(404).send({ error: 'Person not found' })
    }
})

//add a person
const generateId = () => {
    return Math.floor(Math.random() * 1000000);
};

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})