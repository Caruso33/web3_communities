import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { assert, expect } from "chai"
import { Contract } from "ethers"
import { ethers } from "hardhat"

describe("Community", async () => {
  let community: Contract
  let accounts: SignerWithAddress[]
  let ownerAddress: string
  let categories = ["Category 1", "Category 2"]

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

    it("Should update the name", async () => {
      const newName = "My updated Community"

      await community.updateName(newName)

      expect(await community.name()).to.equal(newName)
    })

    it("Should revert when not owner on update the name", async () => {
      await expect(
        community.connect(accounts[1]).updateName("My updated Community")
      ).to.be.revertedWith("Ownable: caller is not the owner")
    })
  })

  describe("Category", function () {
    it("Should create category", async () => {
      let categories = await community.fetchCategories()

      assert.equal(categories[0], "*")
      assert.equal(categories.length, 1)

      await community.createCategory("Category 1")

      categories = await community.fetchCategories()
      expect(categories[1]).to.equal("Category 1")
      assert.equal(categories.length, 2)

      await community.createCategory("Category 2")

      categories = await community.fetchCategories()
      expect((await community.fetchCategories())[2]).to.equal("Category 2")
      assert.equal(categories.length, 3)
    })

    it("Should revert when creating duplicate category", async () => {
      let categories = await community.fetchCategories()
      assert.equal(categories.length, 1)

      await community.createCategory("Category 1")
      await community.createCategory("Category 2")

      await expect(community.createCategory("*")).to.be.revertedWithCustomError(
        community,
        "Community__DuplicateCategory"
      )
      await expect(
        community.createCategory("Category 2")
      ).to.be.revertedWithCustomError(community, "Community__DuplicateCategory")
    })

    it("Should revert when not owner on create category", async () => {
      await expect(
        community.connect(accounts[1]).createCategory("Category 1")
      ).to.be.revertedWith("Ownable: caller is not the owner")
    })
  })

  describe("Post", function () {
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
      expect(post.hash).to.equal(hash)
      expect(post.published).to.equal(published)
      expect(post.createdAt).to.equal(block.timestamp)
      expect(post.lastUpdatedAt).to.equal(block.timestamp)
      expect(post.categoryIndex).to.equal(0)

      expect(posts.length).to.equal(1)

      post = await community.fetchPostById(postId)
      expect(post.title).to.equal(title)
      expect(post.hash).to.equal(hash)

      post = await community.fetchPostByHash(hash)
      expect(post.title).to.equal(title)
      expect(post.hash).to.equal(hash)
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
      expect(post.hash).to.equal(hash)

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
      expect(updatedPost.hash).to.equal(updateHash)
      expect(updatedPost.published).to.equal(updatePublished)
      expect(updatedPost.createdAt).to.equal(post.createdAt)
      expect(updatedPost.lastUpdatedAt).to.equal(block.timestamp)
      expect(updatedPost.categoryIndex).to.equal(updateCategoryIndex)
    })

    it("Should revert when not author on update a post", async () => {
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
      expect(post.hash).to.equal(hash)

      const tx = community
        .connect(accounts[1])
        .updatePost(
          postId,
          updateTitle,
          updateHash,
          updateCategoryIndex,
          updatePublished
        )

      await expect(tx).to.be.revertedWithCustomError(
        community,
        "Community__onlyPostAuthor"
      )
    })
  })

  describe("Comment", function () {
    beforeEach(async () => {
      for await (const category of categories) {
        await community.createCategory(category)
      }

      const title = "Title",
        hash = ethers.utils.sha256(ethers.utils.toUtf8Bytes("Content 🥰")),
        categoryIndex = 0

      await community.createPost(title, hash, categoryIndex)
    })

    it("Should create a comment", async () => {
      const hash = ethers.utils.sha256(
        ethers.utils.toUtf8Bytes("Comment Content 🥰")
      )
      const postId = 1,
        commentId = 0,
        commentLength = 1

      const tx = await community.createComment(postId, hash)
      const block = await ethers.provider.getBlock(tx.blockNumber)

      await expect(tx)
        .to.emit(community, "CommentCreated")
        .withArgs(postId, ownerAddress, commentLength, hash, block.timestamp)

      const comments = await community.fetchCommentsOfPost(postId)
      const comment = comments[0]

      expect(comment.author).to.equal(ownerAddress)
      expect(comment.id).to.equal(commentId)
      expect(comment.hash).to.equal(hash)
      expect(comment.createdAt).to.equal(block.timestamp)
      expect(comment.lastUpdatedAt).to.equal(block.timestamp)

      expect(comments.length).to.equal(commentLength)
    })

    it("Should revert when post does not exist", async () => {
      const hash = ethers.utils.sha256(
        ethers.utils.toUtf8Bytes("Comment Content 🥰")
      )
      const postId = 5

      const tx = community.createComment(postId, hash)

      await expect(tx).to.be.revertedWithCustomError(
        community,
        "Community__PostIdNotValid"
      )
    })

    it("Should update a comment", async () => {
      const hash = ethers.utils.sha256(
        ethers.utils.toUtf8Bytes("Comment Content 🥰")
      )

      const updatedHash = ethers.utils.sha256(
        ethers.utils.toUtf8Bytes("Updated Comment Content 🥰")
      )
      const postId = 1,
        commentId = 0,
        commentLength = 1

      await community.createComment(postId, hash)

      const comments = await community.fetchCommentsOfPost(postId)
      const comment = comments[0]

      expect(comment.hash).to.equal(hash)

      expect(comments.length).to.equal(commentLength)

      const tx = await community.updateComment(postId, commentId, updatedHash)
      const block = await ethers.provider.getBlock(tx.blockNumber)

      await expect(tx)
        .to.emit(community, "CommentUpdated")
        .withArgs(
          postId,
          ownerAddress,
          commentId,
          updatedHash,
          comment.createdAt,
          block.timestamp
        )

      const updatedComments = await community.fetchCommentsOfPost(postId)
      const updatedComment = updatedComments[0]

      expect(updatedComment.author).to.equal(ownerAddress)
      expect(updatedComment.id).to.equal(commentId)
      expect(updatedComment.hash).to.equal(updatedHash)
      expect(updatedComment.createdAt).to.equal(comment.createdAt)
      expect(updatedComment.lastUpdatedAt).to.equal(block.timestamp)

      expect(updatedComments.length).to.equal(commentLength)
    })

    it("Should revert when not author on update a comment", async () => {
      const hash = ethers.utils.sha256(
        ethers.utils.toUtf8Bytes("Comment Content 🥰")
      )

      const updatedHash = ethers.utils.sha256(
        ethers.utils.toUtf8Bytes("Updated Comment Content 🥰")
      )
      const postId = 1,
        commentId = 0,
        commentLength = 1

      await community.createComment(postId, hash)

      const comments = await community.fetchCommentsOfPost(postId)
      const comment = comments[0]

      expect(comment.hash).to.equal(hash)

      expect(comments.length).to.equal(commentLength)

      const tx = community
        .connect(accounts[1])
        .updateComment(postId, commentId, updatedHash)

      await expect(tx).to.be.revertedWithCustomError(
        community,
        "Community__onlyCommentAuthor"
      )
    })

    it("Should delete a comment", async () => {
      const hash1 = ethers.utils.sha256(
        ethers.utils.toUtf8Bytes("Comment Content 1 🥰")
      )
      const hash2 = ethers.utils.sha256(
        ethers.utils.toUtf8Bytes("Comment Content 2 🥰")
      )
      const hash3 = ethers.utils.sha256(
        ethers.utils.toUtf8Bytes("Comment Content 3 🥰")
      )
      const postId = 1,
        commentId = 1,
        commentLength = 3

      await community.createComment(postId, hash1)
      await community.createComment(postId, hash2)
      await community.createComment(postId, hash3)

      const comments = await community.fetchCommentsOfPost(postId)
      const comment = comments[1]

      expect(comment.hash).to.equal(hash2)

      expect(comments.length).to.equal(commentLength)

      const tx = await community.deleteComment(postId, commentId)
      const block = await ethers.provider.getBlock(tx.blockNumber)

      await expect(tx)
        .to.emit(community, "CommentDeleted")
        .withArgs(postId, ownerAddress, commentId, block.timestamp)

      const updatedComments = await community.fetchCommentsOfPost(postId)
      expect(updatedComments[0].hash).to.equal(hash1)
      expect(updatedComments[2].hash).to.equal(hash3)

      expect(updatedComments[commentId].author).to.equal(
        ethers.constants.AddressZero
      )
      expect(updatedComments[commentId].id).to.equal(0)
      expect(updatedComments[commentId].hash).to.equal("")
      expect(updatedComments[commentId].createdAt).to.equal(0)
      expect(updatedComments[commentId].lastUpdatedAt).to.equal(0)
    })
  })
})
