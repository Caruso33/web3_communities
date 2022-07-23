const postCountQuery = `
query {
  counter(id: "post") {
    count
  }
}
`

const commentCountQuery = `
query {
  counter(id: "comment") {
    count
  }
}
`

const titleQuery = (search: string) => `
  query {
    postTitleSearch(text: "'${search}'") {
        id
        author
        title
        hash
        content
        published
        createdAt
    }
  }
`

const authorQuery = (author: string) => `
  query {
    posts(where: {author: "${author}"}) {
      id
      author
      title
      hash
      content
      published
      createdAt
    }
    comments(where: {author: "${author}"}) {
        id
        postId
        author
        hash
        content
        createdAt
    }
  }
`

const postSearchQuery = (search: string) => `
  query {
    postSearch(text: "'${search}'") {
        id
        author
        title
        hash
        content
        published
        createdAt
    }
  }
`

const commentSearchQuery = (search: string) => `
  query {
    commentSearch(text: "'${search}'") {
        id
        postId
        author
        content
        createdAt
    }
  }
`

function getSearchQuery(searchType: string, searchTerm: string) {
  switch (searchType) {
    case "Post Count":
      return postCountQuery

    case "Comment Count":
      return commentCountQuery

    case "Title":
      return titleQuery(searchTerm)

    case "Author":
      return authorQuery(searchTerm)

    case "Post Content":
      return postSearchQuery(searchTerm)

    case "Comment Content":
      return commentSearchQuery(searchTerm)

    default:
      throw Error(`Unknown search type: ${searchType}`)
  }
}
export { getSearchQuery as default }
