const blogsRouter = require('express').Router()
require('dotenv').config()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blogs')
const  User = require('../models/user')
const middleware = require('../utils/middleware')

blogsRouter.use(middleware.tokenExtractor)
blogsRouter.use(middleware.userExtractor)
blogsRouter.post('/', async (req, res) => {
  const { title, author, url, likes = 0 } = req.body

  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)

    if (!decodedToken.id) {
      return res.status(401).json({ error: 'token invalid' })
    }

    const user = await User.findById(decodedToken.id)
    if (!title || !url) {
      return res.status(400).json({ error: 'title and url are required' })
    }

    const blog = new Blog({
      title,
      author,
      url,
      likes: likes || 0,
      user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    const populatedBlog = await Blog.findById(savedBlog._id).populate('user', { username: 1, name: 1 })
    res.status(201).json(populatedBlog)
  } catch (error) {
    res.status(400).json({ error: 'unable to save the blog post' })
  }
})

blogsRouter.put('/:id', async (req, res) => {
  const { id } = req.params
  const { title, author, url, likes } = req.body

  const blog = {
    title,
    author,
    url,
    likes
  }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(id, blog, { new: true })
    res.json(updatedBlog)
  } catch (error) {
    res.status(500).json({ error: 'something went wrong' })
  }
})

blogsRouter.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    res.json(blogs)
  } catch (error) {
    res.status(500).json({ error: 'something went wrong' })
  }
})


blogsRouter.delete('/:id', async (req, res) => {
  const user = req.user
  const blog = await Blog.findById(req.params.id)
  if (!blog) {
    return res.status(404).json({ error: 'blog not found' })
  }

  if (blog.user.toString() !== user._id.toString()) {
    return res.status(403).json({ error: 'only the creator can delete this blog' })
  }

  await Blog.deleteOne({ _id: req.params.id })
  res.status(204).end()
})

module.exports = blogsRouter
