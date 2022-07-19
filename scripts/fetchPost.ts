import { HardhatRuntimeEnvironment } from "hardhat/types"
import { Community } from "../typechain-types/contracts/Community"

export default async function fetchPost(
  taskArgs: any,
  hre: HardhatRuntimeEnvironment
) {
  const { address, postid, hash } = taskArgs

  if (!postid && !hash) {
    throw new Error("Either postid or hash must be provided")
  }

  const community = (await hre.ethers.getContractAt(
    "Community",
    address
  )) as Community

  let post
  if (postid) {
    post = await community.fetchPostById(postid)
  }
  if (hash) {
    post = await community.fetchPostByHash(hash)
  }

  console.log(`Post: ${post}`)
}
