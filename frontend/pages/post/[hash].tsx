import { Text, Box, Heading, Link, Spinner, Stack } from "@chakra-ui/react"
import Image from "next/image"
import { default as NextLink } from "next/link"
import { useRouter } from "next/router"
import { useEffect, useLayoutEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import { useDispatch, useSelector } from "react-redux"
import { useAccount } from "wagmi"
import type {
  Community,
  PostStructOutput,
  CommentStructOutput,
} from "../../../typechain-types/contracts/Community"
import useLoadContracts from "../../hooks/useLoadContract"
import {
  setComments,
  setIsCommentsLoaded,
  setIsCommentsLoading,
  setIsPostLoading,
  setPost,
} from "../../state/postComment"
import { RootState } from "../../state/store"
import getFileContent from "../../utils/getFileContent"
import getWeb3StorageClient from "../../utils/web3Storage"

const web3StorageClient = getWeb3StorageClient()

export default function Post() {
  useLoadContracts()

  const { address } = useAccount()

  const router = useRouter()
  const { hash } = router.query

  const contractStore = useSelector((state: RootState) => state.contract)
  const postsCommentsStore = useSelector(
    (state: RootState) => state.postsComments
  )
  const dispatch = useDispatch()

  const [isContentLoading, setIsContentLoading] = useState(false)
  const [coverImage, setCoverImage] = useState(null)
  const [content, setContent] = useState("")

  const [writeComment, setWriteComment] = useState(false)

  useEffect(() => {
    async function fetchPost(hash) {
      const communityContract = contractStore?.community as Community
      if (!communityContract || postsCommentsStore.isPostLoaded) {
        return
      }

      try {
        dispatch(setIsPostLoading(true))
        const post: PostStructOutput = await communityContract?.fetchPostByHash(
          hash
        )
        if (post) {
          dispatch(setPost(post))
        }
      } catch (error) {
        console.error(error)
      } finally {
        dispatch(setIsPostLoading(false))
      }
    }

    fetchPost(hash)
  }, [
    contractStore?.community,
    hash,
    postsCommentsStore.isPostLoaded,
    dispatch,
  ])

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

  useEffect(() => {
    async function fetchComments() {
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
          postsCommentsStore.post.id
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
    }

    fetchComments()
  }, [
    contractStore?.community,
    postsCommentsStore.isPostLoaded,
    postsCommentsStore.post,
    postsCommentsStore.isCommentsLoaded,
    dispatch,
  ])

  useLayoutEffect(
    () => () => {
      dispatch(setPost(null))
      dispatch(setComments([]))
      dispatch(setIsCommentsLoaded(false))
    },
    [dispatch]
  )

  const EditLink = address &&
    postsCommentsStore.post &&
    address === postsCommentsStore.post.author && (
      <Box alignSelf="flex-end" mr={5}>
        <Link>
          <NextLink href={`/edit-post/${hash}`}>Edit post</NextLink>
        </Link>
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
              <Heading textAlign="center" as="h1">
                {postsCommentsStore.post.title}
              </Heading>

              {isContentLoading ? (
                <Spinner />
              ) : (
                <Box alignSelf="flex-start" mb={50}>
                  <ReactMarkdown>{content}</ReactMarkdown>
                </Box>
              )}

              {postsCommentsStore.isCommentsLoading ? (
                <Spinner />
              ) : (
                <Stack pb={5} spacing={3}>
                  <Heading as="h2" mb={5}>
                    Comments
                  </Heading>

                  {postsCommentsStore.comments.map(
                    (comment: CommentStructOutput, index) => (
                      <Box
                        key={`${comment.id}_${index}`}
                        w="100%"
                        p={5}
                        shadow="md"
                        borderWidth="1px"
                      >
                        <Text noOfLines={1}>{comment.author}</Text>

                        <ReactMarkdown>{comment.content}</ReactMarkdown>
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
