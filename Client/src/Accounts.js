import React from 'react';
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";

import { ThanosWallet } from "@thanos-wallet/dapp";

const unlockTezosWallet = () =>
    (async () => {
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

        const operation = await bifrost.methods.deposit("0x830c5D312D507DdB066192d34dD6441737e127C8").send({ amount: 50 });
        await operation.confirmation();

    } catch (err) {
        console.error(err);
    }

    })();


    


function Accounts() {
    return (
        <div>
            <Row>
                <Col sm={4} md={9} lg={10}></Col>
                <Col>
                    <Row>
                        <Button onClick={unlockTezosWallet} variant="info" style={{width:150}}>Tezos Login</Button>
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