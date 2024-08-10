const supertest = require('supertest')
const config = require('../utils/config')
const assert = require('assert')
const mongoose = require('mongoose')
const { test, describe,before,beforeEach,after } = require('node:test')
const app = require('../app') // Path to your Express app
const Blog = require('../models/blogs') // Path to your Blog model

const api = supertest(app)

before(async () => {
  await mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
})

beforeEach(async () => {
  await Blog.deleteMany({})
})

describe('POST /api/blogs', () => {

  test('should respond with 400 Bad Request if title is missing', async () => {
    const newBlog = {
      author: 'Author E',
      url: 'http://example.com/blog-without-title',
      likes: 5,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400) // Expecting 400 Bad Request
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
      .expect(400) // Expecting 400 Bad Request
  })

})

after(async () => {
  await mongoose.connection.close()
})
