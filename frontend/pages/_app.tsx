import { ChakraProvider } from "@chakra-ui/react"
import type { AppProps } from "next/app"
import { Provider } from "react-redux"
import Header from "../components/Header"
import Wagmi from "../components/Wagmi"
import { useIsMounted } from "../hooks"
import { store } from "../state/store"
import "../styles/globals.css"
import { customTheme } from "../utils/theme"

function MyApp({ Component, pageProps }: AppProps) {
  const isMounted = useIsMounted()

  return (
    <Provider store={store}>
      <ChakraProvider theme={customTheme}>
        <Wagmi>
          {isMounted && <Header />}

          <Component {...pageProps} />
        </Wagmi>
      </ChakraProvider>
    </Provider>
  )
}

export default MyApp
