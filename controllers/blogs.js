const blogsRouter = require('express').Router()
require('dotenv').config()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blogs')
const  User = require('../models/user')

blogsRouter.post('/', async (req, res) => {
  const { title, author, url, likes = 0 } = req.body

  const decodedToken = jwt.verify(req.token, process.env.SECRET)
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findOne()
  if (!title || !url) {
    return res.status(400).json({ error: 'title and url are required' })
  }
  try {
    const blog = new Blog({
      title,
      author,
      url,
      likes: likes || 0,
      user: user._id, // Assign the user's ID as the creator
    })
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    res.status(201).json(savedBlog)
  } catch (error) {
    res.status(400).json({ error: 'unable to save the blog post' })
  }
})

blogsRouter.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
    // const blogs = await Blog.find({})
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
    return res.status(403).json({ error: 'only the creator can delete this blog' });
  }
  await blog.remove()
  res.status(204).end()
})

module.exports = blogsRouter
