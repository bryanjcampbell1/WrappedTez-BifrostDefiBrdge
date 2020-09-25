import React, { useState } from 'react';
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { ThanosWallet } from "@thanos-wallet/dapp";
import getWeb3 from "./getWeb3";


class Mint extends React.Component {

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

        try {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();
            const accounts = await web3.eth.getAccounts();
            this.setState({ web3: web3, accounts: accounts, ethereumAddress: accounts[0] });
          
        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
              `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
          }






    }

    async callDepositEntryPoint(){

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
    
            const operation = await bifrost.methods.deposit(this.state.whitelistedEthAddress).send({ amount: this.state.depositAmount });
            await operation.confirmation();
    
        } catch (err) {
            console.error(err);
        }

        this.setState({step: 2})
    }

    render(){
        return(
            <div style={box1}> 
                <Form>
                    <Form.Group controlId="formTezosAddress">
                        <Form.Label>Tezos Deposit Address</Form.Label>
                        <Form.Control  placeholder={this.state.tezosAddress} readOnly/>
                    </Form.Group>

                    <Form.Group controlId="formXTZAmount">
                        <Form.Label>Amount of XTZ</Form.Label>
                        <Form.Control  placeholder="0" onChange={(e)=> this.setState({depositAmount: e.target.value})}/>
                        <Form.Text className="text-muted">
                            Creates {this.state.depositAmount/1.5} bXTZ on Ethereum
                        </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formEthAddress">
                        <Form.Label>Ethereum Address Receiving bXTZ</Form.Label>
                        <Form.Control  placeholder={this.state.ethereumAddress} readOnly/>
                    </Form.Group>
                </Form>
                {(this.state.step ===1) ?
                    <div style={{width:'100%', marginTop:30}}>
                        <div>
                            <Button onClick={() => this.callDepositEntryPoint()} variant="info"  size="lg" style={{width:'50%'}}>
                                Deposit XTZ
                            </Button>
                        </div>
                        <div style={{marginTop: 20}}>
                            <Button  variant="outline-light" size="lg" style={{width:'50%'}} disabled>
                                Mint bXTZ
                            </Button>
                        </div>

                    </div>
                    :
                    <div style={{width:'100%', marginTop:30}}>
                        <div>
                            <Button variant="outline-light" size="lg" style={{width:'50%'}} disabled>
                                Deposit XTZ
                            </Button>
                        </div>
                        <div style={{marginTop: 20}}>
                            <Button  variant="info" size="lg" style={{width:'50%'}} >
                                Mint bXTZ
                            </Button>
                        </div>

                    </div>
                }
                
            </div>
        )
    }
}

const box1 = {
    width:'100%',
    height:500,
    backgroundColor:'#FF6961',
    borderRadius:50,
    padding:30

}

//backgroundColor:'#FF6961',
//backgroundColor:'#61F7FF',




export default Mint;