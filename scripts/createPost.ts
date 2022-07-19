import { HardhatRuntimeEnvironment } from "hardhat/types"
import { Community } from "./../typechain-types/contracts/Community"

export default async function createPost(
  taskArgs: any,
  hre: HardhatRuntimeEnvironment
) {
  const { address, title, content, categoryindex } = taskArgs

  const community = (await hre.ethers.getContractAt(
    "Community",
    address
  )) as Community

  const tx = await community.createPost(title, content, categoryindex)
  await tx.wait()

  console.log(`Post created`)
}
