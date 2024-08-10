const supertest = require('supertest')
const config = require('../utils/config')
const { test, describe,before,beforeEach,after } = require('node:test')
const assert = require('assert')
const mongoose = require('mongoose')
const app = require('../app') // Path to your Express app
const Blog = require('../models/blogs') // Path to your Blog model

const api = supertest(app)

before(async () => {
  await mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
})

beforeEach(async () => {
  await Blog.deleteMany({})

  const initialBlogs = [
    { title: 'First Blog', author: 'Author A', url: 'http://example.com', likes: 5 },
    { title: 'Second Blog', author: 'Author B', url: 'http://example.com', likes: 3 },
  ]

  await Blog.insertMany(initialBlogs)
})

describe('GET /api/blogs', () => {
  test('should verify that the unique identifier property of the blog posts is named id', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogs = response.body
    blogs.forEach(blog => {
      assert(blog.id) // Check if id property exists
      assert.strictEqual(blog._id, undefined) // Ensure _id is not present
      assert.strictEqual(blog.__v, undefined) // Ensure __v is not present
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
