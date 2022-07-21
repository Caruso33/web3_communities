import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"
import type {
  CommentStruct,
  PostStruct,
} from "../../typechain-types/contracts/Community"

const initialState: PostState = {
  isCategoriesLoaded: false,
  categories: [],

  isPostsLoaded: false,
  posts: [],

  isPostLoaded: false,
  post: {},

  isCommentsLoaded: false,
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
      state.isCategoriesLoaded = !!action.payload
      state.categories = action.payload
    },

    setPosts: (state, action: PayloadAction<PostStruct[]>) => {
      state.isPostsLoaded = !!action.payload
      state.posts = action.payload
    },

    setPost: (state, action: PayloadAction<PostStruct>) => {
      state.isPostLoaded = !!action.payload
      state.post = action.payload
    },

    setComments: (state, action: PayloadAction<CommentStruct>) => {
      state.isCommentsLoaded = !!action.payload
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
  setPost,
  setComments,
} = PostCommentSlice.actions

export default PostCommentSlice.reducer

export interface PostState {
  isCategoriesLoaded: boolean
  categories: string[]

  isPostsLoaded: boolean
  posts: PostStruct[]

  isPostLoaded: boolean
  post: PostStruct

  isCommentsLoaded: boolean
  comments: Record<string, CommentStruct[]>
}
