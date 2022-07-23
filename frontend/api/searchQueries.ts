const postsQuery = `
  query {
    posts(orderBy: createdAt, orderDirection: desc) {
        id
      }
  }
`

const commentsQuery = `
    query {
        comments(orderBy: createdAt, orderDirection: desc) {
            id
        }
    }

`

const titleQuery = (title: string) => `
    query {
        posts(where: {title: ${title}}) {
            id
            content
            createdAt
        }
    }
`

const authorQuery = (author: string) => `
    query {
        posts(where: {author: ${author}}) {
            id
            title
            createdAt
        }
        comments(where: {author: ${author}}) {
            id
            postId
            createdAt
        }
    }
`

const postSearchQuery = (search: string) => `
    query {
        postSearch(text: ${search}) {
            id
            title
            content
            published
            createdAt
        }
    }
`

const commentSearchQuery = (search: string) => `
    query {
        commentSearch(text: ${search}) {
            id
            content
            createdAt
        }
    }
`

function getSearchQuery(searchType: string, searchTerm: string) {
  switch (searchType) {
    case "posts":
      return postsQuery

    case "comments":
      return commentsQuery

    case "title":
      return titleQuery(searchTerm)

    case "author":
      return authorQuery(searchTerm)

    case "postContent":
      return postSearchQuery(searchTerm)

    case "commentContent":
      return commentSearchQuery(searchTerm)

    default:
      return ""
  }
}
export { getSearchQuery as default }
