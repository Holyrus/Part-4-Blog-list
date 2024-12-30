const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

// With using express-async-errors
// npm install express-async-errors
// We dont need to call next(exception) anymore.

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findById(body.userId)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

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

blogRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  await Blog.findByIdAndUpdate(request.params.id, blog, { new: true, runValidators: true, context: 'query' })
  response.json(blog)
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