import { ethers } from "ethers"
import { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNetwork, useProvider, useSigner } from "wagmi"
import { setCommunityProvider, setCommunitySigner } from "../state/contract"
import { RootState } from "../state/store"
import deployment from "../utils/deployment.json"

function useLoadContracts() {
  const contractStore = useSelector((state: RootState) => state.contract)
  const dispatch = useDispatch()

  const provider = useProvider()
  const { data: signer } = useSigner()

  const { chain } = useNetwork()

  const prevChain = useRef(chain?.id)
  useEffect(() => {
    if (
      !process.env.NEXT_PUBLIC_DEPLOYED_CHAIN_ID ||
      (+process.env.NEXT_PUBLIC_DEPLOYED_CHAIN_ID === prevChain.current &&
        contractStore.isCommunityProviderLoaded) ||
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

    dispatch(setCommunityProvider(communityContractProvider))

    prevChain.current = +process.env.NEXT_PUBLIC_DEPLOYED_CHAIN_ID!
  }, [
    provider,
    dispatch,
    chain,
    contractStore.isCommunityProviderLoaded,
    prevChain,
  ])

  useEffect(() => {
    if (
      !chain?.id ||
      (chain.id === prevChain.current &&
        contractStore.isCommunitySignerLoaded) ||
      !signer
    ) {
      return
    }

    const deploymentChainData = deployment[`${chain.id}`]
    if (!deploymentChainData) {
      return
    }

    const communityContractSigned = new ethers.Contract(
      deploymentChainData.address,
      deploymentChainData.abi,
      signer
    )

    dispatch(setCommunitySigner(communityContractSigned))

    prevChain.current = chain.id!
  }, [
    chain?.id,
    signer,
    dispatch,
    chain,
    contractStore.isCommunitySignerLoaded,
    prevChain,
  ])
}

export default useLoadContracts
