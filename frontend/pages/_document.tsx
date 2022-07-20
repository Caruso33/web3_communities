import { ColorModeScript } from "@chakra-ui/react"
import NextDocument, { Head, Html, Main, NextScript } from "next/document"
import { initialTheme } from "../utils/theme"
export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          {/* 👇 Here's the script */}
          <ColorModeScript
            initialColorMode={initialTheme.config.initialColorMode}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
