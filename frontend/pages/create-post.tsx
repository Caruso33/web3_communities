// import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react" // new
// import deployment from "../utils/deployment.json"
import { Button, Input, Select, Spinner } from "@chakra-ui/react"
import { useDispatch, useSelector } from "react-redux"
import useLoadContracts from "../hooks/useLoadContract"
import { setCategories } from "../state/postComment"
import { RootState } from "../state/store"
import getWeb3StorageClient from "../utils/web3Storage"

const web3StorageClient = getWeb3StorageClient()

/* configure the markdown editor to be client-side import */
// const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
//   ssr: false,
// })

const initialState = {
  title: "",
  content: "",
  categoryIndex: "",
  coverImage: "",
}

function CreatePost() {
  useLoadContracts()

  const contractStore = useSelector((state: RootState) => state.contract)
  const postsCommentsStore = useSelector(
    (state: RootState) => state.postsComments
  )

  const dispatch = useDispatch()

  /* configure initial state to be used in the component */
  const [post, setPost] = useState(initialState)
  const [image, setImage] = useState(null)

  const [selectedCategory, setSelectedCategory] = useState(null)

  const [initLoaded, setInitLoaded] = useState(false)
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

  // useEffect(() => {
  //   setTimeout(() => {
  //     /* delay rendering buttons until dynamic import is complete */
  //     setInitLoaded(true)
  //   }, 500)
  // }, [])

  function onChange(e) {
    setPost(() => ({ ...post, [e.target.name]: e.target.value }))
  }

  async function createNewPost() {
    /* saves post to ipfs then anchors to smart contract */
    if (!title || !content) return

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
        `${new Date().toString()}_${selectedCategory}_${post.title}.json`
      )

      const uploadedCID = await web3StorageClient.put([postFile])

      console.log("Uploaded post to ipfs, CID: ", uploadedCID)

      return uploadedCID
    } catch (err) {
      console.log("error: ", err)
    }
  }

  async function savePost(cid: string) {
    const communityContract = contractStore?.community
    if (!communityContract) {
      throw new Error(
        "No community contract found. Please make sure to be connected with Metamask."
      )
    }

    try {
      const tx = communityContract.createPost(post.title, cid)
      await tx.wait()
    } catch (err) {
      console.log("Error: ", err)
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

    const uploadedCID = await web3StorageClient.put([uploadedFile])
    console.log("Uploaded image to ipfs, CID: ", uploadedCID)

    setPost((state) => ({ ...state, coverImage: uploadedCID }))
    setImage(uploadedFile)
  }

  return (
    <div>
      {image && <img src={URL.createObjectURL(image)} />}

      <Input
        onChange={onChange}
        name="title"
        placeholder="Give it a title ..."
        value={post.title}
      />

      {/* <SimpleMDE
        placeholder="What's on your mind?"
        value={post.content}
        onChange={(value) => setPost({ ...post, content: value })}
      /> */}

      <Select placeholder="Select Category">
        {postsCommentsStore.categories.map((category: string, index) => (
          <option key={index} value={index}>
            {category}
          </option>
        ))}
      </Select>

      {initLoaded && (
        <>
          <Button onClick={createNewPost}>
            {isLoading ? <Spinner /> : "Publish"}
          </Button>
          <Button onClick={triggerOnChange}>
            {isLoading ? <Spinner /> : "Add cover image"}
          </Button>
        </>
      )}
      <Input
        id="selectImage"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileRef}
      />
    </div>
  )
}

export default CreatePost
