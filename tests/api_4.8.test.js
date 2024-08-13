const supertest = require('supertest')
const config = require('../utils/config')
const { test, describe,before,beforeEach,after } = require('node:test')
const assert = require('assert')
const mongoose = require('mongoose')
const app = require('../app')
const Blog = require('../models/blogs')
const User = require('../models/user')
const jwt = require('jsonwebtoken');
const api = supertest(app)

before(async () => {
  await mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
})
let token = ''

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  const user = new User({
    username: 'testuser',
    name: 'Test User',
    passwordHash: 'passwordhash' // Make sure to replace with real hash in actual tests
  })
  await user.save()

  token = jwt.sign({ id: user._id }, process.env.SECRET, { algorithm: 'HS256' })

  const initialBlogs = [
    { title: 'First Blog', author: 'Author A', url: 'http://example.com', likes: 5 },
    { title: 'Second Blog', author: 'Author B', url: 'http://example.com', likes: 3 },
  ]

  await Blog.insertMany(initialBlogs)
})


after(async () => {
  await mongoose.connection.close()
})
