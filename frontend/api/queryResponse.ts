function queryResponse(
  searchType: string,
  data: any,
  { setPosts, setComments }: any
) {
  console.log(`Subgraph query: ${searchType}, data: `)
  console.dir(data)

  switch (searchType) {
    case "posts":
      return setPosts(data.posts)

    case "comments":
      return setComments(data.comments)

    case "title":
      data.posts.forEach((post) => {
        console.log("Post: ", post)
      })
      break
    case "author":
      data.posts.forEach((post) => {
        console.log("Post: ", post)
      })
      data.comments.forEach((comment) => {
        console.log("Comment: ", comment)
      })

      break

    case "postSearch":
      data.postSearch.forEach((post) => {
        console.log("Post: ", post)
      })
      break
    case "commentSearch":
      data.commentSearch.forEach((comment) => {
        console.log("Comment: ", comment)
      })
      break

    default:
      console.log("Unknown search type: ", searchType)
      break
  }
}

export default queryResponse
