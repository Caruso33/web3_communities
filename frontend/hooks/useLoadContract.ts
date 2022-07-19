import { ethers } from "ethers"
import { useEffect, useRef } from "react"
import { useDispatch } from "react-redux"
import { useNetwork, useProvider } from "wagmi"
import { setCommunity } from "../state/contract"
import deployment from "../utils/deployment.json"

function useLoadContracts() {
  const dispatch = useDispatch()
  const provider = useProvider()
  const { chain } = useNetwork()

  const prevChain = useRef(null)
  useEffect(() => {
    if (!chain?.id || chain.id === prevChain.current) {
      return
    }

    const deploymentChainData = deployment[`${chain.id}`]
    if (!deploymentChainData) {
      return
    }

    const communityContract = new ethers.Contract(
      deploymentChainData.address,
      deploymentChainData.abi,
      provider
    )

    dispatch(setCommunity(communityContract))

    prevChain.current = chain.id!
  }, [chain?.id, provider, dispatch])
}

export default useLoadContracts
