const ABI = [
    {
    "inputs": [
    {
    "internalType": "address",
    "name": "tokenAddress",
    "type": "address"
    }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
    },
    {
    "anonymous": false,
    "inputs": [
    {
    "indexed": true,
    "internalType": "bytes32",
    "name": "id",
    "type": "bytes32"
    }
    ],
    "name": "ChainlinkCancelled",
    "type": "event"
    },
    {
    "anonymous": false,
    "inputs": [
    {
    "indexed": true,
    "internalType": "bytes32",
    "name": "id",
    "type": "bytes32"
    }
    ],
    "name": "ChainlinkFulfilled",
    "type": "event"
    },
    {
    "anonymous": false,
    "inputs": [
    {
    "indexed": true,
    "internalType": "bytes32",
    "name": "id",
    "type": "bytes32"
    }
    ],
    "name": "ChainlinkRequested",
    "type": "event"
    },
    {
    "anonymous": false,
    "inputs": [
    {
    "indexed": true,
    "internalType": "string",
    "name": "",
    "type": "string"
    },
    {
    "indexed": true,
    "internalType": "address",
    "name": "",
    "type": "address"
    },
    {
    "indexed": false,
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
    }
    ],
    "name": "TokenBurned",
    "type": "event"
    },
    {
    "inputs": [
    {
    "internalType": "bytes32",
    "name": "_requestId",
    "type": "bytes32"
    },
    {
    "internalType": "uint256",
    "name": "_value",
    "type": "uint256"
    }
    ],
    "name": "fulfill",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
    },
    {
    "inputs": [
    {
    "internalType": "string",
    "name": "tezosAddress",
    "type": "string"
    },
    {
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
    }
    ],
    "name": "requestBurnToken",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
    },
    {
    "inputs": [],
    "name": "requestIfAddressWhitelisted",
    "outputs": [
    {
    "internalType": "bytes32",
    "name": "",
    "type": "bytes32"
    }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
    },
    {
    "inputs": [],
    "name": "value",
    "outputs": [
    {
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
    }
    ],
    "stateMutability": "view",
    "type": "function"
    }
    ]

    export default ABI;
    