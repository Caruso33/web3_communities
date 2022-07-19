import { HardhatRuntimeEnvironment } from "hardhat/types"
import { Community } from "../typechain-types/contracts/Community"

export default async function fetchCategories(
  taskArgs: any,
  hre: HardhatRuntimeEnvironment
) {
  const { address } = taskArgs

  const community = (await hre.ethers.getContractAt(
    "Community",
    address
  )) as Community

  const categories = await community.fetchCategories()

  console.log(`Categories: ${categories.join(", ")}`)
}
