import React from 'react';
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";

import { ThanosWallet } from "@thanos-wallet/dapp";
import getWeb3 from "./getWeb3";

    


class Accounts extends React.Component {
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
        
    }

 
    async unlockTezosWallet(){
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
    async unlockEthWallet(){



        console.log('yoyoy');
        try {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();
            const accounts = await web3.eth.getAccounts();
            console.log(accounts[0])
            this.setState({ web3: web3, accounts: accounts, ethereumAddress: accounts[0] });
          
        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
              `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
          }

    }
    render(){
        return (
            <div>
                <Row>
                    <Col sm={4} md={9} lg={10}></Col>
                    <Col>
                        <Row>
                            <Button onClick={() => this.unlockTezosWallet()} variant="info" style={{width:150}}>Tezos Login</Button>
                        </Row>
                        <Row style={{marginTop:10}}>
                            <Button onClick={() => this.unlockEthWallet()}variant="info" style={{width:150}}>Ethereum Login</Button>
                        </Row>
                    </Col>
                </Row>
            </div>
        );
    }
    
}

export default Accounts;