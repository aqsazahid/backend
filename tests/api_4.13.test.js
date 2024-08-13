const supertest = require('supertest')
const config = require('../utils/config')
const assert = require('assert')
const mongoose = require('mongoose')
const { test, describe,before,beforeEach,after } = require('node:test')
const app = require('../app')
const Blog = require('../models/blogs')
const  User = require('../models/user')
const api = supertest(app)
let token = ''
before(async () => {
  await mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
})

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  const blog1 = new Blog({ title: 'Blog 1', author: 'Author A', url: 'http://example.com/blog1', likes: 5 })
  const blog2 = new Blog({ title: 'Blog 2', author: 'Author B', url: 'http://example.com/blog2', likes: 10 })
  const user = new User({
    username: 'testuser',
    name: 'Test User',
    passwordHash: 'passwordhash'
  })
  await user.save()

  token = jwt.sign({ id: user._id }, process.env.SECRET, { algorithm: 'HS256' })
  await blog1.save()
  await blog2.save()
})

describe('DELETE /api/blogs/:id', () => {
  test('should successfully delete a blog post', async () => {
    const blogsAtStart = await Blog.find({})
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204) // Expecting 204 No Content

    const blogsAtEnd = await Blog.find({})
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
  })

  test('should return 404 if the blog post does not exist', async () => {
    const nonExistentId = new mongoose.Types.ObjectId()

    await api
      .delete(`/api/blogs/${nonExistentId}`)
      .expect(404)
  })

  test('should return 400 if the blog ID is invalid', async () => {
    await api
      .delete('/api/blogs/invalidid')
      .expect(400)
  })
})

after(async () => {
  await mongoose.connection.close()
})
