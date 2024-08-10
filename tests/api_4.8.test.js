const supertest = require('supertest')
const config = require('../utils/config')
const { test, describe,before,beforeEach,after } = require('node:test')
const assert = require('assert')
const mongoose = require('mongoose')
const app = require('../app')
const Blog = require('../models/blogs')

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

// describe('GET /api/blogs', () => {
//   test('should return blogs as JSON and correct number', async () => {
//     const response = await api
//       .get('/api/blogs')
//       .expect(200)
//       .expect('Content-Type', /application\/json/)

//     assert.strictEqual(response.body.length, 7)
//   })
// })

after(async () => {
  await mongoose.connection.close()
})
