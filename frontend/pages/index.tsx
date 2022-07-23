import { Box, Heading, Spinner, Stack, Text } from "@chakra-ui/react"
import type { NextPage } from "next"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import PostCard from "../components/PostCard"
import useLoadContracts from "../hooks/useLoadContract"
import { Post, setPosts } from "../state/postComment"
import { RootState } from "../state/store"

const Home: NextPage = () => {
  useLoadContracts()

  const contractStore = useSelector((state: RootState) => state.contract)
  const postsCommentsStore = useSelector(
    (state: RootState) => state.postsComments
  )
  const dispatch = useDispatch()

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function fetchPosts() {
      const communityContract = contractStore?.community
      if (!communityContract || postsCommentsStore.isPostsLoaded) {
        return
      }

      try {
        setIsLoading(true)

        const posts = await communityContract?.fetchPosts()
        if (posts) {
          dispatch(setPosts(posts))
        }
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [
    contractStore?.community,
    postsCommentsStore.isPostsLoaded,
    postsCommentsStore.posts,
    dispatch,
  ])

  return (
    <Box>
      <Box m={5} overflow="auto">
        <Heading as="h1" noOfLines={1}>
          Home
        </Heading>

        <Stack mt={5} pb={5} spacing={8} direction="column" alignItems="center">
          {isLoading ? (
            <Spinner />
          ) : (
            postsCommentsStore.posts.map((post: Post, index) => {
              return <PostCard key={`${post.id}_${index}`} post={post} />
            })
          )}

          {postsCommentsStore.isPostsLoaded &&
            postsCommentsStore.posts.length === 0 && <Text>No posts yet</Text>}
        </Stack>
      </Box>
    </Box>
  )
}

export default Home
