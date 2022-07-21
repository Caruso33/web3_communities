import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"
import type {
  CommentStruct,
  PostStruct,
} from "../../typechain-types/contracts/Community"

const initialState: PostState = {
  isCategoriesLoading: false,
  isCategoriesLoaded: false,
  categories: [],

  isPostsLoading: false,
  isPostsLoaded: false,
  posts: [],

  isPostLoading: false,
  isPostLoaded: false,
  post: {},

  isCommentsLoading: false,
  isCommentsLoaded: false,
  comments: [],
}

export const PostCommentSlice = createSlice({
  name: "PostsCommentsCategories",
  initialState,
  reducers: {
    setIsCategoriesLoading: (state, action: PayloadAction<boolean>) => {
      state.isCategoriesLoading = action.payload
    },
    setIsCategoriesLoaded: (state, action: PayloadAction<boolean>) => {
      state.isCategoriesLoaded = action.payload
    },
    setCategories: (state, action: PayloadAction<string[]>) => {
      state.isCategoriesLoading = false
      state.isCategoriesLoaded = !!action.payload
      state.categories = action.payload
    },

    setIsPostsLoading: (state, action: PayloadAction<boolean>) => {
      state.isPostsLoading = action.payload
    },
    setIsPostsLoaded: (state, action: PayloadAction<boolean>) => {
      state.isPostsLoaded = action.payload
    },
    setPosts: (state, action: PayloadAction<PostStruct[]>) => {
      state.isPostsLoading = false
      state.isPostsLoaded = !!action.payload
      state.posts = action.payload
    },

    setIsPostLoading: (state, action: PayloadAction<boolean>) => {
      state.isPostLoading = action.payload
    },
    setPost: (state, action: PayloadAction<PostStruct>) => {
      state.isPostLoading = false
      state.isPostLoaded = !!action.payload
      state.post = action.payload
    },

    setIsCommentsLoading: (state, action: PayloadAction<boolean>) => {
      state.isCommentsLoading = action.payload
    },
    setIsCommentsLoaded: (state, action: PayloadAction<boolean>) => {
      state.isCommentsLoaded = action.payload
    },
    setComments: (state, action: PayloadAction<CommentStruct[]>) => {
      state.isCommentsLoading = false
      state.comments = action.payload
    },
  },
})

export const {
  setIsCategoriesLoading,
  setIsPostsLoading,
  setIsPostLoading,
  setIsCommentsLoading,
  setIsPostsLoaded,
  setIsCategoriesLoaded,
  setIsCommentsLoaded,
  setCategories,
  setPosts,
  setPost,
  setComments,
} = PostCommentSlice.actions

export default PostCommentSlice.reducer

export interface PostState {
  isCategoriesLoading: boolean
  isCategoriesLoaded: boolean
  categories: string[]

  isPostsLoading: boolean
  isPostsLoaded: boolean
  posts: PostStruct[]

  isPostLoading: boolean
  isPostLoaded: boolean
  post: PostStruct

  isCommentsLoading: boolean
  isCommentsLoaded: boolean
  comments: CommentStruct[]
}
