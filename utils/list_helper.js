const _ = require('lodash')
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  // Handle empty array
  if (blogs.length === 0) return null

  // Find the maximum number of likes
  const maxLikes = Math.max(...blogs.map(blog => blog.likes))

  // Find the blog(s) with the maximum number of likes
  const favBlog = blogs.find(blog => blog.likes === maxLikes)

  // Return the blog with the most likes
  return {
    title: favBlog.title,
    author: favBlog.author,
    likes: favBlog.likes
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null
  // Group blogs by author
  const groupedByAuthor = _.groupBy(blogs, 'author')
  // Count blogs per author
  const authorBlogCounts = _.mapValues(groupedByAuthor, (blogs) => blogs.length)
  // Find the author with the maximum number of blogs
  const topAuthor = _.maxBy(_.keys(authorBlogCounts), (author) => authorBlogCounts[author])
  return {
    author: topAuthor,
    blogs: authorBlogCounts[topAuthor]
  }
}
const mostLikes = (blogs) => {
  if (blogs.length === 0) return null
  const groupedByAuthor = _.groupBy(blogs, 'author')
  const authorLikes = _.mapValues(groupedByAuthor, (blogs) => _.sumBy(blogs, 'likes'))
  console.log(authorLikes)
  // Find the author with the maximum likes
  const topAuthor = _.maxBy(_.keys(authorLikes), (author) => authorLikes[author])

  return {
    author: topAuthor,
    likes: authorLikes[topAuthor]
  }
}
module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }