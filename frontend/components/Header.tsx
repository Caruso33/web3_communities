import { MoonIcon, SunIcon } from "@chakra-ui/icons"
import { Text, Box, Button, useColorMode } from "@chakra-ui/react"
import Image from "next/image"
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
    content = (
      <Box border="1px" borderColor="gray.200" px={5} py={2}>
        <Button onClick={() => connect()}>Connect Wallet</Button>
      </Box>
    )
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
          <Image
            src="/logo-small-transparent.png"
            alt="Web3 Community Builder"
            // 1080 × 446
            width="146"
            height="60"
          />

          <Box ml={5}>
            <Text noOfLines={1}>Connected to {address}</Text>{" "}
            <Text>on network {chain?.name}</Text>
          </Box>

          <Button ml={2} onClick={() => disconnect()}>
            Disconnect
          </Button>
        </Box>

        <Box ml={5}>
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
        <Box>
          {content}

          <Box>
            Please connect to one of the chain(s):{" "}
            {deployedChainNames.join(", ")}
          </Box>
        </Box>
      )
    }
  }

  return content
}

export default Header
