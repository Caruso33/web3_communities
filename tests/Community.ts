import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { assert, expect } from "chai"
import { Contract } from "ethers"
import { ethers } from "hardhat"

describe("Community", async () => {
  let community: Contract
  let accounts: SignerWithAddress[]
  let ownerAddress: string

  beforeEach(async () => {
    const Community = await ethers.getContractFactory("Community")

    community = await Community.deploy("My Community")
    await community.deployed()

    accounts = await ethers.getSigners()
    ownerAddress = accounts[0].address
  })

  describe("Deployment", function () {
    it("Should set the right owner", async () => {
      expect(await community.owner()).to.equal(accounts[0].address)
    })

    it("Should set the right name", async () => {
      expect(await community.name()).to.equal("My Community")
    })
  })

  describe("Category", function () {
    it("Should create category", async () => {
      let categories = await community.fetchCategories()
      assert.equal(categories.length, 0)

      await community.createCategory("Category 1")

      categories = await community.fetchCategories()
      expect(categories[0]).to.equal("Category 1")
      assert.equal(categories.length, 1)

      await community.createCategory("Category 2")

      categories = await community.fetchCategories()
      expect((await community.fetchCategories())[1]).to.equal("Category 2")
      assert.equal(categories.length, 2)
    })
  })
})
