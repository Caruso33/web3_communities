import {
  CommentCreated as CommentCreatedEvent,
  CommentDeleted as CommentDeletedEvent,
  CommentUpdated as CommentUpdatedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  PostCreated as PostCreatedEvent,
  PostUpdated as PostUpdatedEvent,
} from "../../generated/Community/Community"
import {
  Comment,
  Counter,
  OwnershipTransferred,
  Post,
} from "../../generated/schema"
import { readIpfsData } from "./utils"

export function handlePostCreated(event: PostCreatedEvent): void {
  let counter = Counter.load("post")
  if (!counter) {
    counter = new Counter("post")
    counter.count = 0
  }

  counter.count = counter.count + 1
  counter.save()

  let entity = new Post(
    // event.transaction.hash.toHex() + "-" + event.logIndex.toString()
    event.params.id.toString()
  )

  entity.author = event.params.author
  // entity.id = event.params.id
  entity.title = event.params.title
  entity.hash = event.params.hash
  entity.published = true

  // fetch ipfs data
  entity.content = readIpfsData(event.params.hash)

  entity.categoryIndex = event.params.categoryIndex
  entity.createdAt = event.params.createdAt
  entity.save()
}

export function handlePostUpdated(event: PostUpdatedEvent): void {
  let entity = Post.load(
    // event.transaction.hash.toHex() + "-" + event.logIndex.toString()
    event.params.id.toString()
  )
  if (entity) {
    entity.author = event.params.author
    // entity.id = event.params.id
    entity.title = event.params.title
    entity.hash = event.params.hash

    // fetch ipfs data
    entity.content = readIpfsData(event.params.hash)

    entity.categoryIndex = event.params.categoryIndex
    entity.published = event.params.published
    entity.createdAt = event.params.createdAt
    entity.lastUpdatedAt = event.params.lastUpdatedAt
    entity.save()
  }
}

export function handleCommentCreated(event: CommentCreatedEvent): void {
  let counter = Counter.load("comment")
  if (!counter) {
    counter = new Counter("comment")
    counter.count = 0
  }

  counter.count = counter.count + 1
  counter.save()

  let entity = new Comment(
    // event.transaction.hash.toHex() + "-" + event.logIndex.toString()
    event.params.commentId.toString()
  )
  entity.postId = event.params.postId.toString()
  entity.author = event.params.author
  // entity.commentId = event.params.commentId
  entity.hash = event.params.hash

  // fetch ipfs data
  entity.content = readIpfsData(event.params.hash)

  entity.createdAt = event.params.createdAt
  entity.save()
}

export function handleCommentUpdated(event: CommentUpdatedEvent): void {
  let entity = Comment.load(
    // event.transaction.hash.toHex() + "-" + event.logIndex.toString()
    event.params.commentId.toString()
  )
  if (entity) {
    entity.postId = event.params.postId.toString()
    entity.author = event.params.author
    // entity.commentId = event.params.commentId
    entity.hash = event.params.hash

    // fetch ipfs data
    entity.content = readIpfsData(event.params.hash)

    entity.createdAt = event.params.createdAt
    entity.lastUpdatedAt = event.params.lastUpdatedAt
    entity.save()
  }
}

export function handleCommentDeleted(event: CommentDeletedEvent): void {
  let entity = Comment.load(
    // event.transaction.hash.toHex() + "-" + event.logIndex.toString()
    event.params.commentId.toString()
  )
  if (entity) {
    entity.postId = event.params.postId.toString()
    entity.author = event.params.author
    // entity.commentId = event.params.commentId
    entity.deletedAt = event.params.deletedAt
    entity.save()
  }
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner
  entity.save()
}
