const supertest = require('supertest')
const config = require('../utils/config')
const assert = require('assert')
const mongoose = require('mongoose')
const { test, describe,before,beforeEach,after } = require('node:test')
const app = require('../app') // Path to your Express app
const Blog = require('../models/blogs') // Path to your Blog model
const  User = require('../models/user')
const jwt = require('jsonwebtoken')
const api = supertest(app)
let token = ''
before(async () => {
  await mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
})

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const user = new User({
    username: 'testuser',
    name: 'Test User',
    passwordHash: 'passwordhash'
  })
  await user.save()

  token = jwt.sign({ id: user._id }, process.env.SECRET, { algorithm: 'HS256' })
})

describe('POST /api/blogs', () => {

  test.only('should respond with 400 Bad Request if title is missing', async () => {
    const newBlog = {
      author: 'Author E',
      url: 'http://example.com/blog-without-title',
      likes: 5,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
  })

  test('should respond with 400 Bad Request if url is missing', async () => {
    const newBlog = {
      title: 'Blog without URL',
      author: 'Author F',
      likes: 5,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })

})

after(async () => {
  await mongoose.connection.close()
})
