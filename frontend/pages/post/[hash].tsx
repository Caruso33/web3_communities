import { Box, Button, Heading, Spinner, Stack } from "@chakra-ui/react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useLayoutEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import { useDispatch, useSelector } from "react-redux"
import { useAccount } from "wagmi"
import type {
  Community,
  PostStructOutput,
} from "../../../typechain-types/contracts/Community"
import useLoadContracts from "../../hooks/useLoadContract"
import { setPost } from "../../state/postComment"
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

  const [isLoading, setIsLoading] = useState(false)
  const [coverImage, setCoverImage] = useState(null)

  useEffect(() => {
    async function fetchPost(hash) {
      const communityContract = contractStore?.community as Community
      if (!communityContract || postsCommentsStore.isPostLoaded) {
        return
      }

      try {
        setIsLoading(true)
        const post: PostStructOutput = await communityContract?.fetchPostByHash(
          hash
        )
        if (post) {
          dispatch(setPost(post))
        }

        let res = await web3StorageClient.get(post.content)
        if (res?.ok) {
          let files = await res.files()

          const file = files[0]
          const fileContent = JSON.parse(await getFileContent(file))

          console.dir(fileContent)

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
        setIsLoading(false)
      }
    }

    fetchPost(hash)
  }, [
    contractStore?.community,
    hash,
    postsCommentsStore.isPostLoaded,
    dispatch,
  ])

  useLayoutEffect(
    () => () => {
      dispatch(setPost(null))
    },
    [dispatch]
  )

  const editLink =
    address &&
    postsCommentsStore.post &&
    address === postsCommentsStore.post.author ? (
      <Box>
        <Button>
          <Link href={`/edit-post/${hash}`}>
            <a>Edit post</a>
          </Link>
        </Button>
      </Box>
    ) : (
      <div />
    )

  console.dir(postsCommentsStore.post)

  return (
    <Stack mt={5} pb={5} spacing={8} direction="column" alignItems="center">
      {isLoading ? (
        <Spinner />
      ) : (
        postsCommentsStore.post && (
          <>
            <CoverImage coverImage={coverImage} />

            <Heading textAlign="center" as="h1">
              {postsCommentsStore.post.title}
            </Heading>

            <Box>
              <ReactMarkdown>{postsCommentsStore.post.content}</ReactMarkdown>
            </Box>
          </>
        )
      )}
    </Stack>
  )
}

const CoverImage = ({ coverImage }) => {
  return (
    coverImage && (
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
  )
}
