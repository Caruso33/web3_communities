/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  Community,
  CommunityInterface,
} from "../../../contracts/Blog.sol/Community";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "Blog__onlyCommentAuthor",
    type: "error",
  },
  {
    inputs: [],
    name: "Blog__onlyPostAuthor",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "postId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "author",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "hash",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "createdAt",
        type: "uint256",
      },
    ],
    name: "CommentCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "postId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "author",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "hash",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "createdAt",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "lastUpdatedAt",
        type: "uint256",
      },
    ],
    name: "CommentUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "author",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "title",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "hash",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "categoryIndex",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "createdAt",
        type: "uint256",
      },
    ],
    name: "PostCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "author",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "title",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "hash",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "categoryIndex",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "published",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "createdAt",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "lastUpdatedAt",
        type: "uint256",
      },
    ],
    name: "PostUpdated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "categories",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
    ],
    name: "createCategory",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "postId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "hash",
        type: "string",
      },
    ],
    name: "createComment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "title",
        type: "string",
      },
      {
        internalType: "string",
        name: "hash",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "categoryIndex",
        type: "uint256",
      },
    ],
    name: "createPost",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "hash",
        type: "string",
      },
    ],
    name: "fetchPost",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "author",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "title",
            type: "string",
          },
          {
            internalType: "string",
            name: "content",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "categoryIndex",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "published",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "createdAt",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "lastUpdatedAt",
            type: "uint256",
          },
          {
            components: [
              {
                internalType: "address",
                name: "author",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "id",
                type: "uint256",
              },
              {
                internalType: "string",
                name: "content",
                type: "string",
              },
              {
                internalType: "uint256",
                name: "createdAt",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "lastUpdatedAt",
                type: "uint256",
              },
            ],
            internalType: "struct Community.Comment[]",
            name: "comments",
            type: "tuple[]",
          },
        ],
        internalType: "struct Community.Post",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "fetchPosts",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "author",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "title",
            type: "string",
          },
          {
            internalType: "string",
            name: "content",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "categoryIndex",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "published",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "createdAt",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "lastUpdatedAt",
            type: "uint256",
          },
          {
            components: [
              {
                internalType: "address",
                name: "author",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "id",
                type: "uint256",
              },
              {
                internalType: "string",
                name: "content",
                type: "string",
              },
              {
                internalType: "uint256",
                name: "createdAt",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "lastUpdatedAt",
                type: "uint256",
              },
            ],
            internalType: "struct Community.Comment[]",
            name: "comments",
            type: "tuple[]",
          },
        ],
        internalType: "struct Community.Post[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "postId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "commentId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "hash",
        type: "string",
      },
    ],
    name: "updateComment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
    ],
    name: "updateName",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "postId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "title",
        type: "string",
      },
      {
        internalType: "string",
        name: "hash",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "categoryIndex",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "published",
        type: "bool",
      },
    ],
    name: "updatePost",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405162001f5e38038062001f5e833981016040819052620000349162000168565b6200003f336200005c565b805162000054906001906020840190620000ac565b505062000280565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b828054620000ba9062000244565b90600052602060002090601f016020900481019282620000de576000855562000129565b82601f10620000f957805160ff191683800117855562000129565b8280016001018555821562000129579182015b82811115620001295782518255916020019190600101906200010c565b50620001379291506200013b565b5090565b5b808211156200013757600081556001016200013c565b634e487b7160e01b600052604160045260246000fd5b600060208083850312156200017c57600080fd5b82516001600160401b03808211156200019457600080fd5b818501915085601f830112620001a957600080fd5b815181811115620001be57620001be62000152565b604051601f8201601f19908116603f01168101908382118183101715620001e957620001e962000152565b8160405282815288868487010111156200020257600080fd5b600093505b8284101562000226578484018601518185018701529285019262000207565b82841115620002385760008684830101525b98975050505050505050565b600181811c908216806200025957607f821691505b6020821081036200027a57634e487b7160e01b600052602260045260246000fd5b50919050565b611cce80620002906000396000f3fe608060405234801561001057600080fd5b50600436106100af5760003560e01c806306fdde03146100b4578063121253e7146100d257806340a17985146100e757806344828659146100fa578063715018a61461011a578063742d931a1461012257806384da92a7146101355780638da5cb5b14610148578063abaddd7f14610168578063c6cdbe5e1461017d578063dc29868214610190578063f2fde38b146101b3578063f73e864b146101c6575b600080fd5b6100bc6101d9565b6040516100c991906115ec565b60405180910390f35b6100e56100e03660046116a8565b610267565b005b6100e56100f53660046116f7565b61051d565b61010d61010836600461173d565b6105d6565b6040516100c991906118b6565b6100e56108ac565b6100e56101303660046118c9565b6108c0565b6100e561014336600461173d565b610a74565b610150610a93565b6040516001600160a01b0390911681526020016100c9565b610170610aa2565b6040516100c99190611935565b6100bc61018b366004611997565b610e1b565b6101a361019e36600461173d565b610e46565b60405190151581526020016100c9565b6100e56101c13660046119b0565b610f41565b6100e56101d43660046119d9565b610fbf565b600180546101e690611a69565b80601f016020809104026020016040519081016040528092919081815260200182805461021290611a69565b801561025f5780601f106102345761010080835404028352916020019161025f565b820191906000526020600020905b81548152906001019060200180831161024257829003601f168201915b505050505081565b6000838152600460205260408120600881018054869386939290918490811061029257610292611a9d565b6000918252602090912060059091020180549091506001600160a01b031633146102cf576040516310df10bf60e21b815260040160405180910390fd5b6000878152600460205260408120600881018054919291899081106102f6576102f6611a9d565b906000526020600020906005020190508681600201908051906020019061031e9291906112fa565b504260048083019190915560008a815260209190915260409020825481546001600160a01b0319166001600160a01b0390911617815560018084015490820155600280840180548593928301919061037590611a69565b61038092919061137e565b50600382018160030190805461039590611a69565b6103a092919061137e565b5060048281015490820155600580830154908201805460ff191660ff90921615159190911790556006808301549082015560078083015490820155600880830180546103ef92840191906113f9565b50905050816005886040516104049190611ab3565b908152604051908190036020019020815481546001600160a01b0319166001600160a01b0390911617815560018083015490820155600280830180549183019161044d90611a69565b61045892919061137e565b50600382018160030190805461046d90611a69565b61047892919061137e565b5060048281015490820155600580830154908201805460ff191660ff90921615159190911790556006808301549082015560078083015490820155600880830180546104c792840191906113f9565b5050506003810154600482015460405133928c927f24b602c1dc276c94de75356e39c9b114d81bc4a0f83636a12fcc61a9544569f09261050a928e928e92611acf565b60405180910390a3505050505050505050565b61052561124b565b6000828152600460205260408120600881018054919291610544611a9d565b600091825260209182902060059091020180546001600160a01b03191633178155600884015460018201558451909250610586916002840191908601906112fa565b5042600382018190556008830154604051339287927f1ff8a0ea47ebe1f150876665e93f1c20b8cd96fd37cda28cb14e3f17a16f4d83926105c8928991611afb565b60405180910390a350505050565b6105de6114a7565b6005826040516105ee9190611ab3565b9081526040805191829003602090810183206101208401835280546001600160a01b03168452600181015491840191909152600281018054919284019161063490611a69565b80601f016020809104026020016040519081016040528092919081815260200182805461066090611a69565b80156106ad5780601f10610682576101008083540402835291602001916106ad565b820191906000526020600020905b81548152906001019060200180831161069057829003601f168201915b505050505081526020016003820180546106c690611a69565b80601f01602080910402602001604051908101604052809291908181526020018280546106f290611a69565b801561073f5780601f106107145761010080835404028352916020019161073f565b820191906000526020600020905b81548152906001019060200180831161072257829003601f168201915b50505050508152602001600482015481526020016005820160009054906101000a900460ff16151515158152602001600682015481526020016007820154815260200160088201805480602002602001604051908101604052809291908181526020016000905b8282101561089e5760008481526020908190206040805160a0810182526005860290920180546001600160a01b03168352600181015493830193909352600283018054929392918401916107f990611a69565b80601f016020809104026020016040519081016040528092919081815260200182805461082590611a69565b80156108725780601f1061084757610100808354040283529160200191610872565b820191906000526020600020905b81548152906001019060200180831161085557829003601f168201915b5050505050815260200160038201548152602001600482015481525050815260200190600101906107a6565b505050915250909392505050565b6108b461124b565b6108be60006112aa565b565b6108ce600280546001019055565b60006108d960025490565b600081815260046020908152604090912080546001600160a01b0319163317815560018101839055865192935091610919916002840191908801906112fa565b50835161092f90600383019060208701906112fa565b506005808201805460ff191660011790554260068301819055600783015560048201849055604051829190610965908790611ab3565b908152604051908190036020019020815481546001600160a01b0319166001600160a01b039091161781556001808301549082015560028083018054918301916109ae90611a69565b6109b992919061137e565b5060038201816003019080546109ce90611a69565b6109d992919061137e565b5060048281015490820155600580830154908201805460ff191660ff9092161515919091179055600680830154908201556007808301549082015560088083018054610a2892840191906113f9565b50506040513391507f5cf35cdd82b3f64bd006a20263bf79398bed734f7a24091966c410c161046a3d90610a659085908990899089904290611b24565b60405180910390a25050505050565b610a7c61124b565b8051610a8f9060019060208401906112fa565b5050565b6000546001600160a01b031690565b60606000610aaf60025490565b90506000816001600160401b03811115610acb57610acb611606565b604051908082528060200260200182016040528015610b0457816020015b610af16114a7565b815260200190600190039081610ae95790505b50905060005b82811015610e14576000610b1f826001611b7a565b60008181526004602090815260409182902082516101208101845281546001600160a01b031681526001820154928101929092526002810180549495509093919284929084019190610b7090611a69565b80601f0160208091040260200160405190810160405280929190818152602001828054610b9c90611a69565b8015610be95780601f10610bbe57610100808354040283529160200191610be9565b820191906000526020600020905b815481529060010190602001808311610bcc57829003601f168201915b50505050508152602001600382018054610c0290611a69565b80601f0160208091040260200160405190810160405280929190818152602001828054610c2e90611a69565b8015610c7b5780601f10610c5057610100808354040283529160200191610c7b565b820191906000526020600020905b815481529060010190602001808311610c5e57829003601f168201915b50505050508152602001600482015481526020016005820160009054906101000a900460ff16151515158152602001600682015481526020016007820154815260200160088201805480602002602001604051908101604052809291908181526020016000905b82821015610dda5760008481526020908190206040805160a0810182526005860290920180546001600160a01b0316835260018101549383019390935260028301805492939291840191610d3590611a69565b80601f0160208091040260200160405190810160405280929190818152602001828054610d6190611a69565b8015610dae5780601f10610d8357610100808354040283529160200191610dae565b820191906000526020600020905b815481529060010190602001808311610d9157829003601f168201915b505050505081526020016003820154815260200160048201548152505081526020019060010190610ce2565b5050505081525050848481518110610df457610df4611a9d565b602002602001018190525050508080610e0c90611b92565b915050610b0a565b5092915050565b60038181548110610e2b57600080fd5b9060005260206000200160009150905080546101e690611a69565b6000610e5061124b565b6000805b600354811015610eec5783604051602001610e6f9190611ab3565b6040516020818303038152906040528051906020012060038281548110610e9857610e98611a9d565b90600052602060002001604051602001610eb29190611bab565b6040516020818303038152906040528051906020012003610eda576001915060009250610eec565b80610ee481611b92565b915050610e54565b5080610f3b57600380546001810182556000919091528351610f35917fc2575a0e9e593c00f959f8c92f12db2869c3395a3b0502d05e2516446f71f85b019060208601906112fa565b50600191505b50919050565b610f4961124b565b6001600160a01b038116610fb35760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b60648201526084015b60405180910390fd5b610fbc816112aa565b50565b600085815260046020526040902080548691906001600160a01b03163314610ffa5760405163a5e26b0f60e01b815260040160405180910390fd5b6000878152600460209081526040909120875190916110209160028401918a01906112fa565b50855161103690600383019060208901906112fa565b5060058101805485151560ff199091161790554260078201556000888152600460205260409020815481546001600160a01b0319166001600160a01b0390911617815560018083015490820155600280830180548493928301919061109a90611a69565b6110a592919061137e565b5060038201816003019080546110ba90611a69565b6110c592919061137e565b5060048281015490820155600580830154908201805460ff191660ff909216151591909117905560068083015490820155600780830154908201556008808301805461111492840191906113f9565b50905050806005876040516111299190611ab3565b908152604051908190036020019020815481546001600160a01b0319166001600160a01b0390911617815560018083015490820155600280830180549183019161117290611a69565b61117d92919061137e565b50600382018160030190805461119290611a69565b61119d92919061137e565b5060048281015490820155600580830154908201805460ff191660ff90921615159190911790556006808301549082015560078083015490820155600880830180546111ec92840191906113f9565b50505060018101546006820154600783015460405133937fe2337982860926fbfe2cc8754182c5623c713abeace29eb28b0ff9557369ef9a936112399391928d928d928d928d9290611c46565b60405180910390a25050505050505050565b33611254610a93565b6001600160a01b0316146108be5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610faa565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b82805461130690611a69565b90600052602060002090601f016020900481019282611328576000855561136e565b82601f1061134157805160ff191683800117855561136e565b8280016001018555821561136e579182015b8281111561136e578251825591602001919060010190611353565b5061137a9291506114fe565b5090565b82805461138a90611a69565b90600052602060002090601f0160209004810192826113ac576000855561136e565b82601f106113bd578054855561136e565b8280016001018555821561136e57600052602060002091601f016020900482015b8281111561136e5782548255916001019190600101906113de565b82805482825590600052602060002090600502810192821561149b5760005260206000209160050282015b8281111561149b57825482546001600160a01b0319166001600160a01b039091161782556001808401549083015560028084018054859285929083019161146a90611a69565b61147592919061137e565b506003820154816003015560048201548160040155505091600501919060050190611424565b5061137a929150611513565b60405180610120016040528060006001600160a01b03168152602001600081526020016060815260200160608152602001600081526020016000151581526020016000815260200160008152602001606081525090565b5b8082111561137a57600081556001016114ff565b8082111561137a5780546001600160a01b031916815560006001820181905561153f6002830182611556565b506000600382018190556004820155600501611513565b50805461156290611a69565b6000825580601f10611572575050565b601f016020900490600052602060002090810190610fbc91906114fe565b60005b838110156115ab578181015183820152602001611593565b838111156115ba576000848401525b50505050565b600081518084526115d8816020860160208601611590565b601f01601f19169290920160200192915050565b6020815260006115ff60208301846115c0565b9392505050565b634e487b7160e01b600052604160045260246000fd5b600082601f83011261162d57600080fd5b81356001600160401b038082111561164757611647611606565b604051601f8301601f19908116603f0116810190828211818310171561166f5761166f611606565b8160405283815286602085880101111561168857600080fd5b836020870160208301376000602085830101528094505050505092915050565b6000806000606084860312156116bd57600080fd5b833592506020840135915060408401356001600160401b038111156116e157600080fd5b6116ed8682870161161c565b9150509250925092565b6000806040838503121561170a57600080fd5b8235915060208301356001600160401b0381111561172757600080fd5b6117338582860161161c565b9150509250929050565b60006020828403121561174f57600080fd5b81356001600160401b0381111561176557600080fd5b6117718482850161161c565b949350505050565b600082825180855260208086019550808260051b84010181860160005b8481101561180557858303601f19018952815180516001600160a01b03168452848101518585015260408082015160a082870181905291906117da838801826115c0565b6060858101519089015260809485015194909701939093525050509783019790830190600101611796565b5090979650505050505050565b80516001600160a01b031682526000610120602083015160208501526040830151816040860152611845828601826115c0565b9150506060830151848203606086015261185f82826115c0565b9150506080830151608085015260a083015161187f60a086018215159052565b5060c083015160c085015260e083015160e085015261010080840151858303828701526118ac8382611779565b9695505050505050565b6020815260006115ff6020830184611812565b6000806000606084860312156118de57600080fd5b83356001600160401b03808211156118f557600080fd5b6119018783880161161c565b9450602086013591508082111561191757600080fd5b506119248682870161161c565b925050604084013590509250925092565b6000602080830181845280855180835260408601915060408160051b870101925083870160005b8281101561198a57603f19888603018452611978858351611812565b9450928501929085019060010161195c565b5092979650505050505050565b6000602082840312156119a957600080fd5b5035919050565b6000602082840312156119c257600080fd5b81356001600160a01b03811681146115ff57600080fd5b600080600080600060a086880312156119f157600080fd5b8535945060208601356001600160401b0380821115611a0f57600080fd5b611a1b89838a0161161c565b95506040880135915080821115611a3157600080fd5b50611a3e8882890161161c565b9350506060860135915060808601358015158114611a5b57600080fd5b809150509295509295909350565b600181811c90821680611a7d57607f821691505b602082108103610f3b57634e487b7160e01b600052602260045260246000fd5b634e487b7160e01b600052603260045260246000fd5b60008251611ac5818460208701611590565b9190910192915050565b848152608060208201526000611ae860808301866115c0565b6040830194909452506060015292915050565b838152606060208201526000611b1460608301856115c0565b9050826040830152949350505050565b85815260a060208201526000611b3d60a08301876115c0565b8281036040840152611b4f81876115c0565b60608401959095525050608001529392505050565b634e487b7160e01b600052601160045260246000fd5b60008219821115611b8d57611b8d611b64565b500190565b600060018201611ba457611ba4611b64565b5060010190565b600080835481600182811c915080831680611bc757607f831692505b60208084108203611be657634e487b7160e01b86526022600452602486fd5b818015611bfa5760018114611c0b57611c38565b60ff19861689528489019650611c38565b60008a81526020902060005b86811015611c305781548b820152908501908301611c17565b505084890196505b509498975050505050505050565b87815260e060208201526000611c5f60e08301896115c0565b8281036040840152611c7181896115c0565b60608401979097525050921515608084015260a083019190915260c090910152939250505056fea2646970667358221220c2c247d7a45c3961c14591292a81f9214e9165c462ad1cf1c55f67d48c0ab5a664736f6c634300080e0033";

type CommunityConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: CommunityConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Community__factory extends ContractFactory {
  constructor(...args: CommunityConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _name: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<Community> {
    return super.deploy(_name, overrides || {}) as Promise<Community>;
  }
  override getDeployTransaction(
    _name: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_name, overrides || {});
  }
  override attach(address: string): Community {
    return super.attach(address) as Community;
  }
  override connect(signer: Signer): Community__factory {
    return super.connect(signer) as Community__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): CommunityInterface {
    return new utils.Interface(_abi) as CommunityInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Community {
    return new Contract(address, _abi, signerOrProvider) as Community;
  }
}