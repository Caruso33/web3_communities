import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { assert, expect } from "chai"
import { Contract } from "ethers"
import { ethers } from "hardhat"

describe("Community", async () => {
  let community: Contract
  let accounts: SignerWithAddress[]
  let ownerAddress: string

  beforeEach(async () => {
    const Community = await ethers.getContractFactory("Community")

    community = await Community.deploy("My Community")
    await community.deployed()

    accounts = await ethers.getSigners()
    ownerAddress = accounts[0].address
  })

  describe("Deployment", function () {
    it("Should set the right owner", async () => {
      expect(await community.owner()).to.equal(accounts[0].address)
    })

    it("Should set the right name", async () => {
      expect(await community.name()).to.equal("My Community")
    })
  })

  describe("Category", function () {
    it("Should create category", async () => {
      let categories = await community.fetchCategories()
      assert.equal(categories.length, 0)

      await community.createCategory("Category 1")

      categories = await community.fetchCategories()
      expect(categories[0]).to.equal("Category 1")
      assert.equal(categories.length, 1)

      await community.createCategory("Category 2")

      categories = await community.fetchCategories()
      expect((await community.fetchCategories())[1]).to.equal("Category 2")
      assert.equal(categories.length, 2)
    })
  })
  describe("Post", function () {
    let categories = ["Category 1", "Category 2"]
    beforeEach(async () => {
      for await (const category of categories) {
        await community.createCategory(category)
      }
    })

    it("Should create a post", async () => {
      const title = "Title",
        hash = ethers.utils.sha256(ethers.utils.toUtf8Bytes("Content 🥰")),
        categoryIndex = 0

      const tx = await community.createPost(title, hash, categoryIndex)
      const block = await ethers.provider.getBlock(tx.blockNumber)

      const postId = 1,
        published = true

      await expect(tx)
        .to.emit(community, "PostCreated")
        .withArgs(
          ownerAddress,
          postId,
          title,
          hash,
          categoryIndex,
          block.timestamp
        )

      const posts = await community.fetchPosts()
      let post = posts[0]

      expect(post.author).to.equal(ownerAddress)
      expect(post.id).to.equal(postId)
      expect(post.title).to.equal(title)
      expect(post.content).to.equal(hash)
      expect(post.published).to.equal(published)
      expect(post.createdAt).to.equal(block.timestamp)
      expect(post.lastUpdatedAt).to.equal(block.timestamp)
      expect(post.categoryIndex).to.equal(0)
      expect(post.comments.length).to.equal(0)

      expect(posts.length).to.equal(1)

      post = await community.fetchPostById(postId)
      expect(post.title).to.equal(title)
      expect(post.content).to.equal(hash)

      post = await community.fetchPostByHash(hash)
      expect(post.title).to.equal(title)
      expect(post.content).to.equal(hash)
    })

    it("Should update a post", async () => {
      const title = "Title",
        hash = ethers.utils.sha256(ethers.utils.toUtf8Bytes("Content 🥰")),
        categoryIndex = 0

      const updateTitle = "Title 2",
        updateHash = ethers.utils.sha256(
          ethers.utils.toUtf8Bytes("Updated Content 🥰")
        ),
        updateCategoryIndex = 1,
        updatePublished = false

      await community.createPost(title, hash, categoryIndex)

      const postId = 1

      const post = await community.fetchPostById(postId)
      expect(post.title).to.equal(title)
      expect(post.content).to.equal(hash)

      const tx = await community.updatePost(
        postId,
        updateTitle,
        updateHash,
        updateCategoryIndex,
        updatePublished
      )
      const block = await ethers.provider.getBlock(tx.blockNumber)

      await expect(tx)
        .to.emit(community, "PostUpdated")
        .withArgs(
          ownerAddress,
          postId,
          updateTitle,
          updateHash,
          updateCategoryIndex,
          updatePublished,
          post.createdAt,
          block.timestamp
        )

      const updatedPost = await community.fetchPostById(postId)
      expect(updatedPost.author).to.equal(ownerAddress)
      expect(updatedPost.id).to.equal(postId)
      expect(updatedPost.title).to.equal(updateTitle)
      expect(updatedPost.content).to.equal(updateHash)
      expect(updatedPost.published).to.equal(updatePublished)
      expect(updatedPost.createdAt).to.equal(post.createdAt)
      expect(updatedPost.lastUpdatedAt).to.equal(block.timestamp)
      expect(updatedPost.categoryIndex).to.equal(updateCategoryIndex)
      expect(updatedPost.comments.length).to.equal(0)
    })
  })
})
