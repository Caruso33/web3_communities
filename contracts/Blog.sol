//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.14;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error Blog__onlyOwner();
error Blog__onlyPostAuthor();
error Blog__onlyCommentAuthor();

contract Community is Ownable {
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
        uint256 categoryIndex;
        bool published;
        uint256 createdAt;
        uint256 lastUpdatedAt;
        Comment[] comments;
    }

    string[] public categories;

    mapping(uint256 => Post) private idToPost;
    mapping(string => Post) private hashToPost;

    event PostCreated(
        address indexed author,
        uint256 id,
        string title,
        string hash,
        uint256 categoryIndex,
        uint256 createdAt
    );
    event PostUpdated(
        address indexed author,
        uint256 id,
        string title,
        string hash,
        uint256 categoryIndex,
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

    constructor(string memory _name) {
        name = _name;
    }

    function updateName(string memory _name) public onlyOwner {
        name = _name;
    }

    function createCategory(string memory _name)
        public
        onlyOwner
        returns (bool success)
    {
        bool isDuplicate = false;

        for (uint256 i = 0; i < categories.length; i++) {
            if (
                keccak256(abi.encodePacked(categories[i])) ==
                keccak256(abi.encodePacked(_name))
            ) {
                isDuplicate = true;
                success = false;
                break;
            }
        }
        if (!isDuplicate) {
            categories.push(_name);
            success = true;
        }
    }

    /* creates a new post */
    function createPost(
        string memory title,
        string memory hash,
        uint256 categoryIndex
    ) public {
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
        post.categoryIndex = categoryIndex;
        // post.comments = new Comment[](0);

        hashToPost[hash] = post;

        emit PostCreated(
            msg.sender,
            postId,
            title,
            hash,
            categoryIndex,
            block.timestamp
        );
    }

    /* updates an existing post */
    function updatePost(
        uint256 postId,
        string memory title,
        string memory hash,
        uint256 categoryIndex,
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
            categoryIndex,
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

    function fetchPost(string memory hash) public view returns (Post memory) {
        return hashToPost[hash];
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
