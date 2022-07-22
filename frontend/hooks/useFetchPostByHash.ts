import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setIsPostLoading, setPost } from "../state/postComment"
import { RootState } from "../state/store"
import type { Community } from "../typechain-types/contracts/Community"

function useFetchPostByHash(hash: string) {
  const contractStore = useSelector((state: RootState) => state.contract)
  const postsCommentsStore = useSelector(
    (state: RootState) => state.postsComments
  )

  const dispatch = useDispatch()

  useEffect(() => {
    async function fetchPost(hash: string) {
      const communityContract = contractStore?.community as Community
      if (!communityContract || postsCommentsStore.isPostLoaded) {
        return
      }

      try {
        dispatch(setIsPostLoading(true))
        const post: Community.PostStructOutput =
          await communityContract?.fetchPostByHash(hash)
        if (post) {
          dispatch(setPost(post))
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
    dispatch,
  ])
}

export default useFetchPostByHash
