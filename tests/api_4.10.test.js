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

describe('POST /api/blogs', () => {
  test('should successfully create a new blog post', async () => {
    const newBlog = {
      title: 'New Blog Post',
      author: 'Author C',
      url: 'http://example.com/new-blog',
      likes: 10,
    }

    const blogsAtStart = await Blog.find({})

    // Make the POST request
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    // Get the updated list of blogs
    const blogsAtEnd = await Blog.find({})
    console.log(blogsAtEnd)
    // Verify that the number of blogs increased by one
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)

    // Verify that the new blog post was saved correctly
    const titles = blogsAtEnd.map(blog => blog.title)
    assert(titles.includes(newBlog.title))

    const savedBlog = await Blog.findOne({ title: 'New Blog Post' })
    assert(savedBlog)
    assert.strictEqual(savedBlog.author, newBlog.author)
    assert.strictEqual(savedBlog.url, newBlog.url)
    assert.strictEqual(savedBlog.likes, newBlog.likes)
  })
})

after(async () => {
  await mongoose.connection.close()
})
