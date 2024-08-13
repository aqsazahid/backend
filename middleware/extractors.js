// utils/middleware.js
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.substring(7)
  } else {
    req.token = null
  }
  next()
}

const userExtractor = async (req, res, next) => {
  if (req.token) {
    try {
      const decodedToken = jwt.verify(req.token, process.env.SECRET, { algorithms: ['HS256'] })
      if (decodedToken.id) {
        const user = await User.findById(decodedToken.id)
        if (user) {
          req.user = user
        } else {
          return res.status(401).json({ error: 'user not found' })
        }
      } else {
        return res.status(401).json({ error: 'token invalid' })
      }
    } catch (error) {
      return res.status(401).json({ error: 'token verification failed' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

module.exports = {
  tokenExtractor,
  userExtractor,
}
