import { ChevronRightIcon } from "@chakra-ui/icons"
import { Button } from "@chakra-ui/react"
import type { NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { PostStruct } from "../../typechain-types/contracts/Community"
import Header from "../components/Header"
import { useIsMounted } from "../hooks"
import useLoadContracts from "../hooks/useLoadContract"
import { setPosts } from "../state/postComment"
import { RootState } from "../state/store"

const Home: NextPage = () => {
  const isMounted = useIsMounted()
  useLoadContracts()

  const contractStore = useSelector((state: RootState) => state.contract)
  const postsCommentsStore = useSelector(
    (state: RootState) => state.postsComments
  )
  const dispatch = useDispatch()

  useEffect(() => {
    async function fetchPosts() {
      const communityContract = contractStore?.community
      if (!communityContract || postsCommentsStore.isPostsLoaded) {
        return
      }

      const posts = await communityContract?.fetchPosts()
      if (posts) {
        dispatch(setPosts(posts))
      }
    }

    fetchPosts()
  }, [contractStore?.community, postsCommentsStore.posts, dispatch])

  return (
    <div>
      <Head>
        <title>Web3 Communities</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {isMounted && <Header />}

      <Button>
        <Link href="/create-post"> Create Post</Link>
      </Button>

      {postsCommentsStore.posts.map((post: PostStruct, index) => {
        return (
          <Link href={`/post/${post.title}`} key={index}>
            <a>
              <div>
                <p>Author: {post.author}</p>
                <p>Title: {post.title}</p>
                <p>Content: {post.content}</p>
                <p>Comments: {post.comments}</p>
                <ChevronRightIcon />
              </div>
            </a>
          </Link>
        )
      })}
    </div>
  )
}

export default Home
