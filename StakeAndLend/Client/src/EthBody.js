import React, { useState } from 'react';
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function EthBody() {

    const [step, setStep] = useState('start')

    return (

        <div style={{padding:20}}>
            {
                (step === 'start')?
                    <div style={buttonGroup}>
                        <Button onClick={() => setStep('Mint') } variant="info" style={buttonStyle} size="lg">Mint bXTZ</Button>
                        <Button onClick={() => setStep('Burn') } variant="info" style={buttonStyle} size="lg">Burn bXTZ</Button>
                    </div>
                    :
                    <div></div>
            }
            {
                (step === 'Mint')?
                    <div>
                        <Form>

                            <Form.Group controlId="formTezosAddress">
                                <Form.Label>Minting Address</Form.Label>
                                <Form.Control  placeholder="Unlock Ethereum Wallet" />
                            </Form.Group>
                            <p>XTZ needs to be deposited in Tezos contract in order to approve minting of bXTZ</p>
                            <div style={buttonGroup}>

                                <Button  variant="info" style={buttonStyle} size="lg">Check Approval</Button>
                                <div style={{display:'flex'}}>
                                    <Button onClick={() => setStep('start') } variant="info" style={buttonStyle} size="lg">Cancel</Button>
                                    <Button onClick={() => setStep('MintResult') } variant="info" style={buttonStyle} size="lg">Mint</Button>
                                </div>
                            </div>


                        </Form>

                    </div>
                    :
                    <div></div>
            }

            {
                (step === 'MintResult')?
                    <div>
                        <p> Minted 6 bXTZ to 0xsdtbatbetbtbq </p>

                        <p> Transaction Hash </p>
                        <p>oodxfYYvYQL4gwpiEp...</p>

                        <Button onClick={() => setStep('start') } variant="primary" type="submit">
                            Done
                        </Button>

                    </div>
                    :
                    <div></div>
            }

            {
                (step === 'Burn')?
                    <div>
                        <Form>
                            <Form.Group controlId="formTezosAddress">
                                <Form.Label>Ethereum Address</Form.Label>
                                <Form.Control  placeholder="0xsatbat35t46hwt........" />
                                <Form.Text className="text-muted">
                                    This account is used to burn bXTZ tokens
                                </Form.Text>
                            </Form.Group>
                            <Form.Group controlId="formXTZAmount">
                                <Form.Label>bXTZ Burn Amount</Form.Label>
                                <Form.Control  placeholder="0" />
                                <Form.Text className="text-muted">
                                    This deposit approves 4 bXTZ to be burned
                                </Form.Text>
                            </Form.Group>

                            <Form.Group controlId="formTezosAddress">
                                <Form.Label>Withdrawing Tezos Address</Form.Label>
                                <Form.Control  placeholder="tz1..............." />
                            </Form.Group>


                            <div>
                                <Button onClick={() => setStep('start') } variant="primary" type="submit">
                                    Cancel
                                </Button>
                                <Button onClick={() => setStep('ConfirmBurn') } variant="primary" type="submit">
                                    Submit
                                </Button>
                            </div>
                        </Form>

                    </div>
                    :
                    <div></div>
            }

            {
                (step === 'ConfirmBurn')?
                    <div>
                        <div>
                            <p>Ethereum Address: 0xABSADQERQETG</p>
                            <p>Withdrawing Tezos Address: tz1aafgadrgadgadg</p>
                            <p>Burning: 4 bXTZ</p>
                            <p>Approving 6.2 XTZ to be withdrawn</p>

                            <Button onClick={() => setStep('Burn') } variant="primary" type="submit">
                                Back
                            </Button>
                            <Button onClick={() => setStep('BurnResult') } variant="primary" type="submit">
                                Submit
                            </Button>
                        </div>

                    </div>
                    :
                    <div></div>
            }

            {
                (step === 'BurnResult')?
                    <div>

                        <p>6 bXTZ Burned</p>
                        <p>Tezos address tz1adtbwrtb approved for withdrawal </p>

                        <p> Transaction Hash </p>
                        <p>oodxfYYvYQL4gwpiEp...</p>

                        <Button onClick={() => setStep('start') } variant="primary" type="submit">
                            Done
                        </Button>


                    </div>
                    :
                    <div></div>
            }

        </div>

    );
}

const buttonGroup =
    {   display: 'flex',
        flexDirection:'column',
        alignItems:'center'

    } ;

const buttonStyle =
    {   width:'70%',
        marginTop:80
    } ;





export default EthBody;