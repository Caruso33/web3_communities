function queryResponse(
  searchType: string,
  data: any,
  { setPostCount, setCommentCount, setPosts, setComments }: any
) {
  console.log(`Subgraph query: ${searchType}, data: `)
  console.dir(data)

  switch (searchType) {
    case "Post Count":
      console.dir(data.counter.count)
      return setPostCount(data.counter.count)

    case "Comment Count":
      return setCommentCount(data.counter.count)

    case "Author":
      setPosts(data.posts)
      setComments(data.comments)
      break

    case "Title":
      setPosts(data.postTitleSearch)
      break

    case "Post Content":
      setPosts(data.postSearch)
      break

    case "Comment Content":
      setComments(data.commentSearch)
      break

    default:
      console.log("Unknown search type: ", searchType)
      break
  }
}

export default queryResponse
