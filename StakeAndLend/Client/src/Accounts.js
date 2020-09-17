import React from 'react';
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";

function Accounts() {
    return (
        <div>
            <Row>
                <Col sm={4} md={9} lg={10}></Col>
                <Col>
                    <Row>
                        <Button variant="info" style={{width:150}}>Tezos Login</Button>
                    </Row>
                    <Row style={{marginTop:10}}>
                        <Button variant="info" style={{width:150}}>Ethereum Login</Button>
                    </Row>
                </Col>
            </Row>
        </div>
    );
}

export default Accounts;