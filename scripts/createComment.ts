import { HardhatRuntimeEnvironment } from "hardhat/types"
import type { Community } from "../typechain-types/contracts/Community"

export default async function createComment(
  taskArgs: any,
  hre: HardhatRuntimeEnvironment
) {
  const { address, postid, content } = taskArgs

  const community = (await hre.ethers.getContractAt(
    "Community",
    address
  )) as Community

  const tx = await community.createComment(postid, content)
  await tx.wait()

  console.log(`Comment created`)
}
