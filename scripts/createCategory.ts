import { HardhatRuntimeEnvironment } from "hardhat/types"
import { Community } from "./../typechain-types/contracts/Community"

export default async function createCategory(
  taskArgs: any,
  hre: HardhatRuntimeEnvironment
) {
  const { address, name } = taskArgs

  const community = (await hre.ethers.getContractAt(
    "Community",
    address
  )) as Community

  const tx = await community.createCategory(name)
  await tx.wait()

  console.log(`Created category ${name}`)

  const categories = await community.fetchCategories()

  console.log(`Categories: ${categories}`)
}
