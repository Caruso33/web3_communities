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

const providerArray = [
  alchemyProvider({
    alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_ID,
  }),

  publicProvider(),
]

if (isLocalNetwork) {
  console.log("Connecting to local JSON-RPC provider")

  providerArray.unshift(
    jsonRpcProvider({
      rpc: (_chain) => {
        return {
          http: "http://localhost:8545",
        }
      },
    })
  )
}

const { chains, provider, webSocketProvider } = configureChains(
  [
    ...defaultChains,
    chain.polygon,
    chain.polygonMumbai,
    // chain.hardhat,
    chain.localhost,
  ],
  providerArray
)
const wagmiClient = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new InjectedConnector({ chains }),
  ],
  provider,
  // provider: (config) => {
  //   console.dir(config)

  //   if (
  //     config.chainId === chain.localhost.id ||
  //     (!config.chainId &&
  //       process.env.NEXT_PUBLIC_DEPLOYED_CHAIN_ID &&
  //       +process.env.NEXT_PUBLIC_DEPLOYED_CHAIN_ID === 1337)
  //   ) {
  //     return new providers.JsonRpcProvider()
  //   }

  //   return provider(config)
  //   // return getDefaultProvider(config.chainId);
  // },
  webSocketProvider,
})

export default function Wagmi({ children }: { children: React.ReactNode }) {
  return <WagmiConfig client={wagmiClient}>{children}</WagmiConfig>
}
