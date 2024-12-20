const { test, describe, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')


const api = supertest(app)

// Initialize the test database before executing all tests

const Blog = require('../models/blog')

const initialBlogs = [
  {
    'title': '1 Initial title',
    'author': 'Me',
    'url': 'https://examplelink.edu',
    'likes': 301,
    'id': '6761f3ac9946da04b76cab37'
  },
  {
    'title': '2 Initial title',
    'author': 'Me',
    'url': 'https://examplelink.edu',
    'likes': 234,
    'id': '6764a5d869c7d296d7075739'
  }
]

// Database is cleared out at the beginning
// After that initial blogs will be stored in database
// Doing this for ensuring that every test run DB is the same

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

// ------------------

describe('Database tests', () => {

  // For running test one by one we can use following syntax:
  // test.only('Blogs are returned as json', async () => {
  //  // ...
  // })

  // Then run 'only marked tests' with the option:
  // npm test -- --test-only

  // --------

  // Also we can run tests defined only in this file:
  // npm test -- tests/blog_api.test.js

  // or with specific pattern
  // npm test -- --test-name-pattern="There are two blogs"

  // or if every test name that contain specific word:
  // npm test -- --test-name-pattern="blogs"

  test('Blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('There are two blogs', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test('Somewhere in blogs there is a title "1 Initial title"', async () => {
    const response = await api.get('/api/blogs')

    const contents = response.body.map(e => e.title)
    assert.strictEqual(contents.includes('1 Initial title'), true)
  })

  after(async () => {
    await mongoose.connection.close()
  })

})