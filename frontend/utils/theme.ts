import { extendTheme, ThemeConfig } from "@chakra-ui/react"

const config: ThemeConfig = {
  useSystemColorMode: true,
  initialColorMode: "system",
}

const theme = extendTheme({
  config,
  // semanticTokens: {
  //   colors: {
  //     error: "red.500",
  //     success: "green.500",
  //     primary: {
  //       default: "red.500",
  //       _dark: "red.400",
  //     },
  //     secondary: {
  //       default: "red.800",
  //       _dark: "red.700",
  //     },
  //   },
  // },
})

export { theme }
