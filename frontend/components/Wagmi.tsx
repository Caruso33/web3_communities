// import { providers } from "ethers";
import {
  chain,
  configureChains,
  createClient,
  defaultChains,
  WagmiConfig,
} from "wagmi"
import { InjectedConnector } from "wagmi/connectors/injected"
import { alchemyProvider } from "wagmi/providers/alchemy"
// import { jsonRpcProvider } from "wagmi/providers/jsonRpc"
import { MetaMaskConnector } from "wagmi/connectors/metaMask"
import { publicProvider } from "wagmi/providers/public"
// import { JsonRpcProvider } from "@ethersproject/providers"

const { chains, provider, webSocketProvider } = configureChains(
  [
    ...defaultChains,
    chain.polygon,
    chain.polygonMumbai,
    // chain.hardhat,
    chain.localhost,
  ],
  [
    alchemyProvider({
      alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_ID,
    }),

    // jsonRpcProvider({
    //   rpc: (_chain) => ({
    //     http: "http://localhost:8545",
    //   }),
    // }),

    publicProvider(),
  ]
)
const wagmiClient = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new InjectedConnector({ chains }),
  ],
  provider,
  // provider: (config) => {
  //   if (config.chainId === chain.localhost.id) {
  //     return new providers.JsonRpcProvider();
  //   }
  //   // console.dir(chains, chain, config);

  //   return provider(config);
  //   // return getDefaultProvider(config.chainId);
  // },
  webSocketProvider,
})

export default function Wagmi({ children }: { children: React.ReactNode }) {
  return <WagmiConfig client={wagmiClient}>{children}</WagmiConfig>
}
