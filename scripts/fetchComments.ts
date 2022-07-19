import { HardhatRuntimeEnvironment } from "hardhat/types"
import { Community } from "../typechain-types/contracts/Community"

export default async function fetchComments(
  taskArgs: any,
  hre: HardhatRuntimeEnvironment
) {
  const { address, postid } = taskArgs

  const community = (await hre.ethers.getContractAt(
    "Community",
    address
  )) as Community

  const comments = await community.fetchCommentsOfPost(postid)

  console.log(`Comments: ${comments.join(", ")}`)
}
