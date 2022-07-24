import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"
import type { Community } from "../typechain-types/contracts/Community"

const initialState: PostState = {
  isCategoriesLoading: false,
  isCategoriesLoaded: false,
  categories: [],

  isPostsLoading: false,
  isPostsLoaded: false,
  posts: [],

  isPostLoading: false,
  isPostLoaded: false,
  post: null,

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
    setPosts: (state, action: PayloadAction<Post[]>) => {
      state.isPostsLoading = false
      state.isPostsLoaded = !!action.payload
      state.posts = action.payload
    },

    setIsPostLoading: (state, action: PayloadAction<boolean>) => {
      state.isPostLoading = action.payload
    },
    setIsPostLoaded: (state, action: PayloadAction<boolean>) => {
      state.isPostLoaded = action.payload
    },
    setPost: (state, action: PayloadAction<Post | null>) => {
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
    setComments: (state, action: PayloadAction<Community.CommentStruct[]>) => {
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
  setIsPostLoaded,
  setIsCategoriesLoaded,
  setIsCommentsLoaded,
  setCategories,
  setPosts,
  setPost,
  setComments,
} = PostCommentSlice.actions

export default PostCommentSlice.reducer

export interface Post extends Community.PostStructOutput {
  content: string
  coverImageHash: string
  coverImage: string
  accessControlConditions: string
  encryptedString: string
  encryptedSymmetricKey: string
}

export interface Comment extends Community.CommentStructOutput {
  content: string
  accessControlConditions: string
  encryptedString: string
  encryptedSymmetricKey: string
}

export interface PostState {
  isCategoriesLoading: boolean
  isCategoriesLoaded: boolean
  categories: string[]

  isPostsLoading: boolean
  isPostsLoaded: boolean
  posts: Post[]

  isPostLoading: boolean
  isPostLoaded: boolean
  post: Post | null

  isCommentsLoading: boolean
  isCommentsLoaded: boolean
  comments: Comment[]
}
