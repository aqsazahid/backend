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
  test('should default likes to 0 if it is missing from the request', async () => {
    const newBlog = {
      title: 'Blog without likes',
      author: 'Author D',
      url: 'http://example.com/blog-without-likes',
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const savedBlog = response.body
    assert.strictEqual(savedBlog.likes, 0) // Verify that likes is 0
  })
})

after(async () => {
  await mongoose.connection.close()
})
