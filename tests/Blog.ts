import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { Contract } from "ethers"
import { ethers } from "hardhat"

describe("Blog", async () => {
  let blog: Contract
  let accounts: SignerWithAddress[]
  let ownerAddress: string

  beforeEach(async () => {
    const Blog = await ethers.getContractFactory("Blog")

    blog = await Blog.deploy("My Blog")
    await blog.deployed()

    accounts = await ethers.getSigners()
    ownerAddress = accounts[0].address
  })

  describe("Deployment", function () {
    it("Should set the right owner", async () => {
      expect(await blog.owner()).to.equal(accounts[0].address)
    })

    it("Should set the right name", async () => {
      expect(await blog.name()).to.equal("My Blog")
    })
  })
})
