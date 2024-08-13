const supertest = require('supertest')
const config = require('../utils/config')
const { test, describe, before, beforeEach, after } = require('node:test')
const assert = require('assert')
const mongoose = require('mongoose')
const app = require('../app')
const Blog = require('../models/blogs')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
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
    passwordHash: 'passwordhash' // Ideally, hash this password using bcrypt
  })
  await user.save()

  token = jwt.sign({ id: user._id }, process.env.SECRET, { algorithm: 'HS256' })
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
    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    // Get the updated list of blogs
    const blogsAtEnd = await Blog.find({})
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

  test('should fail to add a new blog without a token', async () => {
    const newBlog = {
      title: 'Test blog without token',
      author: 'No Token Author',
      url: 'http://example.com/no-token',
      likes: 5,
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    // Ensure the response contains the correct error message
    assert(response.body.error.includes('token missing'))

    const blogsAtEnd = await Blog.find({})
    assert.strictEqual(blogsAtEnd.length, 0)
  })
})

after(async () => {
  await mongoose.connection.close()
})
