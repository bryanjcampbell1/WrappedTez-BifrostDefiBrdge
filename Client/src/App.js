import React from 'react';
import './App.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Burn from './Burn';
import Mint from './Mint';
import Accounts from "./Accounts";


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

export default App;
