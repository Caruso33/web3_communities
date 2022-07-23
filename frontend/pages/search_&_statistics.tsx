import { ApolloClient, gql, InMemoryCache } from "@apollo/client"
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Select,
  Spinner,
  Text,
} from "@chakra-ui/react"
import { fromUnixTime } from "date-fns"
import { useCallback, useEffect, useMemo, useState } from "react"
import ReactMarkdown from "react-markdown"
import queryResponse from "../api/queryResponse"
import getSearchQuery from "../api/searchQueries"
import PostCard from "../components/PostCard"
import { Comment, Post } from "../state/postComment"

const APIURL =
  "https://api.thegraph.com/subgraphs/name/caruso33/web3-community-buidler"

const client = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache(),
})

export default function Search() {
  const [search, setSearch] = useState({ term: "", category: "" })
  const [searchError, setSearchError] = useState({
    term: false,
    category: false,
  })

  const categories = useMemo(
    () => ["Title", "Author", "Post Content", "Comment Content"],
    []
  )
  const [postCount, setPostCount] = useState([])
  const [commentCount, setCommentCount] = useState([])

  const [posts, setPosts] = useState<Post[]>([])
  const [comments, setComments] = useState<Comment[]>([])

  const [isLoading, setIsLoading] = useState(false)

  const querySearch = useCallback(
    (searchType: string) => {
      if (!searchType) {
        if (!search.term || !search.category) {
          setSearchError({
            ...searchError,
            term: !search.term,
            category: !search.category,
          })
          return
        }

        setSearchError({ term: false, category: false })
      }

      if (!searchType) searchType = categories[search.category as number]

      setIsLoading(true)

      const query = getSearchQuery(searchType, search.term)

      setPosts([])
      setComments([])

      client
        .query({ query: gql(query) })
        .then(({ data }) => {
          console.dir(data)
          queryResponse(searchType, data, {
            setPostCount,
            setCommentCount,
            setPosts,
            setComments,
          })
        })
        .catch((err) => {
          console.log("Error fetching data: ", err)
        })
        .finally(() => setIsLoading(false))
    },
    [search, searchError, categories]
  )

  useEffect(() => {
    if (postCount.length === 0 && commentCount.length === 0) {
      querySearch("Post Count")
      querySearch("Comment Count")
    }
  }, [postCount, commentCount, querySearch])

  return (
    <Box m={5}>
      <Heading>Statistics</Heading>

      <Box w="60vw" mx="auto" my={5}>
        <Text>Total Posts: {postCount || "-"}</Text>
        <Text>Total Comments: {commentCount || "-"}</Text>
      </Box>

      <Heading mt={5}>Search</Heading>

      <Box w="60vw" mx="auto">
        <FormControl
          variant="floating"
          id="category"
          isRequired
          isInvalid={searchError.category}
          my={5}
        >
          <FormLabel>Category</FormLabel>
          <Select
            placeholder="Select Category"
            value={search.category}
            onChange={(e) => setSearch({ ...search, category: e.target.value })}
          >
            {categories.map((category: string, index: number) => (
              <option key={index} value={index}>
                {category}
              </option>
            ))}
          </Select>
          <FormErrorMessage>Please select a category</FormErrorMessage>
        </FormControl>

        <FormControl
          variant="floating"
          id="term"
          isRequired
          isInvalid={searchError.term}
          my={5}
        >
          <FormLabel>Search Term</FormLabel>
          <Input
            onChange={(e) => setSearch({ ...search, term: e.target.value })}
            name="title"
            placeholder="What do you want to search for?"
            value={search.term}
            _placeholder={{ color: "inherit" }}
          />
          <FormHelperText>Keep it short and sweet!</FormHelperText>
          <FormErrorMessage>Please enter a title</FormErrorMessage>
        </FormControl>

        <Button isDisabled={isLoading} onClick={() => querySearch("")}>
          {isLoading ? <Spinner /> : "Search"}
        </Button>

        <Box my={5}>
          {posts.map((post: any) => (
            <Box key={post.id} mb={5}>
              <PostCard post={post} />
            </Box>
          ))}

          {comments.map((comment: any) => (
            <Flex
              key={`${comment.id}`}
              w="100%"
              p={5}
              shadow="md"
              borderWidth="1px"
              flexDirection="column"
              mb={5}
            >
              <Text noOfLines={1} as="i" alignSelf="flex-end" px={2}>
                by {comment.author as string}
              </Text>
              <Text alignSelf="flex-end" px={2}>
                {fromUnixTime(comment.createdAt).toLocaleString()}
              </Text>

              <Box mt={5}>
                <ReactMarkdown>{comment.content as string}</ReactMarkdown>
              </Box>
            </Flex>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
