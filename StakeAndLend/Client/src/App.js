import React from 'react';
import './App.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Main from './Main';
import Accounts from "./Accounts";

function App() {
  return (
    <div className="App" style={{backgroundColor:'#fff1c1'}}>
        <div style={{height:66, backgroundColor:'#fe5f55'}}>

        </div>


        <Container style={{marginTop: 20}}>
            <Accounts/>
            <Row style={{marginTop: 20}}>
                <Col sm={1} md={2} lg={3}></Col>
                <Col>
                    <Main/>
                </Col>
                <Col sm={1} md={2} lg={3}></Col>
            </Row>
        </Container>
    </div>
  );
}

export default App;
