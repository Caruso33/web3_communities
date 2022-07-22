import { ChevronRightIcon } from "@chakra-ui/icons"
import { Box, Heading, Link, Spinner, Stack, Text } from "@chakra-ui/react"
import type { NextPage } from "next"
import { default as NextLink } from "next/link"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import useLoadContracts from "../hooks/useLoadContract"
import { setPosts } from "../state/postComment"
import { RootState } from "../state/store"
import type { Community } from "../typechain-types/contracts/Community"

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
            postsCommentsStore.posts.map(
              (post: Community.PostStruct, index) => {
                return (
                  <Box
                    key={`${post.id}_${index}`}
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
                    <Box w="100%" style={{ cursor: "pointer" }}>
                      <NextLink href={`/post/${post.content}`} passHref>
                        <Link>
                          <ChevronRightIcon
                            boxSize={50}
                            style={{ height: "100%", float: "right" }}
                          />

                          <Box>
                            <Heading fontSize="xl">
                              {post.title as string}
                            </Heading>
                            <Text noOfLines={1}>
                              by {post.author as string}
                            </Text>
                          </Box>
                        </Link>
                      </NextLink>

                      <NextLink
                        href={`https://ipfs.io/ipfs/${post.content}`}
                        passHref
                      >
                        <Box mt={5}>
                          <Link>
                            <Text noOfLines={3}>
                              Content at: {post.content as string}
                            </Text>
                          </Link>
                        </Box>
                      </NextLink>
                    </Box>
                  </Box>
                )
              }
            )
          )}

          {postsCommentsStore.isPostsLoaded &&
            postsCommentsStore.posts.length === 0 && <Text>No posts yet</Text>}
        </Stack>
      </Box>
    </Box>
  )
}

export default Home
