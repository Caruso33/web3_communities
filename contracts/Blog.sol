//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.14;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error Blog__onlyOwner();
error Blog__onlyPostAuthor();
error Blog__onlyCommentAuthor();

contract Blog is Ownable {
    string public name;

    using Counters for Counters.Counter;
    Counters.Counter private _postIds;

    struct Comment {
        address author;
        uint256 id;
        string content;
        uint256 createdAt;
        uint256 lastUpdatedAt;
    }

    struct Post {
        address author;
        uint256 id;
        string title;
        string content;
        bool published;
        uint256 createdAt;
        uint256 lastUpdatedAt;
        Comment[] comments;
    }
    /* mappings can be seen as hash tables */
    /* here we create lookups for posts by id and posts by ipfs hash */
    mapping(uint256 => Post) private idToPost;
    mapping(string => Post) private hashToPost;

    event PostCreated(
        address indexed author,
        uint256 id,
        string title,
        string hash,
        uint256 createdAt
    );
    event PostUpdated(
        address indexed author,
        uint256 id,
        string title,
        string hash,
        bool published,
        uint256 createdAt,
        uint256 lastUpdatedAt
    );
    event CommentCreated(
        uint256 indexed postId,
        address indexed author,
        uint256 id,
        string hash,
        uint256 createdAt
    );
    event CommentUpdated(
        uint256 indexed postId,
        address indexed author,
        uint256 id,
        string hash,
        uint256 createdAt,
        uint256 lastUpdatedAt
    );

    /* when the blog is deployed, give it a name */
    /* also set the creator as the owner of the contract */
    constructor(string memory _name) {
        console.log("Deploying Blog with name:", _name);
        name = _name;
    }

    function updateName(string memory _name) public {
        name = _name;
    }

    /* fetches an individual post by the content hash */
    function fetchPost(string memory hash) public view returns (Post memory) {
        return hashToPost[hash];
    }

    /* creates a new post */
    function createPost(string memory title, string memory hash) public {
        _postIds.increment();
        uint256 postId = _postIds.current();

        Post storage post = idToPost[postId];

        post.author = msg.sender;
        post.id = postId;
        post.title = title;
        post.content = hash;
        post.published = true;
        post.createdAt = block.timestamp;
        post.lastUpdatedAt = block.timestamp;
        // post.comments = new Comment[](0);

        hashToPost[hash] = post;

        emit PostCreated(msg.sender, postId, title, hash, block.timestamp);
    }

    /* updates an existing post */
    function updatePost(
        uint256 postId,
        string memory title,
        string memory hash,
        bool published
    ) public onlyPostAuthor(postId) {
        Post storage post = idToPost[postId];

        post.title = title;
        post.content = hash;
        post.published = published;
        post.lastUpdatedAt = block.timestamp;

        idToPost[postId] = post;
        hashToPost[hash] = post;

        emit PostUpdated(
            msg.sender,
            post.id,
            title,
            hash,
            published,
            post.createdAt,
            post.lastUpdatedAt
        );
    }

    /* creates a new comment */
    function createComment(uint256 postId, string memory hash)
        public
        onlyOwner
    {
        Post storage post = idToPost[postId];

        Comment storage comment = post.comments[post.comments.length];
        comment.author = msg.sender;
        comment.id = post.comments.length;
        comment.content = hash;
        comment.createdAt = block.timestamp;

        // post.comments.push(comment);

        emit CommentCreated(
            postId,
            msg.sender,
            post.comments.length,
            hash,
            block.timestamp
        );
    }

    /* updates an existing comment */
    function updateComment(
        uint256 postId,
        uint256 commentId,
        string memory hash
    ) public onlyCommentAuthor(postId, commentId) {
        Post storage post = idToPost[postId];

        Comment storage comment = post.comments[commentId];
        comment.content = hash;
        comment.lastUpdatedAt = block.timestamp;

        // post.comments[commentId] = comment;

        idToPost[postId] = post;
        hashToPost[hash] = post;

        emit CommentUpdated(
            postId,
            msg.sender,
            commentId,
            hash,
            comment.createdAt,
            comment.lastUpdatedAt
        );
    }

    /* fetches all posts */
    function fetchPosts() public view returns (Post[] memory) {
        uint256 itemCount = _postIds.current();

        Post[] memory posts = new Post[](itemCount);
        for (uint256 i = 0; i < itemCount; i++) {
            uint256 currentId = i + 1;
            Post storage currentItem = idToPost[currentId];
            posts[i] = currentItem;
        }
        return posts;
    }

    modifier onlyPostAuthor(uint256 postId) {
        Post storage post = idToPost[postId];

        if (msg.sender != post.author) revert Blog__onlyPostAuthor();
        _;
    }

    modifier onlyCommentAuthor(uint256 postId, uint256 commentId) {
        Post storage post = idToPost[postId];
        Comment storage comment = post.comments[commentId];

        if (msg.sender != comment.author) revert Blog__onlyCommentAuthor();
        _;
    }
}
