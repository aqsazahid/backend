const express = require('express')
const app = express()
app.use(express.json()); 
let phonebook = [
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
  

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

// New /info route
app.get('/info', (request, response) => {
    const entryCount = notes.length
    const requestTime = new Date().toString()
  
    response.send(`
      <p>Phonebook has info for ${entryCount} people</p>
      <p>${requestTime}</p>
    `)
})

// New /person route
 app.get('/api/persons/:id', (request,response) => {
    const id =  Number(request.params.id)
    const person = phonebook.find(person => person.id === id)
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
    if (idExists(phonebook, id)) {
      phonebook = phonebook.filter(person => person.id !== id)
      res.status(204).end()
    } else {
      res.status(404).send({ error: 'Person not found' })
    }
})

//add a person
const generateId = () => {
    return Math.floor(Math.random() * 1000000);
};

app.post('/api/persons', (req, res) => {
    const body = req.body;
    // Check if name or number is missing
    if (!body.name || !body.number) {
      return res.status(400).json({
        error: 'name or number is missing'
      });
    }
    // Check if name already exists in the phonebook
    const nameExists = phonebook.some(person => person.name === body.name);
    if (nameExists) {
      return res.status(400).json({
        error: 'name must be unique'
      });
    }
  
    const newPerson = {
      id: generateId(),
      name: body.name,
      number: body.number
    };
  
    phonebook = phonebook.concat(newPerson);
    res.json(newPerson);
});

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})