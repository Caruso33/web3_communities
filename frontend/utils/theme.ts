import { extendTheme } from "@chakra-ui/react"

const customTheme = extendTheme({
  semanticTokens: {
    colors: {
      error: "red.500",
      success: "green.500",
      primary: {
        default: "red.500",
        _dark: "red.400",
      },
      secondary: {
        default: "red.800",
        _dark: "red.700",
      },
    },
  },
})

const initialTheme = {
  config: {
    initialColorMode: "light" //| ("dark" as "dark") | "system",
  },
}

export { initialTheme, customTheme }
