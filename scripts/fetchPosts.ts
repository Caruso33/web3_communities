import { HardhatRuntimeEnvironment } from "hardhat/types"
import { Community } from "../typechain-types/contracts/Community"

export default async function fetchPosts(
  taskArgs: any,
  hre: HardhatRuntimeEnvironment
) {
  const { address } = taskArgs

  const community = (await hre.ethers.getContractAt(
    "Community",
    address
  )) as Community

  const posts = await community.fetchPosts()

  console.log(`Posts: ${posts.join(", ")}`)
}
