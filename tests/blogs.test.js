const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
describe('average', () => {
  test('dummy returns one', () => {
    const blogs = []
    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)})
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]
  const listWithMultipleBlogs = [
    {
      _id: '5a422aa71b54a676234d17f9',
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17fa',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17fb',
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
      likes: 10,
      __v: 0
    }
  ]
  const listWithNoBlogs = []
  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })
  test('when list has multiple blogs, equals the sum of likes', () => {
    const result = listHelper.totalLikes(listWithMultipleBlogs)
    assert.strictEqual(result, 29) // 7 + 12 + 10 = 29
  })
  test('when list is empty, equals zero', () => {
    const result = listHelper.totalLikes(listWithNoBlogs)
    assert.strictEqual(result, 0)
  })
})

describe('most favourite blog', () => {
  const listWithMultipleBlogs = [
    {
      _id: '5a422aa71b54a676234d17f9',
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17fa',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17fb',
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
      likes: 10,
      __v: 0
    }
  ]
  test('returns the blog with the most likes', () => {
    const result = listHelper.favoriteBlog(listWithMultipleBlogs)
    assert.deepStrictEqual(result, {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12
    })
  })

  test('returns null for an empty list', () => {
    const result = listHelper.favoriteBlog([])
    assert.strictEqual(result, null)
  })
})

describe('mostBlogs', () => {
  const blogs = [
    { author: 'Edsger W. Dijkstra' },
    { author: 'Edsger W. Dijkstra' },
    { author: 'Robert C. Martin' },
    { author: 'Robert C. Martin' },
    { author: 'Robert C. Martin' }
  ]
  test('returns the author with the most blogs and the number of blogs', () => {
    const result = listHelper.mostBlogs(blogs)
    assert.deepStrictEqual(result, {
      author: 'Robert C. Martin',
      blogs: 3
    })
  })
  test('returns null for an empty list', () => {
    const result = listHelper.mostBlogs([])
    assert.strictEqual(result, null)
  })
  test('returns the correct author when there is a tie', () => {
    const blogsWithTie = [
      { author: 'Author A' },
      { author: 'Author B' },
      { author: 'Author A' },
      { author: 'Author B' }
    ]
    const result = listHelper.mostBlogs(blogsWithTie)
    assert.ok(result.author === 'Author A' || result.author === 'Author B')
    assert.strictEqual(result.blogs, 2)
  })
})

describe('mostLikes', () => {
  const blogs = [
    { author: 'Edsger W. Dijkstra', likes: 5 },
    { author: 'Edsger W. Dijkstra', likes: 12 },
    { author: 'Robert C. Martin', likes: 10 },
    { author: 'Robert C. Martin', likes: 7 }
  ]

  test('returns the author with the most likes and the total number of likes', () => {
    const result = listHelper.mostLikes(blogs)
    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra',
      likes: 17
    })
  })

  test('returns null for an empty list', () => {
    const result = listHelper.mostLikes([])
    assert.strictEqual(result, null)
  })

  test('returns the correct author when there is a tie', () => {
    const blogsWithTie = [
      { author: 'Author A', likes: 10 },
      { author: 'Author B', likes: 10 },
      { author: 'Author A', likes: 5 },
      { author: 'Author B', likes: 5 }
    ]
    const result = listHelper.mostLikes(blogsWithTie)
    assert.ok(result.author === 'Author A' || result.author === 'Author B')
    assert.strictEqual(result.likes, 15)
  })
})