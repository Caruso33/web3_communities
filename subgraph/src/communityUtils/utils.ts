import { ipfs, json } from "@graphprotocol/graph-ts"

export function readIpfsData(hash: string): string {
  let data = ipfs.cat(hash)
  if (data) {
    let value = json.fromBytes(data).toObject()
    if (value) {
      let content = value.get("content")
      if (content) {
        return content.toString()
      }
    }
  }
  return ""
}
