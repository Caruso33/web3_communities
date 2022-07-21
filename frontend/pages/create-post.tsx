import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { ChangeEvent, useEffect, useRef, useState } from "react" // new
import { Box, Heading } from "@chakra-ui/react"
import "easymde/dist/easymde.min.css"
import { useDispatch, useSelector } from "react-redux"
import { useAccount, useSigner } from "wagmi"
import { Community } from "../../typechain-types/contracts/Community"
import useLoadContracts from "../hooks/useLoadContract"
import { setCategories, setIsPostsLoaded } from "../state/postComment"
import { RootState } from "../state/store"
import getWeb3StorageClient from "../utils/web3Storage"
import savePostToIpfs from "../utils/saveToIpfs"
import WritePost from "../components/WritePost"

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

  function onPostInputChange(e) {
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

      const categoryIndex = selectedCategory || 0
      const data = {
        ...post,
        author: await signer.getAddress(),
        categoryIndex,
      }

      // IPFS
      const cid = (await savePostToIpfs(
        data,
        `${new Date().toLocaleString()}_${selectedCategory}_${post.title}.json`
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
          submitPost={createNewPost}
        />
        // <>
        //   <FormControl
        //     variant="floating"
        //     id="title"
        //     isRequired
        //     isInvalid={postError.title}
        //     my={5}
        //   >
        //     <FormLabel>Title</FormLabel>
        //     <Input
        //       onChange={onPostInputChange}
        //       name="title"
        //       placeholder="Give it a title ..."
        //       value={post.title}
        //       _placeholder={{ color: "inherit" }}
        //     />
        //     <FormHelperText>Keep it short and sweet!</FormHelperText>
        //     <FormErrorMessage>Please enter a title</FormErrorMessage>
        //   </FormControl>

        //   <FormControl
        //     variant="floating"
        //     id="content"
        //     isRequired
        //     isInvalid={postError.content}
        //     my={5}
        //   >
        //     <FormLabel>Content</FormLabel>
        //     <SimpleMDE
        //       placeholder="What's on your mind?"
        //       value={post.content}
        //       onChange={(value) => setPost({ ...post, content: value })}
        //     />
        //     <FormErrorMessage>Please fill content</FormErrorMessage>
        //   </FormControl>

        //   <FormControl
        //     variant="floating"
        //     id="categoryIndex"
        //     isInvalid={postError.categoryIndex}
        //     my={5}
        //   >
        //     <FormLabel>Category</FormLabel>
        //     <Select
        //       placeholder="Select Category"
        //       value={selectedCategory}
        //       onChange={(e: ChangeEvent) => setSelectedCategory(e.target.value)}
        //     >
        //       {postsCommentsStore.categories.map((category: string, index) => (
        //         <option key={index} value={index}>
        //           {category}
        //         </option>
        //       ))}
        //     </Select>
        //     <FormErrorMessage>Please select a category</FormErrorMessage>
        //   </FormControl>

        //   {image && (
        //     <Image
        //       src={URL.createObjectURL(image)}
        //       alt="Cover image"
        //       width="100%"
        //       height="100%"
        //       objectFit="contain"
        //       crossOrigin="anonymous"
        //       unoptimized={true}
        //     />
        //   )}

        //   <Box my={5}>
        //     <Input
        //       id="selectImage"
        //       type="file"
        //       accept="image/*"
        //       onChange={handleFileChange}
        //       ref={fileRef}
        //       style={{ display: "none" }}
        //     />
        //     <Button minW={150} onClick={triggerOnChange} isDisabled={isLoading}>
        //       {isLoading ? <Spinner /> : "Add cover image"}
        //     </Button>

        //     <Button
        //       minW={150}
        //       ml={5}
        //       onClick={submitPost}
        //       isDisabled={isLoading}
        //     >
        //       {isLoading ? <Spinner /> : "Publish"}
        //     </Button>
        //   </Box>
        // </>
      )}
    </Box>
  )
}

export default CreatePost
