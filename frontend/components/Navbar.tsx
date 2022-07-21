import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons"
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Link,
  Stack,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import { default as NextLink } from "next/link"
import { ReactNode } from "react"

const Links = ["Home", "Create-Post"]

const NavLink = ({ children, name }: { children: ReactNode; name: string }) => {
  const href = name === "Home" ? "/" : `/${name.toLowerCase()}`

  return (
    <Link
      px={2}
      py={1}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        bg: useColorModeValue("gray.200", "gray.700"),
      }}
    >
      <NextLink href={href}>{children}</NextLink>
    </Link>
  )
}

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <IconButton
            size="md"
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label="Open Menu"
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems="center">
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {Links.map((link) => (
                <NavLink key={link} name={link}>
                  {link}
                </NavLink>
              ))}
            </HStack>
          </HStack>
        </Flex>

        {isOpen && (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link} name={link}>
                  {link}
                </NavLink>
              ))}
            </Stack>
          </Box>
        )}
      </Box>
    </>
  )
}
