import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { Contract } from "ethers"
import { ethers } from "hardhat"

describe("Blog", async () => {
  let blog: Contract
  let accounts: SignerWithAddress[]
  // let owner = accounts[0]

  beforeEach(async () => {
    const Blog = await ethers.getContractFactory("Blog")

    blog = await Blog.deploy("My Blog")
    await blog.deployed()

    accounts = await ethers.getSigners()
  })

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await blog.owner()).to.equal(accounts[0].address)
    })
  })
})
