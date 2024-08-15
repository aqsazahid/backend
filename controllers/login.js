const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  if (!username || !password) {
    return response.status(400).json({ error: 'Username and password required' })
  }

  const user = await User.findOne({ username })

  if (!user) {
    return response.status(401).json({ error: 'Invalid username or password' })
  }

  const passwordCorrect = await bcrypt.compare(password, user.passwordHash)

  if (!passwordCorrect) {
    return response.status(401).json({ error: 'Invalid username or password' })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: '1h' })

  response.status(200).send({ token, username: user.username, name: user.name })
})


module.exports = loginRouter