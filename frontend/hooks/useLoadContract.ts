import { ethers } from "ethers"
import { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNetwork, useProvider, useSigner } from "wagmi"
import { setCommunity, setCommunitySigner } from "../state/contract"
import { RootState } from "../state/store"
import deployment from "../utils/deployment.json"

function useLoadContracts() {
  const contractStore = useSelector((state: RootState) => state.contract)
  const dispatch = useDispatch()

  const provider = useProvider()

  const { chain } = useNetwork()

  const prevChain = useRef(chain?.id)
  useEffect(() => {
    if (
      !process.env.NEXT_PUBLIC_DEPLOYED_CHAIN_ID ||
      (+process.env.NEXT_PUBLIC_DEPLOYED_CHAIN_ID === prevChain.current &&
        contractStore.isCommunityLoaded) ||
      !provider
    ) {
      return
    }

    const deploymentChainData =
      deployment[process.env.NEXT_PUBLIC_DEPLOYED_CHAIN_ID!]
    if (!deploymentChainData) {
      return
    }

    const communityContractProvider = new ethers.Contract(
      deploymentChainData.address,
      deploymentChainData.abi,
      provider
    )

    dispatch(setCommunity(communityContractProvider))

    prevChain.current = +process.env.NEXT_PUBLIC_DEPLOYED_CHAIN_ID!
  }, [provider, dispatch, chain, contractStore.isCommunityLoaded, prevChain])
}

export default useLoadContracts
