import { ColorModeScript } from "@chakra-ui/react"
import NextDocument, { Head, Html, Main, NextScript } from "next/document"
import { theme } from "../utils/theme"
export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <Head>
          <title>Web3 Communities</title>
          <meta name="description" content="Buidl your own Community" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <body>
          {/* 👇 Here's the script */}
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
