import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react"
import { fromUnixTime } from "date-fns"
import "easymde/dist/easymde.min.css"
import dynamic from "next/dynamic"
import Image from "next/image"
import { default as NextLink } from "next/link"
import { useRouter } from "next/router"
import { useLayoutEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import { useDispatch, useSelector } from "react-redux"
import { useAccount, useSigner } from "wagmi"
import type { Community } from "../../../typechain-types/contracts/Community"
import useFetchCommentsOfPost from "../../hooks/useFetchCommentsOfPost"
import useFetchPostByHash from "../../hooks/useFetchPostByHash"
import useLoadContracts from "../../hooks/useLoadContract"
import {
  Comment,
  Post,
  setComments,
  setIsCommentsLoaded,
  setIsPostLoaded,
  setPost,
} from "../../state/postComment"
import { RootState } from "../../state/store"
import savePostToIpfs from "../../utils/saveToIpfs"

/* configure the markdown editor to be client-side import */
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
})

export default function PostDetail() {
  useLoadContracts()

  const { address } = useAccount()
  const { data: signer } = useSigner()

  const router = useRouter()
  const { hash } = router.query

  const contractStore = useSelector((state: RootState) => state.contract)
  const postsCommentsStore = useSelector(
    (state: RootState) => state.postsComments
  )
  const dispatch = useDispatch()

  const [isLoading, setIsLoading] = useState(false)

  const [writeComment, setWriteComment] = useState(false)
  const [comment, setComment] = useState("")

  useFetchPostByHash(hash as string)
  useFetchCommentsOfPost()

  useLayoutEffect(() => {
    return () => {
      dispatch(setPost(null))
      dispatch(setIsPostLoaded(false))

      dispatch(setComments([]))
      dispatch(setIsCommentsLoaded(false))
    }
  }, [dispatch])

  async function createComment() {
    const communityContract = contractStore?.community as Community
    if (!communityContract) {
      throw new Error(
        "No community contract found. Please make sure to be connected with Metamask."
      )
    }

    if (!signer) {
      throw new Error(
        "No signer found. Please make sure to be connected with Metamask."
      )
    }

    if (!postsCommentsStore.post) {
      throw new Error("No post found. Please reload page.")
    }

    try {
      setIsLoading(true)

      const data = {
        author: await signer.getAddress(),
        postId: (postsCommentsStore.post as Post).id,
        content: comment,
      }

      // IPFS
      const cid = (await savePostToIpfs(
        data,
        `${new Date().toLocaleString().replaceAll(/(\W)/g, "_")}_${
          (postsCommentsStore.post as Post).id
        }_comment.json`
      )) as string
      if (!cid) throw Error("Failed to save comment to IPFS")

      // Smart Contract
      const tx = await communityContract
        .connect(signer)
        .createComment(postsCommentsStore.post.id, cid)
      await tx.wait()

      // local state
      setComment("")
      setWriteComment(!writeComment)

      // global state
      dispatch(setComments([]))
      dispatch(setIsCommentsLoaded(false))
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const EditLink = address &&
    postsCommentsStore.post &&
    address === postsCommentsStore.post?.author &&
    null && (
      <Box alignSelf="flex-end" mr={5}>
        <NextLink href={`/edit-post/${hash}`} passHref>
          <Link>Edit post</Link>
        </NextLink>
      </Box>
    )

  const CoverImage = postsCommentsStore.post?.coverImage && (
    <Box mb={5} h={300} w={300}>
      <Image
        src={postsCommentsStore.post.coverImage}
        alt="Cover image"
        width="100%"
        height="100%"
        sizes="100%"
        layout="responsive"
        objectFit="cover"
        crossOrigin="anonymous"
        unoptimized={true}
      />
    </Box>
  )

  return (
    <Stack mt={5} spacing={8} direction="column" alignItems="center">
      {postsCommentsStore.isPostLoading ? (
        <Spinner />
      ) : (
        postsCommentsStore.post && (
          <>
            {EditLink}

            {CoverImage}

            <Flex w="60vw" flexDirection="column">
              <Text noOfLines={1} as="i" alignSelf="flex-end" px={2}>
                by {postsCommentsStore.post?.author as string}
              </Text>
              <Text alignSelf="flex-end" px={2}>
                {fromUnixTime(
                  postsCommentsStore.post?.createdAt?.toNumber()
                ).toLocaleString()}
              </Text>

              <Heading textAlign="center" as="h1" my={5}>
                {postsCommentsStore.post?.title as string}
              </Heading>

              <Box alignSelf="flex-start" mb={50}>
                <ReactMarkdown>{postsCommentsStore.post.content}</ReactMarkdown>
              </Box>

              {postsCommentsStore.isCommentsLoading ? (
                <Box textAlign="center">
                  <Spinner />
                </Box>
              ) : (
                <Stack pb={5} spacing={3}>
                  <Box mb={5}>
                    <Button
                      mb={5}
                      onClick={() => setWriteComment(!writeComment)}
                      isDisabled={isLoading}
                    >
                      {isLoading ? (
                        <Spinner />
                      ) : (
                        `${writeComment ? "Hide" : "Add"} Comment`
                      )}
                    </Button>

                    {writeComment && (
                      <>
                        <SimpleMDE
                          placeholder="What's on your mind?"
                          value={comment}
                          onChange={setComment}
                        />

                        <Button
                          alignSelf="flex-end"
                          onClick={() => createComment()}
                          isDisabled={isLoading}
                        >
                          {isLoading ? <Spinner /> : "Create Comment"}
                        </Button>
                      </>
                    )}
                  </Box>

                  <Heading as="h2" mb={5}>
                    Comments
                  </Heading>

                  {postsCommentsStore.comments.map(
                    // @ts-ignore
                    (comment: Comment, index) => (
                      <Flex
                        key={`${comment.id}_${index}`}
                        w="100%"
                        p={5}
                        shadow="md"
                        borderWidth="1px"
                        flexDirection="column"
                      >
                        <Text noOfLines={1} as="i" alignSelf="flex-end" px={2}>
                          by {comment.author as string}
                        </Text>
                        <Text alignSelf="flex-end" px={2}>
                          {fromUnixTime(
                            comment.createdAt?.toNumber()
                          ).toLocaleString()}
                        </Text>

                        <Box mt={5}>
                          <ReactMarkdown>
                            {comment.content as string}
                          </ReactMarkdown>
                        </Box>
                      </Flex>
                    )
                  )}
                </Stack>
              )}

              {postsCommentsStore.isCommentsLoaded &&
                postsCommentsStore.comments.length === 0 && (
                  <Text>No comments yet</Text>
                )}
            </Flex>
          </>
        )
      )}
    </Stack>
  )
}
