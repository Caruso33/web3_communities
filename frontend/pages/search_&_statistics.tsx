import { ApolloClient, gql, InMemoryCache } from "@apollo/client"
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Select,
} from "@chakra-ui/react"
import { useCallback, useEffect, useState } from "react"
import queryResponse from "../api/queryResponse"
import getSearchQuery from "../api/searchQueries"

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

  const categories = ["title", "author", "costContent", "commentContent"]
  const [posts, setPosts] = useState([])
  const [comments, setComments] = useState([])

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

      if (!searchType) searchType = search.category

      const query = getSearchQuery(searchType, search.term)

      client
        .query({
          query: gql(query),
        })
        .then(({ data }) =>
          queryResponse(searchType, data, {
            setPosts,
            setComments,
          })
        )
        .catch((err) => {
          console.log("Error fetching data: ", err)
        })
    },
    [search, searchError]
  )

  useEffect(() => {
    querySearch("posts")
    querySearch("comments")
  }, [querySearch])

  return (
    <Box m={5}>
      <Heading>Search {"&"} Statistics</Heading>

      <Box w="60vw" mx="auto">
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

        <FormControl
          variant="floating"
          id="categoryIndex"
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

        <Button onClick={querySearch}>Search</Button>
      </Box>
    </Box>
  )
}
