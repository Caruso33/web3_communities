import Lit from "../scripts/Lit"
import { assert, expect } from "chai"
import { ethers } from "hardhat"

describe("Lit", async () => {
  let lit: Lit
  const message = "Hello World"
  let accessControlConditions: any[]
  let accounts, ownerAddress

  const chain = "mumbai"

  beforeEach(async () => {
    lit = new Lit()

    accessControlConditions = lit.getAccessControlConditions(
      "0xB5BFCa5B8938834B2B5E475CBDC9E31E4554fE64",
      chain,
      "0",
      "ERC20"
    )

    accounts = await ethers.getSigners()
    ownerAddress = accounts[0].address
  })

  it("Should encrypt the message", async () => {
    const { encryptedString, encryptedSymmetricKey } = await lit.encrypt(
      message,
      accessControlConditions,
      chain
    )
    expect(encryptedString).to.be.a("string")
    expect(encryptedSymmetricKey).to.be.a("string")
  })
})
