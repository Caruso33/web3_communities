import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setIsPostLoading, setPost } from "../state/postComment"
import { RootState } from "../state/store"
import type { Community } from "../typechain-types/contracts/Community"
import getIpfsJsonContent from "../utils/getIpfsJsonContent"

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

          const { content, coverImage: coverImageHash } = fileContent
          let coverImage = ""
          if (coverImageHash) {
            coverImage = await getIpfsJsonContent(
              coverImageHash,
              "readAsDataURL"
            )
          }

          // @ts-ignore
          dispatch(setPost({ ...post, content, coverImageHash, coverImage }))
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
