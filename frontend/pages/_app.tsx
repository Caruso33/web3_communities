import { ChakraProvider } from "@chakra-ui/react"
import type { AppProps } from "next/app"
import { Provider } from "react-redux"
import Wagmi from "../components/Wagmi"
import store from "../state/store"
import "../styles/globals.css"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ChakraProvider>
        <Wagmi>
          <Component {...pageProps} />
        </Wagmi>
      </ChakraProvider>
    </Provider>
  )
}

export default MyApp
