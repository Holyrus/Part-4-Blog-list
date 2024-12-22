const { test, describe, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const helper = require('./test_helper')

const api = supertest(app)

const Blog = require('../models/blog')

// Database is cleared out at the beginning
// After that initial blogs will be stored in database
// Doing this for ensuring that every test run DB is the same

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(helper.initialBlogs[1])
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

  test('All blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('Somewhere in blogs there is a title "1 Initial title"', async () => {
    const response = await api.get('/api/blogs')

    const contents = response.body.map(e => e.title)
    assert.strictEqual(contents.includes('1 Initial title'), true)
  })

  // Adding new blog and verifies the number of blogs returned by
  // the API increases adn that the newly added blog is in the list.

  test('A valid blog can be added ', async () => {
    const newBlog = {
      'title': 'Test blog',
      'author': 'Me',
      'url': 'https://examplelink.edu',
      'likes': 909
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(blog => blog.title)
    assert(titles.includes('Test blog'))
  })

  // Test that verifies that a blog without title won't not be saved into the DB

  test('Blog without title is not added', async () => {
    const newBlog = {
      'author': 'Me',
      'url': 'https://examplelink.edu',
      'likes': 909
    }

    await api
      .post ('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length, 'Blog count should not increase')
  })

  // Test for check of ability of fetching individual blog

  test('A specific blog can be viewed', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const blogToView = blogsAtStart[0]

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.deepStrictEqual(resultBlog.body, blogToView)
  })

  after(async () => {
    await mongoose.connection.close()
  })

})