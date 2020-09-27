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

  const labels = {
    marginTop:50,
    fontSize: 20,
    color: '#FF6961',
    fontWeight: 900
  }
  
  const topTitle = {
    marginTop:50,
    fontSize: 70,
    color: '#FF6961',
    fontWeight: 900
  }
  
  const subTitle = {
    marginTop:20,
    fontSize: 22,
    color: '#16a2b9',
    fontWeight: 900
  }
  const subTitle2 = {
    marginTop:20,
    fontSize: 20,
    color: '#16a2b9',
    fontWeight: 900
  }

  return (
    <div className="App" style={{backgroundColor:'#fff1c1'}}>
        <div style={{height:20, backgroundColor:'#fe5f55'}}>

        </div>
        <Container style={{marginTop: 20}}>
            
    <p style={topTitle} >Bifrost Baking Token</p>
    <p style={subTitle} >Cross-Chain Wrapped Tokens Between Tezos and Ethereum </p>
    <div style={{marginTop:80}}>
      <p style={subTitle2} >The value of bXTZ grows via Tezos staking rewards!</p>
      <p style={subTitle2} >Current Ratio    1 bXTZ = 1.5 XTZ</p>
      <p style={subTitle2} >bTXZ token address: <span style={{border:'2px dashed #fe5f55', padding:'5px'}}>0x31678F57E2F9A416dED24a5684f5eFcce3c69997</span></p>
    </div>
            <Row style={{marginTop: 40}}>
                <Col sm={1} md={2} lg={3}></Col>
                <Col>
                    <p>Mint bXTZ Tokens</p>
                    <Mint ethWallet={ethWallet} txzWallet={tezosWallet}/>
                    <p style={{marginTop:100}}>Burn bXTZ Tokens</p>
                    <Burn ethWallet={ethWallet} txzWallet={tezosWallet}/>
                </Col>
                <Col sm={1} md={2} lg={3}></Col>
            </Row>
        </Container>
    </div>

  );
}

export default App;
