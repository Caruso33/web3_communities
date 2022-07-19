//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.14;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error Community__onlyOwner();
error Community__onlyPostAuthor();
error Community__onlyCommentAuthor();
error Community__DuplicateCategory();
error Community__PostIdNotValid();

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

    string[] private categories;

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
        uint256 commentId,
        string hash,
        uint256 createdAt
    );
    event CommentUpdated(
        uint256 indexed postId,
        address indexed author,
        uint256 commentId,
        string hash,
        uint256 createdAt,
        uint256 lastUpdatedAt
    );
    event CommentDeleted(
        uint256 indexed postId,
        address indexed author,
        uint256 commentId,
        uint256 deletedAt
    );

    constructor(string memory _name) {
        name = _name;
    }

    function updateName(string memory _name) public onlyOwner {
        name = _name;
    }

    function createCategory(string memory _name) public onlyOwner {
        for (uint256 i = 0; i < categories.length; i++) {
            if (
                keccak256(abi.encodePacked(categories[i])) ==
                keccak256(abi.encodePacked(_name))
            ) {
                revert Community__DuplicateCategory();
            }
        }

        categories.push(_name);
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
        post.categoryIndex = categoryIndex;
        post.published = true;
        post.createdAt = block.timestamp;
        post.lastUpdatedAt = block.timestamp;
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
        post.categoryIndex = categoryIndex;
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
    function createComment(uint256 postId, string memory hash) public {
        Post storage post = idToPost[postId];

        if (post.author == address(0x0)) revert Community__PostIdNotValid();

        // Comment storage comment = post.comments[post.comments.length];
        Comment memory comment;

        comment.author = msg.sender;
        comment.id = post.comments.length;
        comment.content = hash;
        comment.createdAt = block.timestamp;
        comment.lastUpdatedAt = block.timestamp;

        post.comments.push(comment);

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

        // not needed, storage pointers!
        // post.comments[commentId] = comment;
        // idToPost[postId] = post;

        emit CommentUpdated(
            postId,
            msg.sender,
            commentId,
            hash,
            comment.createdAt,
            comment.lastUpdatedAt
        );
    }

    function deleteComment(uint256 postId, uint256 commentId) public onlyOwner {
        Post storage post = idToPost[postId];

        delete post.comments[commentId];

        // idToPost[postId] = post;

        emit CommentDeleted(postId, msg.sender, commentId, block.timestamp);
    }

    function fetchCategories() public view returns (string[] memory) {
        return categories;
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

    function fetchPostById(uint256 postId) public view returns (Post memory) {
        return idToPost[postId];
    }

    function fetchPostByHash(string memory hash)
        public
        view
        returns (Post memory)
    {
        return hashToPost[hash];
    }

    function fetchCommentsOfPost(uint256 postId)
        public
        view
        returns (Comment[] memory)
    {
        Post storage post = idToPost[postId];

        return post.comments;

        // uint256 itemCount = post.comments.length;

        // Comment[] memory comments = new Comment[](itemCount);
        // for (uint256 i = 0; i < itemCount; i++) {
        //     uint256 currentId = i + 1;
        //     Comment storage currentItem = post.comments[currentId];
        //     comments[i] = currentItem;
        // }
        // return comments;
    }

    modifier onlyPostAuthor(uint256 postId) {
        Post storage post = idToPost[postId];

        if (msg.sender != post.author) revert Community__onlyPostAuthor();
        _;
    }

    modifier onlyCommentAuthor(uint256 postId, uint256 commentId) {
        Post storage post = idToPost[postId];
        Comment storage comment = post.comments[commentId];

        if (msg.sender != comment.author) revert Community__onlyCommentAuthor();
        _;
    }
}
