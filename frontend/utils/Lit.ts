import LitJsSdk from "lit-js-sdk"

const client = new LitJsSdk.LitNodeClient()
// const chain = "ethereum"
// const standardContractType = "ERC721"

class Lit {
  private litNodeClient: any

  async connect() {
    await client.connect()
    this.litNodeClient = client
  }

  getAccessControlConditions(
    contractAddress: string,
    chain: string,
    minBalance = "0",
    standardContractType = "ERC20"
  ) {
    const accessControlConditions = [
      {
        contractAddress,
        standardContractType,
        chain,
        method: "balanceOf",
        parameters: [":userAddress"],
        returnValueTest: {
          comparator: ">",
          value: minBalance,
        },
      },
    ]

    return accessControlConditions
  }

  async encrypt(
    message: string,
    accessControlConditions: any[],
    chain: string
  ) {
    if (!this.litNodeClient) {
      await this.connect()
    }

    const authSig = await LitJsSdk.checkAndSignAuthMessage({
      chain,
    })
    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(
      message
    )

    const encryptedSymmetricKey = await this.litNodeClient.saveEncryptionKey({
      accessControlConditions,
      symmetricKey,
      authSig,
      chain,
    })

    return {
      encryptedString,
      encryptedSymmetricKey: LitJsSdk.uint8arrayToString(
        encryptedSymmetricKey,
        "base16"
      ),
    }
  }

  async decrypt(
    encryptedString: string,
    encryptedSymmetricKey: string,
    accessControlConditions: any,
    chain: string
  ) {
    if (!this.litNodeClient) {
      await this.connect()
    }

    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain })

    const symmetricKey = await this.litNodeClient.getEncryptionKey({
      accessControlConditions,
      toDecrypt: encryptedSymmetricKey,
      chain,
      authSig,
    })

    const decryptedString = await LitJsSdk.decryptString(
      encryptedString,
      symmetricKey
    )

    return { decryptedString }
  }
}

export default Lit

export const erc20Chains = [
  //   "ethereum",
  //   "polygon",
  //   "fantom",
  //   "bsc",
  //   "arbitrum",
  //   "avalanche",
  //   "harmony",
  //   "kovan",
  "mumbai",
  //   "goerli",
  //   "ropsten",
  //   "rinkeby",
  //   "optimism",
  //   "solana",
  //   "solanaDevnet",
  //   "solanaTestnet",
  //   "cosmos",
]
