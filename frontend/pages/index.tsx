import { ChevronRightIcon } from "@chakra-ui/icons"
import { Box, Heading, HStack, Spinner, Stack, Text } from "@chakra-ui/react"
import type { NextPage } from "next"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { PostStruct } from "../../typechain-types/contracts/Community"
import useLoadContracts from "../hooks/useLoadContract"
import { setPosts } from "../state/postComment"
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
            postsCommentsStore.posts.map((post: PostStruct, index) => {
              return (
                <Box
                  key={`${post.title}_${index}`}
                  display="flex"
                  p={5}
                  shadow="md"
                  borderWidth="1px"
                  w="60vw"
                  _hover={{
                    shadow: "xl",
                    borderWidth: "2px",
                  }}
                >
                  <Link href={`/post/${post.content}`}>
                    <Box w="100%" style={{ cursor: "pointer" }}>
                      <ChevronRightIcon
                        boxSize={50}
                        style={{ height: "100%", float: "right" }}
                      />

                      <Heading fontSize="xl">{post.title}</Heading>
                      <Text noOfLines={1}>by {post.author}</Text>

                      <Text noOfLines={3}>Content at: {post.content}</Text>
                    </Box>
                  </Link>
                </Box>
              )
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
