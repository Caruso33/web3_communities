import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { ChangeEvent, useEffect, useRef, useState } from "react" // new
// import deployment from "../utils/deployment.json"
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Select,
  Spinner,
} from "@chakra-ui/react"
import "easymde/dist/easymde.min.css"
import Image from "next/image"
import { useDispatch, useSelector } from "react-redux"
import { useAccount, useSigner } from "wagmi"
import { Community } from "../../typechain-types/contracts/Community"
import useLoadContracts from "../hooks/useLoadContract"
import { setCategories, setIsPostsLoaded } from "../state/postComment"
import { RootState } from "../state/store"
import getWeb3StorageClient from "../utils/web3Storage"

const web3StorageClient = getWeb3StorageClient()

/* configure the markdown editor to be client-side import */
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
})

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

  const [selectedCategory, setSelectedCategory] = useState<number>("")

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

  function onChange(e) {
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

    try {
      setIsLoading(true)
      const cid = await savePostToIpfs()
      if (!cid) return

      await savePost(cid)
      router.push(`/`)
    } finally {
      setIsLoading(false)
    }
  }

  async function savePostToIpfs() {
    /* save post metadata to ipfs */
    try {
      const postBlob = new Blob([JSON.stringify(post)], {
        type: "application/json",
      })
      const postFile = new File(
        [postBlob],
        `${new Date().toLocaleString()}_${selectedCategory}_${post.title}.json`
      )

      const uploadedCID = await web3StorageClient.put([postFile])

      console.log("Uploading post to ipfs...")
      console.log("Data: ", JSON.stringify(post, null, 4))
      console.log("Post content CID: ", uploadedCID)

      return uploadedCID
    } catch (err) {
      console.log("error: ", err)
    }
  }

  function savePost(contentCID: string) {
    // const communityContract = contractStore?.communitySigner
    const communityContract = contractStore?.community as Community
    if (!communityContract || !signer) {
      throw new Error(
        "No community contract found. Please make sure to be connected with Metamask."
      )
    }

    return new Promise(async (resolve, reject) => {
      try {
        const categoryIndex = selectedCategory || 0

        const tx = await communityContract
          ?.connect(signer)
          ?.createPost(post.title, contentCID, categoryIndex)
        await tx.wait()

        dispatch(setIsPostsLoaded(false))
        resolve(tx)
      } catch (err) {
        console.log("Error: ", err)
        reject(err)
      }
    })
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
        Create Post
      </Heading>

      {isConnected && (
        <>
          <FormControl
            variant="floating"
            id="title"
            isRequired
            isInvalid={postError.title}
            my={5}
          >
            <FormLabel>Title</FormLabel>
            <Input
              onChange={onChange}
              name="title"
              placeholder="Give it a title ..."
              value={post.title}
              _placeholder={{ color: "inherit" }}
            />
            <FormHelperText>Keep it short and sweet!</FormHelperText>
            <FormErrorMessage>Please enter a title</FormErrorMessage>
          </FormControl>

          <FormControl
            variant="floating"
            id="content"
            isRequired
            isInvalid={postError.content}
            my={5}
          >
            <FormLabel>Content</FormLabel>
            <SimpleMDE
              placeholder="What's on your mind?"
              value={post.content}
              onChange={(value) => setPost({ ...post, content: value })}
            />
            <FormErrorMessage>Please fill content</FormErrorMessage>
          </FormControl>

          <FormControl
            variant="floating"
            id="categoryIndex"
            isInvalid={postError.categoryIndex}
            my={5}
          >
            <FormLabel>Category</FormLabel>
            <Select
              placeholder="Select Category"
              value={selectedCategory}
              onChange={(e: ChangeEvent) => setSelectedCategory(e.target.value)}
            >
              {postsCommentsStore.categories.map((category: string, index) => (
                <option key={index} value={index}>
                  {category}
                </option>
              ))}
            </Select>
            <FormErrorMessage>Please select a category</FormErrorMessage>
          </FormControl>

          {image && (
            <Image
              src={URL.createObjectURL(image)}
              alt="Cover image"
              width="100%"
              height="100%"
              objectFit="contain"
              crossOrigin="anonymous"
              unoptimized={true}
            />
          )}

          <Box my={5}>
            <Input
              id="selectImage"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileRef}
              style={{ display: "none" }}
            />
            <Button minW={150} onClick={triggerOnChange} isDisabled={isLoading}>
              {isLoading ? <Spinner /> : "Add cover image"}
            </Button>

            <Button
              minW={150}
              ml={5}
              onClick={createNewPost}
              isDisabled={isLoading}
            >
              {isLoading ? <Spinner /> : "Publish"}
            </Button>
          </Box>
        </>
      )}
    </Box>
  )
}

export default CreatePost
