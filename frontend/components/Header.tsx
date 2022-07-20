import { MoonIcon, SunIcon } from "@chakra-ui/icons"
import { Box, Button, useColorMode } from "@chakra-ui/react"
import { useAccount, useConnect, useDisconnect, useNetwork } from "wagmi"
import { InjectedConnector } from "wagmi/connectors/injected"
import deployment from "../utils/deployment.json"

function Header() {
  const { colorMode, toggleColorMode } = useColorMode()

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
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        border="1px"
        borderColor="gray.200"
        px={5}
        py={2}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <span>Connected to {address}</span>{" "}
          <span>on network {chain?.name}</span>
          <Button ml={2} onClick={() => disconnect()}>
            Disconnect
          </Button>
        </Box>

        <Box>
          <Button onClick={toggleColorMode}>
            {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          </Button>
        </Box>
      </Box>
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
          <Box>
            Please connect to one of the chain(s):{" "}
            {deployedChainNames.join(", ")}
          </Box>
        </>
      )
    }
  }

  return content
}

export default Header
