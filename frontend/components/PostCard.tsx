import { ChevronRightIcon } from "@chakra-ui/icons"
import { Box, Flex, Heading, Link, Text } from "@chakra-ui/react"
import { fromUnixTime } from "date-fns"
import { BigNumber } from "ethers"
import { default as NextLink } from "next/link"
import { Post } from "../state/postComment"

export default function PostCard(props: any) {
  const { post } = props
  post as Post

  return (
    <Box
      display="flex"
      p={5}
      shadow="md"
      borderWidth="1px"
      w="60vw"
      _hover={{
        shadow: "xl",
        borderWidth: "2px",
      }}
    >
      <Box w="100%" style={{ cursor: "pointer" }}>
        <NextLink href={`/post/${post.hash}`} passHref>
          <Link>
            <ChevronRightIcon
              boxSize={50}
              style={{ height: "100%", float: "right" }}
            />

            <Flex flexDirection="column">
              <Text noOfLines={1} as="i" alignSelf="flex-end" px={2}>
                by {post.author as string}
              </Text>

              <Text alignSelf="flex-end" px={2}>
                {fromUnixTime(
                  BigNumber.isBigNumber(post?.createdAt)
                    ? post?.createdAt?.toNumber()
                    : post?.createdAt
                ).toLocaleString()}
              </Text>

              <Heading fontSize="xl">{post.title as string}</Heading>
            </Flex>
          </Link>
        </NextLink>

        <NextLink href={`https://ipfs.io/ipfs/${post.hash}`} passHref>
          <Box mt={5} pb={5}>
            <Link>
              {post.content ? (
                <Text noOfLines={3}>{post.content as string}</Text>
              ) : (
                <Text noOfLines={3}>Content at: {post.hash as string}</Text>
              )}
            </Link>
          </Box>
        </NextLink>
      </Box>
    </Box>
  )
}
