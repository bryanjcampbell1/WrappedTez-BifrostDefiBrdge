import React, { useState } from 'react';
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { ThanosWallet } from "@thanos-wallet/dapp";
import getWeb3 from "./getWeb3";



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

    async burn(){
        this.setState({step:2});
    }

    async approve(){
        this.setState({step:3});
    }

    async withdraw(){
        this.setState({step:1});
    }

    

    render(){
        return(
            <div style={box1}> 
                <Form>
                    <Form.Group controlId="formTezosAddress">
                        <Form.Label>Ethereum Burn Address</Form.Label>
                        <Form.Control  placeholder={this.state.ethereumAddress} readOnly/>
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