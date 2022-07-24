import deployment from "../utils/deployment.json"
import { Box, Heading, Link, Text } from "@chakra-ui/react"
import "easymde/dist/easymde.min.css"
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react" // new
import { useDispatch, useSelector } from "react-redux"
import { useAccount, useNetwork, useSigner, useSwitchNetwork } from "wagmi"
import { Community } from "../../typechain-types/contracts/Community"
import WritePost from "../components/WritePost"
import { useIsMounted } from "../hooks"
import useLoadContracts from "../hooks/useLoadContract"
import { setCategories, setIsPostsLoaded } from "../state/postComment"
import { RootState } from "../state/store"
import Lit, { erc20Chains } from "../utils/Lit"
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

  const mounted = useIsMounted()

  const { isConnected } = useAccount()
  const { data: signer } = useSigner()
  const { chain } = useNetwork()
  const { switchNetworkAsync } = useSwitchNetwork()

  const contractStore = useSelector((state: RootState) => state.contract)
  const postsCommentsStore = useSelector(
    (state: RootState) => state.postsComments
  )

  const dispatch = useDispatch()

  const deploymentChainData =
    deployment[process.env.NEXT_PUBLIC_DEPLOYED_CHAIN_ID]

  /* configure initial state to be used in the component */
  const [post, setPost] = useState(initialState)
  const [postError, setPostError] = useState({
    title: false,
    content: false,
    erc20EncryptToken: false,
  })
  const [image, setImage] = useState(null)

  const [isUseEncryption, setIsUseEncryption] = useState(false)
  const [erc20EncryptToken, setErc20EncryptToken] = useState({
    address: deploymentChainData?.address,
    minBalance: "0",
    chain: -1,
  })

  const [cid, setCid] = useState("")
  const [tx, setTx] = useState("")

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
    if (
      isUseEncryption &&
      (!erc20EncryptToken.address ||
        !erc20EncryptToken.minBalance ||
        erc20EncryptToken.chain == -1)
    ) {
      setPostError({
        ...postError,
        erc20EncryptToken: true,
      })
      return
    }

    setPostError({ title: false, content: false, erc20EncryptToken: false })

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
        accessControlConditions: "",
        encryptedString: "",
        encryptedSymmetricKey: "",
      }

      const fileBaseName = `${new Date()
        .toLocaleString()
        .replaceAll(/(\W)/g, "_")}_${selectedCategory}_${post.title}`

      if (isUseEncryption) {
        const lit = new Lit()
        const accessControlChain = erc20Chains[erc20EncryptToken.chain]

        const accessControl = lit.getAccessControlConditions(
          erc20EncryptToken?.address,
          accessControlChain,
          erc20EncryptToken.minBalance
        )
        // <Blob> encryptedString
        // <Uint8Array(32)> symmetricKey
        // @ts-ignore
        let { encryptedString, encryptedSymmetricKey } = await lit.encrypt(
          content,
          accessControl,
          accessControlChain
        )

        const encryptedStringFile = new File(
          [encryptedString],
          `${fileBaseName}_encryptedString.file`
        )

        const cidString = await web3StorageClient.put([encryptedStringFile], {
          wrapWithDirectory: false,
        })
        if (!cidString) throw Error("Failed to save encrypted string to IPFS")
        console.log("Uploaded encrypted string to ipfs, CID: ", cidString)

        data.accessControlConditions = JSON.stringify(accessControl)
        data.encryptedString = cidString
        data.encryptedSymmetricKey = encryptedSymmetricKey
        data.accessControlChain = accessControlChain
        data.content = ""
      }

      if (+process.env.NEXT_PUBLIC_DEPLOYED_CHAIN_ID! !== chain?.id) {
        console.log(
          "Switching back to chain: " +
            process.env.NEXT_PUBLIC_DEPLOYED_CHAIN_ID
        )
        await switchNetworkAsync(+process.env.NEXT_PUBLIC_DEPLOYED_CHAIN_ID!)
      }

      // IPFS
      const cid = (await savePostToIpfs(data, `${fileBaseName}.json`)) as string
      if (!cid) throw Error("Failed to save post to IPFS")
      setCid(cid)

      // Smart Contract
      const tx = await communityContract
        ?.connect(signer)
        ?.createPost(data.title, cid, data.categoryIndex)
      setTx(tx.hash)
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

      {mounted && isConnected ? (
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
          isUseEncryption={isUseEncryption}
          setIsUseEncryption={setIsUseEncryption}
          erc20EncryptToken={erc20EncryptToken}
          setErc20EncryptToken={setErc20EncryptToken}
          triggerOnChange={triggerOnChange}
          submitPost={createNewPost}
        />
      ) : (
        <Text>Please make sure to be connected with Metamask.</Text>
      )}

      {cid && (
        <Text>
          Post created. You can view it on{" "}
          <Link href={`https://ipfs.io/ipfs/${cid}`}>ipfs.io/ipfs/{cid}</Link>
        </Text>
      )}

      {tx && (
        <Text>
          Creating Post... Transaction hash: {tx}
          <Link href={`https://mumbai.polyscan.com/address/${tx}`}>
            Check on Polyscan
          </Link>
        </Text>
      )}
    </Box>
  )
}

export default CreatePost
