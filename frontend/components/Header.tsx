import { useAccount, useConnect, useDisconnect, useNetwork } from "wagmi"
import { InjectedConnector } from "wagmi/connectors/injected"
import deployment from "../utils/deployment.json"

function Header() {
  const { address, isConnected } = useAccount()
  const { chain, chains } = useNetwork()

  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  const { disconnect } = useDisconnect()

  let content: JSX.Element

  if (!isConnected)
    content = <button onClick={() => connect()}>Connect Wallet</button>
  else {
    content = (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>
          <span>Connected to {address}</span>{" "}
          <span>on network {chain?.name}</span>
        </div>

        <button onClick={() => disconnect()}>Disconnect</button>
      </div>
    )

    const deployedChainIds = Object.keys(deployment)
      // .filter((chainIdString) => chainIdString !== "1337")
      .map((chainIdString) => +chainIdString)

    if (!deployedChainIds?.includes(chain?.id)) {
      const deployedChainNames = chains
        .filter((chain) => deployedChainIds.includes(chain.id))
        .map((chain) => chain.name)

      return (
        <>
          {content}
          <div>
            Please connect to one of the chain(s): {deployedChainNames.join(", ")}
          </div>
        </>
      )
    }
  }

  return content
}

export default Header
