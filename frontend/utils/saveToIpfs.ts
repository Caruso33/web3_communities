import getWeb3StorageClient from "./web3Storage"

const web3StorageClient = getWeb3StorageClient()

function savePostToIpfs(
  object: any,
  filename: string,
  wrapWithDirectory: boolean = false
): Promise<string | Error> {
  return new Promise(async (resolve, reject) => {
    /* save post metadata to ipfs */
    try {
      const postBlob = new Blob([JSON.stringify(object)], {
        type: "application/json",
      })
      const postFile = new File([postBlob], filename)

      const uploadedCID = await web3StorageClient.put([postFile], {
        wrapWithDirectory,
      })

      console.log("Uploading object to ipfs...")
      console.log("Data: ", JSON.stringify(object, null, 4))
      console.log("CID: ", uploadedCID)

      resolve(uploadedCID)
    } catch (err) {
      console.log("error: ", err)
      reject(err)
    }
  })
}

export default savePostToIpfs
