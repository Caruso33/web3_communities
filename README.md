# web3_communities

## Deployments

### Contract

Polygon Mumbai @ `0xe73b7C2Df18ad8EDe0F56fb41a15Bc0e0103D5cd`

[Mumbai Polyscan](https://mumbai.polygonscan.com/address/0xe73b7C2Df18ad8EDe0F56fb41a15Bc0e0103D5cd)

## Components

- [NextJs](https://nextjs.org/)
- [Hardhat](https://hardhat.org/)
- [TheGraph](https://thegraph.com/)

### Graph

Is used for indexing events and making them available for search & statistics.

I introduce counter variables to track the number of entities to make them visible in the dashboard.

```shell
graph init --from-contract 0xe73b7C2Df18ad8EDe0F56fb41a15Bc0e0103D5cd \
    --network mumbai --contract-name Community --index-events
```
