// import { providers } from "ethers"
import {
  chain,
  configureChains,
  createClient,
  defaultChains,
  WagmiConfig,
} from "wagmi"
import { InjectedConnector } from "wagmi/connectors/injected"
import { MetaMaskConnector } from "wagmi/connectors/metaMask"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { jsonRpcProvider } from "wagmi/providers/jsonRpc"
import { publicProvider } from "wagmi/providers/public"
// import { JsonRpcProvider } from "@ethersproject/providers"

const isLocalNetwork = process.env.NEXT_PUBLIC_DEPLOYED_CHAIN_ID === "1337"

const { chainArray, providerArray } = getChainsProviders(isLocalNetwork)

const { chains, provider, webSocketProvider } = configureChains(
  chainArray,
  providerArray
)
const wagmiClient = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new InjectedConnector({ chains }),
  ],
  provider,
  webSocketProvider,
})

export default function Wagmi({ children }: { children: React.ReactNode }) {
  return <WagmiConfig client={wagmiClient}>{children}</WagmiConfig>
}

function getChainsProviders(isLocalNetwork: boolean) {
  let chainArray = [...defaultChains, chain.polygon, chain.polygonMumbai]
  let providerArray = [
    alchemyProvider({
      alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_ID,
    }),

    publicProvider(),
  ]

  if (isLocalNetwork) {
    console.log("Connecting to local JSON-RPC provider")

    chainArray = [
      // chain.hardhat,
      chain.localhost,
    ]

    providerArray = [
      jsonRpcProvider({
        rpc: (_chain) => {
          return {
            http: "http://localhost:8545",
          }
        },
      }),
    ]
  }

  return { chainArray, providerArray }
}
