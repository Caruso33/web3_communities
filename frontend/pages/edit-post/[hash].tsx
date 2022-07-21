import { Box, Button, Heading, Text } from "@chakra-ui/react"
import "easymde/dist/easymde.min.css"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useAccount, useSigner } from "wagmi"
import { Community } from "../../../typechain-types/contracts/Community"
import WritePost from "../../components/WritePost"
import useFetchPostByHash from "../../hooks/useFetchPostByHash"
import { setIsPostsLoaded, setPosts } from "../../state/postComment"
import { RootState } from "../../state/store"
import savePostToIpfs from "../../utils/saveToIpfs"

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
})

function EditPost() {
  const contractStore = useSelector((state: RootState) => state.contract)
  const postsCommentsStore = useSelector(
    (state: RootState) => state.postsComments
  )

  const dispatch = useDispatch()

  const { isConnected } = useAccount()
  const { data: signer } = useSigner()

  const [post, setPost] = useState({
    title: "",
    content: "",
    coverImage: "",
  })
  const [postError, setPostError] = useState({ title: false, content: false })
  const [image, setImage] = useState(null)

  function onPostInputChange(e) {
    setPost(() => ({ ...post, [e.target.name]: e.target.value }))
  }

  const fileRef = useRef(null)
  const [selectedCategory, setSelectedCategory] = useState<number>("")

  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const { hash } = router.query

  useFetchPostByHash(hash as string)

  useEffect(() => {
    if (postsCommentsStore.isPostLoaded && postsCommentsStore.post && !post) {
      setPost(postsCommentsStore.post)
    }
  }, [postsCommentsStore.isPostLoaded, postsCommentsStore.post, post, setPost])

  async function updatePost() {
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
      const categoryIndex = selectedCategory || 0
      const data = {
        content: post.content,
        coverImage: post.coverImage,
        title: post.title,
        author: await signer.getAddress(),
        categoryIndex,
      }

      setIsLoading(true)

      const cid = await savePostToIpfs(
        data,
        `${new Date().toLocaleString()}_${selectedCategory}_${
          post.title
        }_edited.json`
      )
      if (!cid) throw Error("Failed to save post to IPFS")

      // Smart Contract
      const tx = await communityContract
        ?.connect(signer)
        ?.updatePost(post.id, post.title, cid, categoryIndex, true)
      await tx.wait()

      dispatch(setIsPostsLoaded(false))
      dispatch(setPosts([]))

      router.push(`/`)
    } catch (err) {
      console.log("error: ", err)
    } finally {
      setIsLoading(false)
    }
  }

  function triggerOnChange() {
    /* trigger handleFileChange handler of hidden file input */
    fileRef?.current?.click()
  }

  async function handleFileChange(e: any) {
    /* upload cover image to ipfs and save hash to state */
    const uploadedFile = e.target.files[0]
    if (!uploadedFile) return

    try {
      setIsLoading(true)

      const uploadedCID = await web3StorageClient.put([uploadedFile], {
        wrapWithDirectory: false,
      })
      console.log("Uploaded image to ipfs, CID: ", uploadedCID)

      setPost((state) => ({ ...state, coverImage: uploadedCID }))
      setImage(uploadedFile)
    } catch (err) {
      console.log("Error: ", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box m="5">
      <Heading mt={5} as="h1" noOfLines={1}>
        Edit Post
      </Heading>

      {!isConnected && (
        <Box>
          <Text>Please connect wallet first</Text>
        </Box>
      )}

      {isConnected && (
        <WritePost
          isLoading={isLoading}
          post={post}
          postError={postError}
          image={image}
          categories={postsCommentsStore.categories}
          selectedCategory={selectedCategory}
          onChangeSelectedCategory={(e: ChangeEvent) =>
            setSelectedCategory(e.target.value)
          }
          onTitleInputChange={onPostInputChange}
          onMDEditorChange={(value: string) =>
            setPost({ ...post, content: value })
          }
          handleFileChange={handleFileChange}
          fileRef={fileRef}
          triggerOnChange={triggerOnChange}
          createNewPost={updatePost}
        />
      )}
    </Box>
  )
}

export default EditPost
