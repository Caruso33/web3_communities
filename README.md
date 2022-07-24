# web3_communities

## Idea

Spin up a community in fast manner through deployment of a contract and frontend to commnicate with your audience in decentralized fassion.
Use blog, comment, statistics, search and content encryption functionality. With the community there comes also a ERC20 token to check for the encryption against if the holder owns a token amount above given threshold.

As this was a solo hack, time constraints meant unfortunately not being able to include a chat functionality (through using xmtp) and including meetups (through using poap as attendance proof).

## Deployments

### Contract

Polygon Mumbai @ `0x5DfA37185fb3Cf5C16e12584805A8315D8d4DB57`

[Mumbai Polyscan](https://mumbai.polygonscan.com/address/0x5DfA37185fb3Cf5C16e12584805A8315D8d4DB57)

## Components

- [IPFS](https://ipfs.io/)
- [Polygon](https://polygon.io/)
- [TheGraph](https://thegraph.com/)
- [Lit Protocol](https://litprotocol.com/)
- [Spheron](https://aqua.spheron.network/)

### Other tools

- [NextJs](https://nextjs.org/)
- [Hardhat](https://hardhat.org/)

### IPFS / Filecoin

Through [web3.storage](https://web3.storage/) all heavy lifting of data is done. On the network the main content of post and comments are stored. That means cover image files, encrypted string blobs and the collection of the data as json.
Without it, a blog would simply not feasible to implement.

### Polygon

The contract is deployed on the mumbai test net.

### Graph

Is used for indexing events and making them available for search & statistics.

I introduce counter variables to track the number of entities to make them visible in the dashboard.

```shell
graph init --from-contract 0x5DfA37185fb3Cf5C16e12584805A8315D8d4DB57 \
    --network mumbai --contract-name Community --index-events
```

### Lit Protocol

Is used for post and comment content encryption. The user can choose if he wants to encrypt. Depending on that the content will be stores as plaintext on IPFS or the relevant encoding data of the content. The content then can be decrypted depending on having a certain token balance which the user can configure, e.g. the ERC20 token which is also deployed with this contract.

### Spheron

Is used for deployment of the frontend.
