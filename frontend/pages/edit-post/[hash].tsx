import { Box, Heading, Text } from "@chakra-ui/react"
import "easymde/dist/easymde.min.css"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useAccount, useSigner } from "wagmi"
import type { Community } from "../../typechain-types/contracts/Community"
import WritePost from "../../components/WritePost"
import useFetchPostByHash from "../../hooks/useFetchPostByHash"
import useLoadContracts from "../../hooks/useLoadContract"
import { setIsPostsLoaded, setPosts } from "../../state/postComment"
import { RootState } from "../../state/store"
import getFileContent from "../../utils/getFileContent"
import savePostToIpfs from "../../utils/saveToIpfs"
import getWeb3StorageClient from "../../utils/web3Storage"

const web3StorageClient = getWeb3StorageClient()

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
})

function EditPost() {
  useLoadContracts()

  const contractStore = useSelector((state: RootState) => state.contract)
  const postsCommentsStore = useSelector(
    (state: RootState) => state.postsComments
  )

  const dispatch = useDispatch()

  const { isConnected } = useAccount()
  const { data: signer } = useSigner()

  const [post, setPostLocally] = useState({
    id: "",
    author: "",
    published: false,

    title: "",
    content: "",
    coverImage: "",
    coverImageHash: "",
    categoryIndex: null,
  })
  const [postError, _setPostError] = useState({ title: false, content: false })
  const [image, setImage] = useState(null)

  function onPostInputChange(e: any) {
    setPostLocally(() => ({ ...post, [e.target.name]: e.target.value }))
  }

  const fileRef = useRef(null)
  const [selectedCategory, setSelectedCategory] = useState<number>(-1)

  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const { hash } = router.query

  useFetchPostByHash(hash as string)

  useEffect(() => {
    async function setPostDataLocally() {
      if (
        postsCommentsStore.isPostLoaded &&
        postsCommentsStore.post &&
        !post.id
      ) {
        // const { id, author, published } = postsCommentsStore.post

        // @ts-ignore
        let res = await web3StorageClient.get(postsCommentsStore.post.hash)

        if (res?.ok) {
          let files = await res.files()

          const file = files[0]
          const fileContent = JSON.parse(await getFileContent(file))

          const { title, content, coverImage, categoryIndex } = fileContent

          // setPostLocally({
          //   ...post,
          //   id,
          //   author,
          //   published,
          //   title,
          //   content,
          //   categoryIndex,
          //   coverImageHash: coverImage,
          // })

          // if (fileContent.coverImage) {
          //   res = await web3StorageClient.get(fileContent.coverImage)
          //   if (res?.ok) {
          //     files = await res.files()
          //     const fileCoverImage = files[0]

          //     const coverImage = await getFileContent(
          //       fileCoverImage,
          //       "readAsDataURL"
          //     )

          //     setPostLocally({
          //       ...post,
          //       coverImage,
          //     })
          //   }
          // }
        }
      }
    }

    setPostDataLocally()
  }, [
    postsCommentsStore.isPostLoaded,
    postsCommentsStore.post,
    post,
    setPostLocally,
  ])

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
      const categoryIndex = selectedCategory !== -1 ? selectedCategory : 0
      const data = {
        content: post.hash,
        coverImage: post.coverImage,
        title: post.title,
        author: await signer.getAddress(),
        categoryIndex,
      }

      setIsLoading(true)

      const cid = (await savePostToIpfs(
        data,
        `${new Date()
          .toLocaleString()
          .replaceAll(/(\W)/g, "_")}_${selectedCategory}_${
          post.title
        }_edited.json`
      )) as string
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
    // @ts-ignore
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

      setPostLocally((state) => ({ ...state, coverImage: uploadedCID }))
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
          mode="edit"
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
            setPostLocally({ ...post, content: value })
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
