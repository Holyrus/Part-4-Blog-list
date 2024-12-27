const Blog = require('../models/blog')

// Initialize the test database before executing all tests

const initialBlogs = [
  {
    'title': '1 Initial title',
    'author': 'Me',
    'url': 'https://examplelink.edu',
    'likes': 301
  },
  {
    'title': '2 Initial title',
    'author': 'Me',
    'url': 'https://examplelink.edu',
    'likes': 234
  }
]

const nonExistingId = async () => {
  const blog = new Blog( {
    'title': 'Will remove this soon',
    'author': 'Me',
    'url': 'https://examplelink.edu',
    'likes': 404
  } )
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}