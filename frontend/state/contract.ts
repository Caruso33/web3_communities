import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"
import { Contract } from "ethers"

export interface ContractState {
  isContractLoaded: boolean
  community: Contract | null
}

const initialState: ContractState = {
  isContractLoaded: false,
  community: null,
}

export const ContractSlice = createSlice({
  name: "Contract",
  initialState,
  reducers: {
    setCommunity: (state, action: PayloadAction<Contract>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.isContractLoaded = true
      state.community = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setCommunity } = ContractSlice.actions

export default ContractSlice.reducer
