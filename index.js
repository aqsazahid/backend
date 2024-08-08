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
app.get('/api/notes', (request, response,next) => {
  Note.find({}).then(notes => {
    response.json(notes)
  }).catch(error => next(error))
})

//post
app.post('/api/notes', (request, response,next) => {
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
  }).catch(error=>next(error))
})

//add new peson
app.post('/api/persons', async(request, response,next) => {
  const body = request.body;
  // Check if name or number is missing
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number is missing'
    });
  }
  try {
    debugger
    const existingPerson = await Phonebook.findOne({ name: body.name });
    if (existingPerson) {
      return response.status(400).json({ error: 'name must be unique' });
    }
    const person = new Phonebook({
      name: body.name,
      number: body.number
    })

    const savedPerson = await person.save();
    response.json(savedPerson);
  } catch (error) {
    next(error);
  }
});
//update signle person
app.put('/api/persons/:id',async (request,response,next) => {
  const body = request.body;
  const updatedPerson = {
    name: body.name,
    number: body.number,
  };
  try {
    const result = await Phonebook.findByIdAndUpdate(request.params.id, updatedPerson, { new: true, runValidators: true, context: 'query' });
    if (result) {
      response.json(result);
    } else {
      response.status(404).send({ error: 'Person not found' });
    }
  } catch (error) {
    next(error);
  }
})

//get all persons
app.get('/api/persons', (request, response,next) => {
  Phonebook.find({}).then(person => {
    response.json(person)
  }).catch(error => next(error))
})

// New /info route
app.get('/api/info', (request, response,next) => {
  Phonebook.countDocuments({})
  .then(count => {
    const requestTime = new Date().toString()
    response.send(`
      <p>Phonebook has info for ${count} people</p>
      <p>${requestTime}</p>
    `)
  })
  .catch(error => next(error))
})

// New /person route
 app.get('/api/persons/:id', (request,response,next) => {
  const { id } = request.params;
    Phonebook.findById(id)
    .then(person => {
      if (person) {
        response.json(person)
      }
      else {
        response.status(404).send({ error: 'Person not found' })
      }
    })
    .catch(error => next(error))
    
 })

//delet person
app.delete('/api/persons/:id', (request,response,next) => {
    Phonebook.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

//add a person

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  } else if (error.name === 'CastError') {
    return response.status(400).json({ error: 'malformatted id' });
  }

  next(error);

  next(error);
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})