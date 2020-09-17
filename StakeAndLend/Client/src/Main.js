import React, { useState } from 'react';

import EthBody from "./EthBody";
import TezBody from "./TezBody";
import Button from "react-bootstrap/Button";

function Main() {

    const [TSelected, setTSelected] = useState(true);

    return (

        <div>
            <div style={(TSelected)? tabs_T : tabs_E}>
                <div style={(TSelected)? tezTab_s : tezTab} onClick={() => setTSelected(true)}>
                    <p>Tezos</p>
                </div>
                <div style={(TSelected)? ethTab : ethTab_s} onClick={() => setTSelected(false)}>
                    <p>Ethereum</p>
                </div>
            </div>
            {
                (TSelected)?
                <div style={body_T}>
                    <TezBody/>
                </div>
                :
                <div style={body_E}>
                    <EthBody/>
                </div>

            }

        </div>

    );
}

const tezColor = 'red';
const ethColor = 'purple';

const tabs_T = {
    width:'100%',
    height:50,
    backgroundColor: ethColor,
    borderTopRightRadius:50,
    borderTopLeftRadius:50,
    display:'flex',
}

const tabs_E = {
    width:'100%',
    height:50,
    backgroundColor:tezColor,
    borderTopRightRadius:50,
    borderTopLeftRadius:50,
    display:'flex',
}

const ethTab = {
    width:'45%',
    height:55,
    backgroundColor:ethColor,
    borderTopRightRadius:50,
    borderTopLeftRadius:50,
}

const tezTab = {
    width:'45%',
    height:55,
    backgroundColor:tezColor,
    borderTopRightRadius:50,
    borderTopLeftRadius:50,
}

const ethTab_s = {
    width:'55%',
    height:55,
    backgroundColor:ethColor,
    borderTopRightRadius:50,
    borderTopLeftRadius:50,
}

const tezTab_s = {
    width:'55%',
    height:60,
    backgroundColor:tezColor,
    borderTopRightRadius:50,
    borderTopLeftRadius:50,
}
const body_T = {
    width:'100%',
    height:450,
    backgroundColor:tezColor,
    borderBottomRightRadius:50,
    borderBottomLeftRadius:50
}

const body_E = {
    width:'100%',
    height:450,
    backgroundColor:ethColor,
    borderBottomRightRadius:50,
    borderBottomLeftRadius:50
}




export default Main;