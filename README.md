# web3_communities

## Idea

Spin up a community in fast manner through deployment of a contract and frontend to commnicate with your audience in decentralized fassion.
Use blog, comment, statistics and search functionality.

As this was a solo hack, time constraints meant unfortunately not being able to include a chat functionality (through using xmpt) and including meetups (through using poap).

## Deployments

### Contract

Polygon Mumbai @ `0xB5BFCa5B8938834B2B5E475CBDC9E31E4554fE64`

[Mumbai Polyscan](https://mumbai.polygonscan.com/address/0xB5BFCa5B8938834B2B5E475CBDC9E31E4554fE64)

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
graph init --from-contract 0xB5BFCa5B8938834B2B5E475CBDC9E31E4554fE64 \
    --network mumbai --contract-name Community --index-events
```

### Lit Protocol

Is used for post and comment encryption. The user can choose if to encrypt or not depending on having a token balance, e.g. the ERC20 token which is also deployed with this contract.

### Spheron

Is used for deployment of the frontend.
