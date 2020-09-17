import React, { useState } from 'react';
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function TezBody() {

    const [step, setStep] = useState('start')

    return (

        <div style={{padding:20}}>
            {
                (step === 'start')?
                    <div style={buttonGroup}>
                        <Button onClick={() => setStep('Deposit') } variant="info" style={buttonStyle} size="lg">Deposit XTZ</Button>
                        <Button onClick={() => setStep('Withdraw') } variant="info" style={buttonStyle} size="lg">Withdraw XTZ</Button>
                    </div>
                :
                    <div></div>
            }
            {
                (step === 'Deposit')?
                    <div>
                        <Form>
                            <Form.Group controlId="formTezosAddress">
                                <Form.Label>Tezos Address</Form.Label>
                                <Form.Control  placeholder="tz1..............." />
                            </Form.Group>

                            <Form.Group controlId="formXTZAmount">
                                <Form.Label>XTZ Deposit Amount</Form.Label>
                                <Form.Control  placeholder="0" />
                                <Form.Text className="text-muted">
                                    This deposit approves 4 BXTZ to be minted on Ethereum
                                </Form.Text>
                                <Form.Text className="text-muted">
                                    1 BXTZ = 1.5 XTZ and grows in value as XTZ pool is Baked
                                </Form.Text>
                            </Form.Group>

                            <Form.Group controlId="formEthAddress">
                                <Form.Label>Minting Ethereum Address </Form.Label>
                                <Form.Control  placeholder="0xABC123..." />
                                <Form.Text className="text-muted">
                                    The Ethereum address above will be whitelisted to mint 4 BXTZ
                                </Form.Text>
                            </Form.Group>

                            <div>
                                <Button onClick={() => setStep('start') } variant="primary" type="submit">
                                    Cancel
                                </Button>
                                <Button onClick={() => setStep('ConfirmDeposit') } variant="primary" type="submit">
                                    Submit
                                </Button>
                            </div>
                        </Form>

                    </div>
                    :
                    <div></div>
            }

            {
                (step === 'ConfirmDeposit')?
                    <div>
                        <div>
                            <p>Tezos Account: tz1aafgadrgadgadg</p>
                            <p>Minting Ethereum Account: 0xABSADQERQETG</p>
                            <p>Depositing: 6 XTZ</p>
                            <p>Approving 4 BXTZ to be minted</p>

                            <Button onClick={() => setStep('Deposit') } variant="primary" type="submit">
                                Back
                            </Button>
                            <Button onClick={() => setStep('DepositResult') } variant="primary" type="submit">
                                Submit
                            </Button>
                        </div>

                    </div>
                    :
                    <div></div>
            }

            {
                (step === 'DepositResult')?
                    <div>

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
                (step === 'Withdraw')?
                    <div>
                        <Form>

                            <Form.Group controlId="formTezosAddress">
                                <Form.Label>Tezos Address</Form.Label>
                                <Form.Control  placeholder="Unlock Tezos Wallet" />
                            </Form.Group>
                            <p>Tokens need to be burned on Ethereum in order to approve withdrawal</p>
                            <div style={buttonGroup}>

                                <Button  variant="info" style={buttonStyle} size="lg">Check Approval</Button>
                                <div style={{display:'flex'}}>
                                    <Button onClick={() => setStep('start') } variant="info" style={buttonStyle} size="lg">Cancel</Button>
                                    <Button onClick={() => setStep('WithdrawResult') } variant="info" style={buttonStyle} size="lg">Withdraw</Button>
                                </div>
                            </div>


                        </Form>

                    </div>
                    :
                    <div></div>
            }

            {
                (step === 'WithdrawResult')?
                    <div>

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

export default TezBody;