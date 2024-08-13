const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const User = require('../models/user')
const { test, describe,beforeEach,afterAll,expect } = require('node:test')
const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
})

describe('User creation', () => {
  test('succeeds with valid data', async () => {
    const newUser = {
      username: 'validuser',
      name: 'Valid User',
      password: 'password123',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const users = await User.find({})
    expect(users).toHaveLength(1)
    expect(users[0].username).toBe(newUser.username)
  })

  test('fails with a status code 400 if username is missing', async () => {
    const newUser = {
      name: 'Missing Username',
      password: 'password123',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toBe('Username and password are required')
  })

  test('fails with a status code 400 if password is missing', async () => {
    const newUser = {
      username: 'missingpassword',
      name: 'Missing Password',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toBe('Username and password are required')
  })

  test('fails with a status code 400 if username is too short', async () => {
    const newUser = {
      username: 'us',
      name: 'Short Username',
      password: 'password123',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toBe('Username and password must be at least 3 characters long')
  })

  test('fails with a status code 400 if password is too short', async () => {
    const newUser = {
      username: 'validusername',
      name: 'Short Password',
      password: 'pw',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toBe('Username and password must be at least 3 characters long')
  })

  test('fails with a status code 400 if username is not unique', async () => {
    const newUser = {
      username: 'duplicateuser',
      name: 'Duplicate User',
      password: 'password123',
    }

    await api.post('/api/users').send(newUser).expect(201)

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toBe('Username must be unique')
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
