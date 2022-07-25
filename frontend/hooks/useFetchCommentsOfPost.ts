import { useCallback, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  Comment,
  Post,
  setComments,
  setIsCommentsLoaded,
  setIsCommentsLoading,
} from "../state/postComment"
import { RootState } from "../state/store"
import { Community } from "../typechain-types"
import getIpfsJsonContent from "../utils/getIpfsJsonContent"

async function useFetchCommentsOfPost() {
  const contractStore = useSelector((state: RootState) => state.contract)
  const postsCommentsStore = useSelector(
    (state: RootState) => state.postsComments
  )
  const dispatch = useDispatch()

  const fetchComments = useCallback(async () => {
    const communityContract = contractStore?.community as Community
    if (
      !communityContract ||
      !postsCommentsStore.isPostLoaded ||
      !postsCommentsStore.post ||
      postsCommentsStore.isCommentsLoaded
    ) {
      return
    }

    try {
      dispatch(setIsCommentsLoading(true))

      const postComments = await communityContract?.fetchCommentsOfPost(
        (postsCommentsStore.post as Post).id
      )

      let comments: Comment[] = []
      if (postComments) {
        // @ts-ignore
        comments = await Promise.all(
          postComments.map(async (comment) => {
            const fileContent = await getIpfsJsonContent(comment.hash)
            return { ...comment, content: fileContent.content }
          })
        )
      }

      dispatch(setComments(comments))
      dispatch(setIsCommentsLoaded(true))
    } catch (error) {
      console.error(error)
    } finally {
      dispatch(setIsCommentsLoading(false))
    }
  }, [
    contractStore?.community,
    postsCommentsStore.isPostLoaded,
    postsCommentsStore.post,
    postsCommentsStore.isCommentsLoaded,
    dispatch,
  ])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])
}

export default useFetchCommentsOfPost
