import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Community } from "../../typechain-types/contracts/Community"
import { setIsPostLoading, setPost } from "../state/postComment"
import { RootState } from "../state/store"
import { PostStructOutput } from "./../../typechain-types/contracts/Blog.sol/Community"

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
        console.log("here", !communityContract, postsCommentsStore.isPostLoaded)
        return
      }
      console.log("there")

      try {
        dispatch(setIsPostLoading(true))
        const post: PostStructOutput = await communityContract?.fetchPostByHash(
          hash
        )
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
