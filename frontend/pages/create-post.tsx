import { Box, Heading, Text } from "@chakra-ui/react"
import "easymde/dist/easymde.min.css"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react" // new
import { useDispatch, useSelector } from "react-redux"
import { useAccount, useSigner } from "wagmi"
import { Community } from "../../typechain-types/contracts/Community"
import WritePost from "../components/WritePost"
import useLoadContracts from "../hooks/useLoadContract"
import { setCategories, setIsPostsLoaded } from "../state/postComment"
import { RootState } from "../state/store"
import savePostToIpfs from "../utils/saveToIpfs"
import getWeb3StorageClient from "../utils/web3Storage"

const web3StorageClient = getWeb3StorageClient()

const initialState = {
  title: "",
  content: "",
  coverImage: "",
}

function CreatePost() {
  useLoadContracts()

  const { isConnected } = useAccount()
  const { data: signer } = useSigner()

  const contractStore = useSelector((state: RootState) => state.contract)
  const postsCommentsStore = useSelector(
    (state: RootState) => state.postsComments
  )

  const dispatch = useDispatch()

  /* configure initial state to be used in the component */
  const [post, setPost] = useState(initialState)
  const [postError, setPostError] = useState({ title: false, content: false })
  const [image, setImage] = useState(null)

  const [selectedCategory, setSelectedCategory] = useState<number>(-1)

  const [isLoading, setIsLoading] = useState(false)

  const fileRef = useRef(null)
  const { title, content } = post
  const router = useRouter()

  useEffect(() => {
    async function fetchCategories() {
      const communityContract = contractStore?.community
      if (!communityContract || postsCommentsStore.isCategoriesLoaded) {
        return
      }

      const categories = await communityContract?.fetchCategories()
      if (categories) {
        dispatch(setCategories(categories))
      }
    }

    fetchCategories()
  }, [contractStore, postsCommentsStore.isCategoriesLoaded, dispatch])

  function onPostInputChange(e: any) {
    setPost(() => ({ ...post, [e.target.name]: e.target.value }))
  }

  async function createNewPost() {
    /* saves post to ipfs then anchors to smart contract */
    if (!title || !content) {
      setPostError({
        ...postError,
        title: !title,
        content: !content,
      })
      return
    }

    setPostError({ title: false, content: false })

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

      const categoryIndex = selectedCategory != -1 ? selectedCategory : 0
      const data = {
        ...post,
        author: await signer.getAddress(),
        categoryIndex,
      }

      // IPFS
      const cid = (await savePostToIpfs(
        data,
        `${new Date()
          .toLocaleString()
          .replaceAll(/(\W)/g, "_")}_${selectedCategory}_${post.title}.json`
      )) as string
      if (!cid) throw Error("Failed to save post to IPFS")

      // Smart Contract
      const tx = await communityContract
        ?.connect(signer)
        ?.createPost(post.title, cid, categoryIndex)
      await tx.wait()

      dispatch(setIsPostsLoaded(false))

      router.push(`/`)
    } finally {
      setIsLoading(false)
    }
  }

  function triggerOnChange() {
    /* trigger handleFileChange handler of hidden file input */
    // @ts-ignore
    fileRef?.current?.click()
  }

  async function handleFileChange(e: any) {
    /* upload cover image to ipfs and save content to state */
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
        Create Post
      </Heading>

      {isConnected ? (
        <WritePost
          mode="create"
          isLoading={isLoading}
          post={post}
          postError={postError}
          image={image}
          categories={postsCommentsStore.categories}
          selectedCategory={selectedCategory}
          onChangeSelectedCategory={(e: any) =>
            setSelectedCategory(e.target.value)
          }
          onTitleInputChange={onPostInputChange}
          onMDEditorChange={(value: string) =>
            setPost({ ...post, content: value })
          }
          handleFileChange={handleFileChange}
          fileRef={fileRef}
          triggerOnChange={triggerOnChange}
          submitPost={createNewPost}
        />
      ) : (
        <Text>Please make sure to be connected with Metamask.</Text>
      )}
    </Box>
  )
}

export default CreatePost
