import "@nomicfoundation/hardhat-toolbox"
import "@nomiclabs/hardhat-ethers"
import "@nomiclabs/hardhat-etherscan"
import "@nomiclabs/hardhat-waffle"
import "@typechain/hardhat"
import "hardhat-deploy"
import "hardhat-gas-reporter"
import { HardhatUserConfig, task } from "hardhat/config"
import createCategory from "./scripts/createCategory"
import createComment from "./scripts/createComment"
import createPost from "./scripts/createPost"
import fetchCategories from "./scripts/fetchCategories"
import fetchComments from "./scripts/fetchComments"
import fetchPost from "./scripts/fetchPost"
import fetchPosts from "./scripts/fetchPosts"
import "dotenv/config"

task("fetchCategories", "Fetches all categories")
  .addParam("address", "The address of the contract")
  .setAction(async (taskArgs, hre) => {
    return fetchCategories(taskArgs, hre)
  })

task("createCategory", "Creates a new category")
  .addParam("address", "The address of the contract")
  .addParam("name", "The name of the new category")
  .setAction(async (taskArgs, hre) => {
    return createCategory(taskArgs, hre)
  })

task("fetchPosts", "Fetches all posts")
  .addParam("address", "The address of the contract")
  .setAction(async (taskArgs, hre) => {
    return fetchPosts(taskArgs, hre)
  })

task("fetchPost", "Fetches one post")
  .addParam("address", "The address of the contract")
  .addOptionalParam("postid", "The postid of the post")
  .addOptionalParam("hash", "The hash of the post")
  .setAction(async (taskArgs, hre) => {
    return fetchPost(taskArgs, hre)
  })

task("createPost", "Creates a new post")
  .addParam("address", "The address of the contract")
  .addParam("title", "The title of the post")
  .addParam("content", "The content of the post")
  .addParam("categoryindex", "The index of the category the post belongs to")
  .setAction(async (taskArgs, hre) => {
    return createPost(taskArgs, hre)
  })

task("fetchComments", "Fetches all comments")
  .addParam("address", "The address of the contract")
  .addParam("postid", "The postid of the post")
  .setAction(async (taskArgs, hre) => {
    return fetchComments(taskArgs, hre)
  })

task("createComment", "Creates a new comment")
  .addParam("address", "The address of the contract")
  .addParam("postid", "The id of the post")
  .addParam("content", "The content of the post")
  .setAction(async (taskArgs, hre) => {
    return createComment(taskArgs, hre)
  })

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.14",
    settings: {
      optimizer: {
        enabled: true,
        runs: 20,
      },
    },
  },
  paths: { tests: "tests" },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    localhost: {
      url: "http://localhost:8545",
      chainId: 1337,
    },
    mumbai: {
      url: process.env.POLYGON_MUMBAI || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      chainId: 80001,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  mocha: {
    timeout: 100000,
  },
  namedAccounts: {
    deployer: {
      default: 0,
      1: 0, // use first account for mainnet (chainId 1)
    },
  },
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v5",
  },
}

export default config
