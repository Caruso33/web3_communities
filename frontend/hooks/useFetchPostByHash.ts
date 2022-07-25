import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setIsPostLoading, setPost } from "../state/postComment"
import { RootState } from "../state/store"
import type { Community } from "../typechain-types/contracts/Community"
import getIpfsJsonContent from "../utils/getIpfsJsonContent"
import Lit from "../utils/Lit"

function useFetchPostByHash(hash: string) {
  const contractStore = useSelector((state: RootState) => state.contract)
  const postsCommentsStore = useSelector(
    (state: RootState) => state.postsComments
  )

  const dispatch = useDispatch()

  useEffect(() => {
    async function fetchPost(hash: string) {
      const communityContract = contractStore?.community as Community
      if (!communityContract || postsCommentsStore.isPostLoaded || !hash) {
        return
      }

      try {
        dispatch(setIsPostLoading(true))
        const post: Community.PostStructOutput =
          await communityContract?.fetchPostByHash(hash)
        if (post) {
          const fileContent = await getIpfsJsonContent(post.hash)
          if (!fileContent) {
            throw new Error("Could not fetch post content")
          }

          const {
            coverImage: coverImageHash,
            accessControlConditions,
            encryptedString,
            encryptedSymmetricKey,
          } = fileContent

          let coverImage = ""
          if (coverImageHash) {
            coverImage = await getIpfsJsonContent(
              coverImageHash,
              "readAsDataURL"
            )
          }

          if (encryptedString && encryptedSymmetricKey) {
            const encryptedStringFile = await getIpfsJsonContent(
              encryptedString,
              "none"
            )

            const lit = new Lit()
            const { decryptedString } = await lit.decrypt(
              encryptedStringFile,
              encryptedSymmetricKey,
              JSON.parse(accessControlConditions),
              "mumbai"
            )

            console.dir("decryptedString", decryptedString)

            fileContent.content = decryptedString
          }

          // @ts-ignore
          dispatch(
            setPost({
              ...post,
              content: fileContent.content,
              coverImageHash,
              coverImage,
              accessControlConditions,
              encryptedString,
              encryptedSymmetricKey,
            })
          )
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
    postsCommentsStore.post,
    dispatch,
  ])
}

export default useFetchPostByHash
