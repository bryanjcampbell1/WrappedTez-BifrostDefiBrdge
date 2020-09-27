import React, {useEffect, useState} from 'react';
import './App.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Burn from './Burn';
import Mint from './Mint';
import Accounts from "./Accounts";
import getWeb3 from "./getWeb3";
import txzWallet from "./txzWallet";

const App = () => {

  const [ethWallet, setEthWallet] = useState();
  const [tezosWallet, setTxzWallet] = useState();
  
  useEffect(() => {
    loadWallets();
  });

  const loadWallets = async() => {

    try {
      // console.log("api key" + process.env.REACT_APP_API_KEY);
      // Get network provider and web3 instance.
      const web3 = await getWeb3();
  
      // Use web3 to get the user's accounts.
      const accounts = await web3.web3.eth.getAccounts();
      // const raghuAccounts = process.env.REACT_APP_ACCOUNT;
      
      console.log(accounts, "accounts");
      setEthWallet(web3);

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      // console.error(error);
    }

    try {
      const wallet = await txzWallet()
      const tezos = wallet.toTezos();
      const accountPkh = await tezos.wallet.pkh();
      const accountBalance = await tezos.tz.getBalance(accountPkh);
      console.info(`address: ${accountPkh}, balance: ${accountBalance}`);
      setTxzWallet(tezos);
    } catch (err) {
       // Catch any errors for any of the above operations.
       alert("Thanos Wallet not installed");
      // console.error(error);
    }

  }

  return (
    <div className="App" style={{backgroundColor:'#fff1c1'}}>
        <div style={{height:20, backgroundColor:'#fe5f55'}}>

        </div>
        <Container style={{marginTop: 20}}>
            <Accounts/>
            <Row style={{marginTop: 20}}>
                <Col sm={1} md={2} lg={3}></Col>
                <Col>
                    <p>Mint bXTZ Tokens</p>
                    <Mint ethWallet={ethWallet} txzWallet={tezosWallet}/>
                    <p style={{marginTop:100}}>Burn bXTZ Tokens</p>
                    <Burn/>
                </Col>
                <Col sm={1} md={2} lg={3}></Col>
            </Row>
        </Container>
    </div>
  );
}

export default App;
