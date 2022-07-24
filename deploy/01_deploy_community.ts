import "dotenv/config"
import fs from "fs"
import { ethers, network } from "hardhat"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import path from "path"
import { developmentChains } from "../scripts/hardhat-helper-config"
import { verify } from "../scripts/verify"

const deploy = async (hre: HardhatRuntimeEnvironment) => {
  const { getNamedAccounts, deployments } = hre

  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId!

  log("----------------------------------------------------")
  log("Deploying Community and waiting for confirmations...")

  const waitBlockConfirmations = developmentChains.includes(network.name)
    ? 1
    : 6

  const communityName = "EthGlobal Community"
  const tokenName = "ETH Global City"
  const tokenSymbol = "GloCi"
  const initialSupply = 1_000

  const args = [communityName, tokenName, tokenSymbol, initialSupply]

  const community = await deploy("Community", {
    from: deployer,
    args,
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: waitBlockConfirmations,
  })
  log(`Community deployed at ${community.address}`)

  // frontend info
  const dappDeploymentFile = path.join(
    __dirname,
    "../frontend/utils/deployment.json"
  )
  const deploymentFile = path.join(
    __dirname,
    `../deployments/${
      network.name === "hardhat" ? "localhost" : network.name
    }/community.json`
  )

  let data: any = {}
  if (fs.existsSync(dappDeploymentFile)) {
    log("Found existing deployment file")
    const currentData = fs.readFileSync(dappDeploymentFile, {
      encoding: "utf8",
      flag: "r",
    })
    data = JSON.parse(currentData)
  }

  const newData = fs.readFileSync(deploymentFile, {
    encoding: "utf8",
    flag: "r",
  })
  data[chainId] = JSON.parse(newData)

  fs.writeFileSync(
    dappDeploymentFile,
    JSON.stringify(data, null, "\t"),
    "utf-8"
  )

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(community.address, args)
  }
}

export default deploy
deploy.tags = ["all", "community"]
