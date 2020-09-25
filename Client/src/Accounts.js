import React from 'react';
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";

import { ThanosWallet } from "@thanos-wallet/dapp";
import getWeb3 from "./getWeb3";


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

    const unlockEthWallet = () =>
    (async () => {
    
        try {
          // Get network provider and web3 instance.
          const web3 = await getWeb3();
    
          // Use web3 to get the user's accounts.
          const accounts = await web3.eth.getAccounts();
    
        } catch (error) {
          // Catch any errors for any of the above operations.
          alert(
            `Failed to load web3, accounts, or contract. Check console for details.`,
          );
          console.error(error);
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
                        <Button onClick={unlockEthWallet}variant="info" style={{width:150}}>Ethereum Login</Button>
                    </Row>
                </Col>
            </Row>
        </div>
    );
}

export default Accounts;