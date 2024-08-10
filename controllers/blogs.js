const blogsRouter = require('express').Router()
const Blog = require('../models/blogs')
// const express = require('express')
// const router = express.Router()

// blogsRouter.get('/', (request, response,next) => {
//   Blog.find({}).then(blogs => {
//     response.json(blogs)
//   }).catch(error => next(error))
// })

// blogsRouter.post('/', (request, response,next) => {
//   const blog = new Blog(request.body)
//   blog
//     .save()
//     .then(result => {
//       response.status(201).json(result)
//     }).catch(error => next(error))
// })

blogsRouter.post('/', async (req, res) => {
  try {
    const blog = new Blog(req.body)
    const savedBlog = await blog.save()
    res.status(201).json(savedBlog)
  } catch (error) {
    res.status(400).json({ error: 'unable to save the blog post' })
  }
})

blogsRouter.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({})
    res.json(blogs)
  } catch (error) {
    res.status(500).json({ error: 'something went wrong' })
  }
})

module.exports = blogsRouter
