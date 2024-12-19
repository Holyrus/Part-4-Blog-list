const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs[0].likes
}

const favoriteBlog = (blogs) => {
  const largest = blogs.reduce((max, obj) => {
    return obj.likes > max.likes ? obj : max
  })

  return {
    author: largest.author,
    likes: largest.likes,
    title: largest.title
  }
}

const mostBlogs = (blogs) => {
  const nameCounts = blogs.reduce((counts, obj) => {
    counts[obj.author] = (counts[obj.author] || 0) + 1
    return counts
  }, {})

  let mostMentioned = { author: null, blogs: 0 }

  for (const [author, count] of Object.entries(nameCounts)) {
    if (count > mostMentioned.blogs) {
      mostMentioned = { author, blogs: count }
    }
  }

  return mostMentioned
}

const mostLikes = (blogs) => {
  const authorSums = blogs.reduce((sums, obj) => {
    sums[obj.author] = (sums[obj.author] || 0) + obj.likes
    return sums
  }, {})

  let mostLikes = { author: null, likes: 0 }

  for (const [author, sum] of Object.entries(authorSums)) {
    if (sum > mostLikes.likes) {
      mostLikes = { author, likes: sum }
    }
  }

  return mostLikes
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}