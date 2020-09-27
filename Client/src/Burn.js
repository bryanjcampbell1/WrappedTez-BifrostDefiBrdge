import React, { useState } from 'react';
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { ThanosWallet } from "@thanos-wallet/dapp";
import getWeb3 from "./getWeb3";

const abi = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "symbol",
				"type": "string"
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
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "burn",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "burnFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "subtractedValue",
				"type": "uint256"
			}
		],
		"name": "decreaseAllowance",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "grantRole",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "addedValue",
				"type": "uint256"
			}
		],
		"name": "increaseAllowance",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "mint",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "pause",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "Paused",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "renounceRole",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "revokeRole",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "previousAdminRole",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "newAdminRole",
				"type": "bytes32"
			}
		],
		"name": "RoleAdminChanged",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "RoleGranted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "RoleRevoked",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "unpause",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "Unpaused",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "DEFAULT_ADMIN_ROLE",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			}
		],
		"name": "getRoleAdmin",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "getRoleMember",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			}
		],
		"name": "getRoleMemberCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "hasRole",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "MINTER_ROLE",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "paused",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "PAUSER_ROLE",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
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
];

const contractAddress = '0x7d431D6863F47A292996d0890810De9Bf2d4c52D';

class Burn extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            step: 1,
            whitelistedEthAddress: '',
            depositAmount: 0,
            tezosAddress:'Unlock Wallet',
            ethereumAddress:'Unlock Wallet',
            web3: null, 
            accounts: null,
    
        }
        this.loadWallet();
    }

    async loadWallet(){

        try {
            const available = await ThanosWallet.isAvailable();
            if (!available) {
            throw new Error("Thanos Wallet not installed");
            }
    
            const wallet = new ThanosWallet("Bifrost Baker");
            await wallet.connect("carthagenet");
            const tezos = wallet.toTezos();
    
            const accountPkh = await tezos.wallet.pkh();
            const accountBalance = await tezos.tz.getBalance(accountPkh);

            this.setState({tezosAddress: accountPkh})
    
            console.info(`address: ${accountPkh}, balance: ${accountBalance}`);
    
            
    
        } catch (err) {
            console.error(err);
        }

    }

    async burn(){

        var myContract = new this.props.web3.eth.Contract(abi, contractAddress);

       // await myContract.methods.burn( 8 ).send({from:`${this.props.accounts[0]}` });
        await myContract.methods.burn( `${1000000000000000000*this.state.depositAmount}` ).send({from:`${this.props.accounts[0]}` });

        this.setState({step:2});
    }

    async approve(){


        try {
            const available = await ThanosWallet.isAvailable();
            if (!available) {
            throw new Error("Thanos Wallet not installed");
            }
    
            const wallet = new ThanosWallet("Bifrost Baker");
            await wallet.connect("carthagenet");
            const tezos = wallet.toTezos();
    
            const accountPkh = await tezos.wallet.pkh();
            const accountBalance = await tezos.tz.getBalance(accountPkh);
    
            console.info(`address: ${accountPkh}, balance: ${accountBalance}`);
    
            const bifrost = await tezos.wallet.at(
                "KT1S94kmkfLx5whkDSk5QaJ539z32rBLqxra"
                );   

    
            const operation = await bifrost.methods.request_fortune(1,10).send();
            await operation.confirmation();
    
        } catch (err) {
            console.error(err);
        }

        this.setState({step:3});
    }

    async withdraw(){

        try {
            const available = await ThanosWallet.isAvailable();
            if (!available) {
            throw new Error("Thanos Wallet not installed");
            }
    
            const wallet = new ThanosWallet("Bifrost Baker");
            await wallet.connect("carthagenet");
            const tezos = wallet.toTezos();
    
            const accountPkh = await tezos.wallet.pkh();
            const accountBalance = await tezos.tz.getBalance(accountPkh);
    
            console.info(`address: ${accountPkh}, balance: ${accountBalance}`);
    
            const bifrost = await tezos.wallet.at(
                "KT1S94kmkfLx5whkDSk5QaJ539z32rBLqxra"
                );   
    
            const operation = await bifrost.methods.withdraw().send();
            await operation.confirmation();
    
        } catch (err) {
            console.error(err);
        }


        this.setState({step:1});
    }

    

    render(){
        return(
            <div style={box1}> 
                <Form>
                    <Form.Group controlId="formTezosAddress">
                        <Form.Label>Ethereum Burn Address</Form.Label>
                        <Form.Control  placeholder={this.props.accounts[0]} readOnly/>
                    </Form.Group>

                    <Form.Group controlId="formXTZAmount">
                        <Form.Label>Amount of bXTZ</Form.Label>
                        <Form.Control  placeholder="0" onChange={(e)=> this.setState({depositAmount: e.target.value})}/>
                        <Form.Text className="text-muted">
                            Returns {this.state.depositAmount*1.5} XTZ on Tezos
                        </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formEthAddress">
                        <Form.Label>Tezos Address Receiving XTZ</Form.Label>
                        <Form.Control  placeholder={this.state.tezosAddress} readOnly/>
                    </Form.Group>
                </Form>
                <div style={{width:'100%', marginTop:30}}>
                
                    <div>
                        {(this.state.step ===1) ?
                            <Button onClick={() => this.burn()} variant="info"  size="lg" style={{width:'50%'}}>
                                Burn bXTZ
                            </Button>
                            :
                            <Button variant="outline-light"  size="lg" style={{width:'50%'}} disabled>
                                Burn bXTZ
                            </Button>
                        }
                    </div>
                    <div style={{marginTop: 20}}>
                        {(this.state.step ===2) ?
                            <Button onClick={() => this.approve()} variant="info"  size="lg" style={{width:'50%'}}>
                                Approve
                            </Button>
                            :
                            <Button variant="outline-light"  size="lg" style={{width:'50%'}} disabled>
                                Approve
                            </Button>
                        }
                    </div>
                    <div style={{marginTop: 20}}>
                        {(this.state.step ===3) ?
                            <Button onClick={() => this.withdraw()}  variant="info"  size="lg" style={{width:'50%'}}>
                                Withdraw XTZ
                            </Button>
                            :
                            <Button variant="outline-light"  size="lg" style={{width:'50%'}} disabled>
                                Withdraw XTZ
                            </Button>
                        }
                    </div>
                
                </div>
            </div>
        )
    }
}

const box1 = {
    width:'100%',
    height:600,
    backgroundColor:'#FF6961',
    borderRadius:50,
    padding:30

}

//backgroundColor:'#FF6961',
//backgroundColor:'#61F7FF',




export default Burn;