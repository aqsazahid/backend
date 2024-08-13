const blogsRouter = require('express').Router()
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

blogsRouter.delete('/api/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findByIdAndRemove(req.params.id)
    if (blog) {
      res.status(204).end()
    } else {
      res.status(404).json({ error: 'Blog post not found' })
    }
  } catch (error) {
    res.status(400).json({ error: 'Invalid blog post id' })
  }
})

module.exports = blogsRouter
