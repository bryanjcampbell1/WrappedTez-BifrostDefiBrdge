import React from 'react';
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { ThanosWallet } from "@thanos-wallet/dapp";



/*   
const bifrost = await tezos.wallet.at(
"KT1S94kmkfLx5whkDSk5QaJ539z32rBLqxra"
);    

    

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

    */

class TezBody extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            step: 'start',
            whitelistedEthAddress: '',
            depositAmount: 0,
            tezosAddress:'Unlock Wallet'
    
        }
        this.loadWallet();
    }



    async loadWallet(){

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

            this.setState({tezosAddress: accountPkh})
    
            console.info(`address: ${accountPkh}, balance: ${accountBalance}`);
    
            
    
        } catch (err) {
            console.error(err);
        }

    }




    async callDepositEntryPoint(){

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
    
            const operation = await bifrost.methods.deposit(this.state.whitelistedEthAddress).send({ amount: this.state.depositAmount });
            await operation.confirmation();
    
        } catch (err) {
            console.error(err);
        }

        this.setState({step: 'DepositResult'})
    }

    async callRequestEntryPoint(){
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

    
            const operation = await bifrost.methods.request_fortune(1,10).send();
            await operation.confirmation();
    
        } catch (err) {
            console.error(err);
        }


        this.setState({step: 'DepositResult'})
    }


    async callWithdrawEntryPoint(){

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
    
            const operation = await bifrost.methods.withdraw().send();
            await operation.confirmation();
    
        } catch (err) {
            console.error(err);
        }
        
        
        this.setState({step: 'WithdrawResult'})
    }
    
    render(){
        return( 

            <div style={{padding:20}}>
                {
                    (this.state.step === 'start')?
                        <div style={buttonGroup}>
                            <Button onClick={() => this.setState({step: 'Deposit'}) } variant="info" style={buttonStyle} size="lg">Deposit XTZ</Button>
                            <Button onClick={() => this.setState({step: 'Withdraw'}) } variant="info" style={buttonStyle} size="lg">Withdraw XTZ</Button>
                        </div>
                    :
                        <div></div>
                }
                {
                    (this.state.step === 'Deposit')?
                        <div>
                            <Form>
                                <Form.Group controlId="formTezosAddress">
                                    <Form.Label>Tezos Address</Form.Label>
                                    <Form.Control  placeholder={this.state.tezosAddress} readOnly/>
                                </Form.Group>

                                <Form.Group controlId="formXTZAmount">
                                    <Form.Label>XTZ Deposit Amount</Form.Label>
                                    <Form.Control  placeholder="0" onChange={(e)=> this.setState({depositAmount: e.target.value})}/>
                                    <Form.Text className="text-muted">
                                        This deposit approves {this.state.depositAmount} bXTZ to be minted on Ethereum
                                    </Form.Text>
                                    <Form.Text className="text-muted">
                                        1 bXTZ = 1.5 XTZ and grows in value as XTZ pool is Baked
                                    </Form.Text>
                                </Form.Group>

                                <Form.Group controlId="formEthAddress">
                                    <Form.Label>Minting Ethereum Address </Form.Label>
                                    <Form.Control  
                                        onChange={(e)=> this.setState({whitelistedEthAddress: e.target.value})}
                                        placeholder="" 
                                    />
                                    <Form.Text className="text-muted">
                                        The Ethereum address above will be whitelisted to mint {this.state.depositAmount/1.5} BXTZ
                                    </Form.Text>
                                </Form.Group>

                                <div>
                                    <Button onClick={() => this.setState({step: 'start'}) } variant="primary" type="submit">
                                        Cancel
                                    </Button>
                                    <Button onClick={() => this.setState({step: 'ConfirmDeposit'}) } variant="primary" type="submit">
                                        Submit
                                    </Button>
                                </div>
                            </Form>

                        </div>
                        :
                        <div></div>
                }

                {
                    (this.state.step === 'ConfirmDeposit')?
                        <div>
                            <div>
                                <p>Tezos Account: {this.state.tezosAddress}</p>
                                <p>Minting Ethereum Account: {this.state.whitelistedEthAddress}</p>
                                <p>Depositing: {this.state.depositAmount} XTZ</p>
                                <p>Approving {this.state.depositAmount/1.5}  bXTZ to be minted on Ethereum</p>

                                <Button onClick={() => this.setState({step: 'Deposit'}) } variant="primary" type="submit">
                                    Back
                                </Button>
                                <Button onClick={() => this.callDepositEntryPoint()} variant="primary" type="submit">
                                    Submit
                                </Button>
                            </div>

                        </div>
                        :
                        <div></div>
                }

                {
                    (this.state.step === 'DepositResult')?
                        <div>

                            <p> Transaction Hash </p>
                            <p>oodxfYYvYQL4gwpiEp...</p>

                            <Button onClick={() => this.setState({step: 'start'}) } variant="primary" type="submit">
                                Done
                            </Button>


                        </div>
                        :
                        <div></div>
                }
                {
                    (this.state.step === 'Withdraw')?
                        <div>
                            <Form>

                                <Form.Group controlId="formTezosAddress">
                                    <Form.Label>Tezos Address</Form.Label>
                                    <Form.Control  placeholder={this.state.tezosAddress} readOnly/>
                                </Form.Group>
                                <p>Tokens need to be burned on Ethereum in order to approve withdrawal</p>
                                <div style={buttonGroup}>

                                    <Button  variant="info" onClick={() => this.callRequestEntryPoint()} style={buttonStyle} size="lg">Check Approval</Button>


                                    <div style={{display:'flex'}}>
                                        <Button onClick={() => this.setState({step: 'start'}) } variant="info" style={buttonStyle} size="lg">Cancel</Button>
                                        <Button onClick={() => this.callWithdrawEntryPoint()  } variant="info" style={buttonStyle} size="lg">Withdraw</Button>
                                    </div>
                                </div>


                            </Form>

                        </div>
                        :
                        <div></div>
                }

                {
                    (this.state.step === 'WithdrawResult')?
                        <div>

                            <p> Transaction Hash </p>
                            <p>oodxfYYvYQL4gwpiEp...</p>

                            <Button onClick={() => this.setState({step: 'start'})} variant="primary" type="submit">
                                Done
                            </Button>

                        </div>
                        :
                        <div></div>
                }

            </div>
        )    

        
    }
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