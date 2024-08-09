const notesRouter = require('express').Router()
const Note = require('../models/note')

//get data from database
notesRouter.get('/', (request, response,next) => {
  Note.find({}).then(notes => {
    response.json(notes)
  }).catch(error => next(error))
})

//post
notesRouter.post('/', (request, response,next) => {
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
  }).catch(error => next(error))
})

module.exports = notesRouter