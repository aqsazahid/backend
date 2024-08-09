const personRouter = require('express').Router()
const Phonebook = require('../models/phonebook')

personRouter.get('/', (request, response) => {
  response.redirect('/api/persons')
})

//add new peson
personRouter.post('/', async(request, response,next) => {
  const body = request.body
  // Check if name or number is missing
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number is missing'
    })
  }
  try {
    const existingPerson = await Phonebook.findOne({ name: body.name })
    if (existingPerson) {
      return response.status(400).json({ error: 'name must be unique' })
    }
    const person = new Phonebook({
      name: body.name,
      number: body.number
    })

    const savedPerson = await person.save()
    response.json(savedPerson)
  } catch (error) {
    next(error)
  }
})

//update signle person
personRouter.put('/:id',async (request,response,next) => {
  const body = request.body
  const updatedPerson = {
    name: body.name,
    number: body.number,
  }
  try {
    const result = await Phonebook.findByIdAndUpdate(request.params.id, updatedPerson, { new: true, runValidators: true, context: 'query' })
    if (result) {
      response.json(result)
    } else {
      response.status(404).send({ error: 'Person not found' })
    }
  } catch (error) {
    next(error)
  }
})

//get all persons
personRouter.get('/', (request, response,next) => {
  Phonebook.find({}).then(person => {
    response.json(person)
  }).catch(error => next(error))
})

// New /info route
personRouter.get('/info', (request, response,next) => {
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
personRouter.get('/:id', (request,response,next) => {
  const { id } = request.params
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
personRouter.delete('/:id', (request,response,next) => {
  Phonebook.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})
module.exports = personRouter