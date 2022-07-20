import { ChevronRightIcon } from "@chakra-ui/icons"
import { Box, Button, Heading, Spinner, Stack, Text } from "@chakra-ui/react"
import type { NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { PostStruct } from "../../typechain-types/contracts/Community"
import { useIsMounted } from "../hooks"
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
      const communityContract = contractStore?.communityProvider
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
    contractStore?.communityProvider,
    postsCommentsStore.isPostsLoaded,
    postsCommentsStore.posts,
    dispatch,
  ])

  return (
    <Box>
      <Box m={5} overflow="auto">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Heading as="h1" noOfLines={1}>
            Home
          </Heading>

          <Button>
            <Link href="/create-post"> Create Post</Link>
          </Button>
        </Box>

        <Stack mt={5} spacing={8}>
          {isLoading ? (
            <Spinner />
          ) : (
            postsCommentsStore.posts.map((post: PostStruct, index) => {
              return (
                <Box
                  display="flex"
                  p={5}
                  shadow="md"
                  borderWidth="1px"
                  w="60vw"
                  key={`${post.title}_${index}`}
                >
                  <Link href={`/post/${post.id}`}>
                    <Box w="100%" style={{ cursor: "pointer" }}>
                      <ChevronRightIcon
                        boxSize={50}
                        style={{ height: "100%", float: "right" }}
                      />

                      <Heading fontSize="xl">{post.title}</Heading>
                      <Text>by {post.author}</Text>

                      <Text noOfLines={3}>Content: {post.content}</Text>
                    </Box>
                  </Link>
                </Box>
              )
            })
          )}
        </Stack>
      </Box>
    </Box>
  )
}

export default Home
