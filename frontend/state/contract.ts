import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"
import { Contract } from "ethers"

export interface ContractState {
  isCommunityProviderLoaded: boolean
  isCommunitySignerLoaded: boolean

  communityProvider: Contract | null
  communitySigner: Contract | null
}

const initialState: ContractState = {
  isCommunityProviderLoaded: false,
  isCommunitySignerLoaded: false,

  communityProvider: null,
  communitySigner: null,
}

export const ContractSlice = createSlice({
  name: "Contract",
  initialState,
  reducers: {
    setCommunityProvider: (state, action: PayloadAction<Contract>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.isCommunityProviderLoaded = true
      state.communityProvider = action.payload
    },

    setCommunitySigner: (state, action: PayloadAction<Contract>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.isCommunitySignerLoaded = true
      state.communitySigner = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setCommunityProvider, setCommunitySigner } =
  ContractSlice.actions

export default ContractSlice.reducer
