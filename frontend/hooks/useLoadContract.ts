import { ethers } from "ethers"
import { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNetwork, useSigner } from "wagmi"
import { setCommunity } from "../state/contract"
import deployment from "../utils/deployment.json"

function useLoadContracts() {
  const contractStore = useSelector((state: RootState) => state.contract)
  const dispatch = useDispatch()
  const { data: signer } = useSigner()

  const { chain } = useNetwork()

  const prevChain = useRef(chain?.id)
  useEffect(() => {
    if (
      !chain?.id ||
      (chain.id === prevChain.current && contractStore.isContractLoaded) ||
      !signer
    ) {
      return
    }

    const deploymentChainData = deployment[`${chain.id}`]
    if (!deploymentChainData) {
      return
    }

    const communityContract = new ethers.Contract(
      deploymentChainData.address,
      deploymentChainData.abi,
      signer
    )

    dispatch(setCommunity(communityContract))

    prevChain.current = chain.id!
  }, [
    chain?.id,
    signer,
    dispatch,
    chain,
    contractStore.isContractLoaded,
    prevChain,
  ])
}

export default useLoadContracts
