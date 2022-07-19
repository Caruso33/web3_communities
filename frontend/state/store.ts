import { configureStore } from "@reduxjs/toolkit"
import logger from "redux-logger"
import ContractReducer from "./contract"

const middlewares = [logger]

export const store = configureStore({
  reducer: {
    contract: ContractReducer,
  },
  middleware: middlewares,
  devTools: true,
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
