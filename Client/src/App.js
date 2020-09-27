import React from 'react';
import './App.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Burn from './Burn';
import Mint from './Mint';
import getWeb3 from "./getWeb3";

class App extends React.Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();


      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };


  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
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
            </div>
            <Row style={{marginTop: 40}}>
                <Col sm={1} md={2} lg={3}></Col>
                <Col>
                    <p style={labels} >Mint bXTZ Tokens</p>
                    <Mint web3={this.state.web3} accounts={this.state.accounts}/>
                    <p style={labels}>Burn bXTZ Tokens</p>
                    <Burn web3={this.state.web3} accounts={this.state.accounts}/>
                </Col>
                <Col sm={1} md={2} lg={3}></Col>
            </Row>
        </Container>
    </div>
    );
  }
}

/*
function App() {
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
                    <Mint/>
                    <p style={{marginTop:100}}>Burn bXTZ Tokens</p>
                    <Burn/>
                </Col>
                <Col sm={1} md={2} lg={3}></Col>
            </Row>
        </Container>
    </div>
  );
}
*/

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

export default App;
