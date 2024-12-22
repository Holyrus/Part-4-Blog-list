const blogRouter = require('express').Router()
const Blog = require('../models/blog')

// With async/await syntax

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

// -------------------------

// Without async/await syntax

// blogRouter.get('/', (request, response) => {
//   Blog
//     .find({})
//     .then(blogs => {
//       response.json(blogs)
//     })
// })

blogRouter.post('/', (request, response, next) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
    .catch(error => next(error))
})

// -----------------------------

module.exports = blogRouter