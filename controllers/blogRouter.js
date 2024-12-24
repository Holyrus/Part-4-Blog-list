const blogRouter = require('express').Router()
const Blog = require('../models/blog')

// With using express-async-errors
// npm install express-async-errors
// We dont need to call next(exception) anymore.

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

blogRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

// -------------------------------

// With async/await syntax

// blogRouter.get('/', async (request, response) => {
//   const blogs = await Blog.find({})
//   response.json(blogs)
// })

// blogRouter.post('/', async (request, response, next) => {
//   const blog = new Blog(request.body)

//   try {
//     const savedBlog = await blog.save()
//     response.status(201).json(savedBlog)
//   } catch(exception) {
//     next(exception)
//   }
// })

// blogRouter.get('/:id', async (request, response, next) => {
//   try {
//     const blog = await Blog.findById(request.params.id)
//     if (blog) {
//       response.json(blog)
//     } else {
//       response.status(404).end()
//     }
//   } catch(exception) {
//     next(exception)
//   }
// })

// blogRouter.delete('/:id', async (request, response, next) => {
//   try {
//     await Blog.findByIdAndDelete(request.params.id)
//     response.status(204).end()
//   } catch(exception) {
//     next(exception)
//   }
// })

// -------------------------

// Without async/await syntax

// blogRouter.get('/', (request, response) => {
//   Blog
//     .find({})
//     .then(blogs => {
//       response.json(blogs)
//     })
// })

// blogRouter.get('/:id', (request, response, next) => {
//   Blog.findById(request.params.id)
//     .then(blog => {
//       if (blog) {
//         response.json(blog)
//       } else {
//         response.status(404).end()
//       }
//     })
//     .catch(error => next(error))
// })

// blogRouter.post('/', (request, response, next) => {
//   const blog = new Blog(request.body)

//   blog
//     .save()
//     .then(result => {
//       response.status(201).json(result)
//     })
//     .catch(error => next(error))
// })

// blogRouter.delete('/:id', (request, response, next) => {
//   Blog.findByIdAndDelete(request.params.id)
//     .then(() => {
//       response.status(204).end()
//     })
//     .catch(error => next(error))
// })

// -----------------------------

module.exports = blogRouter