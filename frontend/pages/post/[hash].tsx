import {
  Box,
  Button,
  Heading,
  Link,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react"
import "easymde/dist/easymde.min.css"
import dynamic from "next/dynamic"
import Image from "next/image"
import { default as NextLink } from "next/link"
import { useRouter } from "next/router"
import { useCallback, useEffect, useLayoutEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import { useDispatch, useSelector } from "react-redux"
import { useAccount, useSigner } from "wagmi"
import type { Community } from "../../../typechain-types/contracts/Community"
import useFetchPostByHash from "../../hooks/useFetchPostByHash"
import useLoadContracts from "../../hooks/useLoadContract"
import {
  setComments,
  setIsCommentsLoaded,
  setIsCommentsLoading,
  setPost,
} from "../../state/postComment"
import { RootState } from "../../state/store"
import getFileContent from "../../utils/getFileContent"
import savePostToIpfs from "../../utils/saveToIpfs"
import getWeb3StorageClient from "../../utils/web3Storage"

const web3StorageClient = getWeb3StorageClient()

/* configure the markdown editor to be client-side import */
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
})

export default function Post() {
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
  const [isContentLoading, setIsContentLoading] = useState(false)
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [content, setContent] = useState("")

  const [writeComment, setWriteComment] = useState(false)
  const [comment, setComment] = useState("")

  useFetchPostByHash(hash as string)

  useEffect(() => {
    async function fetchContent() {
      if (coverImage || !postsCommentsStore.isPostLoaded) {
        return
      }

      try {
        setIsContentLoading(true)

        let res = await web3StorageClient.get(postsCommentsStore.post.content)
        if (res?.ok) {
          let files = await res.files()

          const file = files[0]
          const fileContent = JSON.parse(await getFileContent(file))

          setContent(fileContent.content)

          if (fileContent.coverImage) {
            // setCoverImage(`${IPFS_GATEWAY}${fileContent.coverImage}`)

            res = await web3StorageClient.get(fileContent.coverImage)
            if (res?.ok) {
              files = await res.files()
              const fileCoverImage = files[0]

              const coverImage = await getFileContent(
                fileCoverImage,
                "readAsDataURL"
              )

              setCoverImage(coverImage)
            }
          }
        }
      } catch (error) {
        console.error(error)
      } finally {
        setIsContentLoading(false)
      }
    }

    fetchContent()
  }, [
    postsCommentsStore.post,
    postsCommentsStore.isPostLoaded,
    coverImage,
    setCoverImage,
  ])

  const fetchComments = useCallback(async () => {
    const communityContract = contractStore?.community as Community
    if (
      !communityContract ||
      !postsCommentsStore.isPostLoaded ||
      postsCommentsStore.isCommentsLoaded
    ) {
      return
    }

    try {
      dispatch(setIsCommentsLoading(true))
      const comments = await communityContract?.fetchCommentsOfPost(
        (postsCommentsStore.post as Community.PostStruct).id
      )
      if (comments) {
        dispatch(setComments(comments))
        dispatch(setIsCommentsLoaded(true))
      }
    } catch (error) {
      console.error(error)
    } finally {
      dispatch(setIsCommentsLoading(false))
    }
  }, [
    contractStore?.community,
    postsCommentsStore.isPostLoaded,
    postsCommentsStore.post,
    postsCommentsStore.isCommentsLoaded,
    dispatch,
  ])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  useLayoutEffect(
    () => () => {
      dispatch(setPost({}))
      dispatch(setComments([]))
      dispatch(setIsCommentsLoaded(false))
    },
    [dispatch]
  )

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

    try {
      setIsLoading(true)

      const data = {
        author: await signer.getAddress(),
        postId: (postsCommentsStore.post as Community.PostStruct).id,
        content: comment,
      }

      // IPFS
      const cid = await savePostToIpfs(
        data,
        `${new Date().toLocaleString()}_${
          (postsCommentsStore.post as Community.PostStruct).id
        }_comment.json`
      )
      if (!cid) if (!cid) throw Error("Failed to save comment to IPFS")

      // Smart Contract
      const tx = await communityContract
        .connect(signer)
        .createComment(postsCommentsStore.post.id, comment)
      await tx.wait()

      // local state
      setComment("")
      setWriteComment(!writeComment)

      // global state
      dispatch(setIsCommentsLoaded(false))
      dispatch(setComments([]))

      fetchComments()
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const EditLink = address &&
    postsCommentsStore.post &&
    address === postsCommentsStore.post.author &&
    null && (
      <Box alignSelf="flex-end" mr={5}>
        <NextLink href={`/edit-post/${hash}`} passHref>
          <Link>Edit post</Link>
        </NextLink>
      </Box>
    )

  const CoverImage = coverImage && (
    <Box mb={5} h={300} w={300}>
      <Image
        src={coverImage}
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

            <Box w="60vw">
              <Heading textAlign="center" as="h1" mb={5}>
                {postsCommentsStore.post.title as string}
              </Heading>

              {isContentLoading ? (
                <Box textAlign="center">
                  <Spinner />
                </Box>
              ) : (
                <Box alignSelf="flex-start" mb={50}>
                  <ReactMarkdown>{content}</ReactMarkdown>
                </Box>
              )}

              {!isContentLoading && postsCommentsStore.isCommentsLoading ? (
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
                    (comment: Community.CommentStructOutput, index) => (
                      <Box
                        key={`${comment.id}_${index}`}
                        w="100%"
                        p={5}
                        shadow="md"
                        borderWidth="1px"
                      >
                        <Text noOfLines={1}>{comment.author as string}</Text>

                        <ReactMarkdown>
                          {comment.content as string}
                        </ReactMarkdown>
                      </Box>
                    )
                  )}
                </Stack>
              )}

              {postsCommentsStore.isCommentsLoaded &&
                postsCommentsStore.comments.length === 0 && (
                  <Text>No comments yet</Text>
                )}
            </Box>
          </>
        )
      )}
    </Stack>
  )
}
