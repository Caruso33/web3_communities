import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"
import type {
  CommentStruct,
  PostStruct,
} from "../../typechain-types/contracts/Community"

const initialState: PostState = {
  isCategoriesLoaded: false,
  isPostsLoaded: false,
  isCommentsLoaded: false,
  categories: [],
  posts: [],
  comments: {},
}

export const PostCommentSlice = createSlice({
  name: "PostsCommentsCategories",
  initialState,
  reducers: {
    setIsPostsLoaded: (state, action: PayloadAction<boolean>) => {
      state.isPostsLoaded = action.payload
    },
    setIsCategoriesLoaded: (state, action: PayloadAction<boolean>) => {
      state.isCategoriesLoaded = action.payload
    },
    setIsCommentsLoaded: (state, action: PayloadAction<boolean>) => {
      state.isCommentsLoaded = action.payload
    },
    setCategories: (state, action: PayloadAction<string[]>) => {
      state.isCategoriesLoaded = true
      state.categories = action.payload
    },
    setPosts: (state, action: PayloadAction<PostStruct[]>) => {
      state.isPostsLoaded = true
      state.posts = action.payload
    },
    setComments: (state, action: PayloadAction<CommentStruct>) => {
      state.isCommentsLoaded = true
      state.comments = { ...state.comments, postId: action.payload }
    },
  },
})

export const {
  setIsPostsLoaded,
  setIsCategoriesLoaded,
  setIsCommentsLoaded,
  setCategories,
  setPosts,
  setComments,
} = PostCommentSlice.actions

export default PostCommentSlice.reducer

export interface PostState {
  isCategoriesLoaded: boolean
  isPostsLoaded: boolean
  isCommentsLoaded: boolean
  categories: string[]
  posts: PostStruct[]
  comments: Record<string, CommentStruct[]>
}
