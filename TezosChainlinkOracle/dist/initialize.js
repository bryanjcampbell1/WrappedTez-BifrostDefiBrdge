"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const log = __importStar(require("loglevel"));
const fs = __importStar(require("fs"));
const conseiljs_1 = require("conseiljs");
const conseiljs_2 = require("conseiljs");
const conseiljs_softsigner_1 = require("conseiljs-softsigner");
const logger = log.getLogger('conseiljs');
logger.setLevel('debug', false);
conseiljs_1.registerLogger(logger);
conseiljs_1.registerFetch(node_fetch_1.default);
let state;
let tezosNode;
let conseilServer;
let networkBlockTime;
const stateFile = 'state.json';
function clearRPCOperationGroupHash(hash) {
    return hash.replace(/\"/g, '').replace(/\n/, '');
}
function sortAddresses(addresses) {
    return addresses.filter(a => a.startsWith('tz')).sort().concat(addresses.filter(a => a.startsWith('KT1')).sort());
}
function init() {
    state = JSON.parse(fs.readFileSync(stateFile).toString());
    tezosNode = state.config.tezosNode;
    conseilServer = { url: state.config.conseilURL, apiKey: state.config.conseilApiKey, network: state.config.conseilNetwork };
    networkBlockTime = state.config.networkBlockTime;
}
function initAccount(faucet) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('~~ initAccount');
        const keyStore = yield conseiljs_softsigner_1.KeyStoreUtils.restoreIdentityFromFundraiser(faucet.mnemonic.join(' '), faucet.email, faucet.password, faucet.pkh);
        console.log(JSON.stringify(keyStore));
        const signer = yield conseiljs_softsigner_1.SoftSigner.createSigner(conseiljs_2.TezosMessageUtils.writeKeyWithHint(keyStore.secretKey, 'edsk'));
        yield activateAccount(signer, keyStore, faucet.secret);
        yield revealAccount(signer, keyStore);
        return keyStore;
    });
}
function activateAccount(signer, keyStore, secret) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`~~ activateAccount`);
        const accountRecord = yield conseiljs_2.TezosConseilClient.getAccount(conseilServer, conseilServer.network, keyStore.publicKeyHash);
        if (accountRecord !== undefined) {
            return;
        }
        const nodeResult = yield conseiljs_2.TezosNodeWriter.sendIdentityActivationOperation(tezosNode, signer, keyStore, secret);
        const groupid = clearRPCOperationGroupHash(nodeResult.operationGroupID);
        console.log(`Injected activation operation with ${groupid}`);
        yield conseiljs_2.TezosConseilClient.awaitOperationConfirmation(conseilServer, conseilServer.network, groupid, 7, networkBlockTime);
    });
}
function revealAccount(signer, keyStore) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`~~ revealAccount`);
        if (yield conseiljs_2.TezosNodeReader.isManagerKeyRevealedForAccount(tezosNode, keyStore.publicKeyHash)) {
            return;
        }
        const nodeResult = yield conseiljs_2.TezosNodeWriter.sendKeyRevealOperation(tezosNode, signer, keyStore);
        const groupid = clearRPCOperationGroupHash(nodeResult.operationGroupID);
        console.log(`Injected reveal operation with ${groupid}`);
        yield conseiljs_2.TezosConseilClient.awaitOperationConfirmation(conseilServer, conseilServer.network, groupid, 5, networkBlockTime);
    });
}
function deployTokenContract(signer, keyStore, activate, fee, timeout, adminAddress, tokenAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('~~ deployTokenContract');
        const storage = `{ "prim": "Pair", "args": [ { "prim": "Pair", "args": [ { "string": "${adminAddress}" }, { "prim": "Pair", "args": [ { "int": "0" }, [] ] } ] }, { "prim": "Pair", "args": [ { "prim": "Pair", "args": [ { "prim": "Unit" }, [] ] }, { "prim": "Pair", "args": [ { "prim": "False" }, [] ] } ] } ] }`;
        const contract = fs.readFileSync('contracts/token.micheline').toString();
        const { gas, storageCost } = yield conseiljs_2.TezosNodeWriter.testContractDeployOperation(tezosNode, 'main', keyStore, 0, undefined, 500000, 20000, 800000, contract, storage);
        const nodeResult = yield conseiljs_2.TezosNodeWriter.sendContractOriginationOperation(tezosNode, signer, keyStore, 0, undefined, 400000, storageCost + 300, gas + 3000, contract, storage);
        const groupid = clearRPCOperationGroupHash(nodeResult['operationGroupID']);
        console.log(`Injected origination operation with ${groupid}`);
        const conseilResult = yield conseiljs_2.TezosConseilClient.awaitOperationConfirmation(conseilServer, conseilServer.network, groupid, 7, networkBlockTime);
        return conseilResult.originated_contracts;
    });
}
function deployFaucetContract(signer, keyStore, adminAddress, dropSize, tokenAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('~~ deployOracleContract');
        const storage = conseiljs_2.TezosLanguageUtil.translateMichelsonToMicheline(`(Pair (Pair True "${adminAddress}") (Pair ${dropSize} "${tokenAddress}"))`);
        const contract = fs.readFileSync('contracts/faucet.micheline').toString();
        const { gas, storageCost } = yield conseiljs_2.TezosNodeWriter.testContractDeployOperation(tezosNode, 'main', keyStore, 0, undefined, 100000, 10000, 800000, contract, storage);
        const nodeResult = yield conseiljs_2.TezosNodeWriter.sendContractOriginationOperation(tezosNode, signer, keyStore, 0, undefined, 150000, storageCost + 300, gas + 3000, contract, storage);
        const groupid = clearRPCOperationGroupHash(nodeResult['operationGroupID']);
        console.log(`Injected origination operation with ${groupid}`);
        const conseilResult = yield conseiljs_2.TezosConseilClient.awaitOperationConfirmation(conseilServer, conseilServer.network, groupid, 7, networkBlockTime);
        return conseilResult.originated_contracts;
    });
}
function deployOracleContract(signer, keyStore, activate, fee, timeout, adminAddress, tokenAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('~~ deployOracleContract');
        const storage = `{ "prim": "Pair", "args": [ { "prim": "Pair", "args": [ { "prim": "Pair", "args": [ { "prim": ${activate ? '"True"' : '"False"'} }, { "string": "${adminAddress}" } ] }, { "prim": "Pair", "args": [ { "int": "${fee}" }, { "int": "${timeout}" } ] } ] }, { "prim": "Pair", "args": [ { "prim": "Pair", "args": [ { "int": "0" }, [] ] }, { "prim": "Pair", "args": [ [], { "string": "${tokenAddress}" } ] } ] } ] }`;
        const contract = fs.readFileSync('contracts/oracle.micheline').toString();
        const { gas, storageCost } = yield conseiljs_2.TezosNodeWriter.testContractDeployOperation(tezosNode, 'main', keyStore, 0, undefined, 100000, 10000, 800000, contract, storage);
        const nodeResult = yield conseiljs_2.TezosNodeWriter.sendContractOriginationOperation(tezosNode, signer, keyStore, 0, undefined, 150000, storageCost + 300, gas + 3000, contract, storage);
        const groupid = clearRPCOperationGroupHash(nodeResult['operationGroupID']);
        console.log(`Injected origination operation with ${groupid}`);
        const conseilResult = yield conseiljs_2.TezosConseilClient.awaitOperationConfirmation(conseilServer, conseilServer.network, groupid, 7, networkBlockTime);
        return conseilResult.originated_contracts;
    });
}
function deployFortuneSeekerContract(signer, keyStore, adminAddress, oracleAddress, tokenAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('~~ deployOracleContract');
        const storage = `{
        "prim": "Pair",
        "args": [
          {
            "prim": "Pair",
            "args": [
              { "prim": "Pair", "args": [ { "string": "${adminAddress}" }, [] ] },
              { "prim": "Pair", "args": [ [], { "prim": "Pair", "args": [ { "string": "" }, { "bytes": "0001" } ] } ] }
            ]
          },
          {
            "prim": "Pair",
            "args": [
              { "prim": "Pair", "args": [ { "int": "1" }, { "prim": "Pair", "args": [ { "string": "${oracleAddress}" }, { "string": "${tokenAddress}" } ] } ] },
              { "prim": "Pair", "args": [ { "int": "0" }, { "prim": "Pair", "args": [ { "prim": "None" }, [] ] } ] }
            ]
          }
        ]
      }`;
        const contract = fs.readFileSync('contracts/fortune_seeker.micheline').toString();
        const { gas, storageCost } = yield conseiljs_2.TezosNodeWriter.testContractDeployOperation(tezosNode, 'main', keyStore, 0, undefined, 100000, 10000, 800000, contract, storage);
        const nodeResult = yield conseiljs_2.TezosNodeWriter.sendContractOriginationOperation(tezosNode, signer, keyStore, 0, undefined, 150000, storageCost + 300, gas + 3000, contract, storage);
        const groupid = clearRPCOperationGroupHash(nodeResult['operationGroupID']);
        console.log(`Injected origination operation with ${groupid}`);
        const conseilResult = yield conseiljs_2.TezosConseilClient.awaitOperationConfirmation(conseilServer, conseilServer.network, groupid, 7, networkBlockTime);
        return conseilResult.originated_contracts;
    });
}
function seedTokens(addresses) {
    return __awaiter(this, void 0, void 0, function* () {
        const keyStore = yield conseiljs_softsigner_1.KeyStoreUtils.restoreIdentityFromSecretKey(state.oracleUserAlice.secretKey);
        const signer = yield conseiljs_softsigner_1.SoftSigner.createSigner(conseiljs_2.TezosMessageUtils.writeKeyWithHint(keyStore.secretKey, 'edsk'));
        const params = `{${sortAddresses(addresses).map(a => '"' + a + '"').join('; ')}}`;
        const nodeResult = yield conseiljs_2.TezosNodeWriter.sendContractInvocationOperation(tezosNode, signer, keyStore, state.faucetAddress, 0, 500000, 100 * addresses.length, Math.max(300000, 200000 * addresses.length), 'request_tokens', params, conseiljs_2.TezosParameterFormat.Michelson);
        const groupid = clearRPCOperationGroupHash(nodeResult.operationGroupID);
        console.log(`Injected transaction operation with ${groupid}`);
        const conseilResult = yield conseiljs_2.TezosConseilClient.awaitOperationConfirmation(conseilServer, conseilServer.network, groupid, 7, networkBlockTime);
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        init();
        let changed = false;
        if (!state.oracleAdmin.secretKey || state.oracleAdmin.secretKey.length === 0) {
            const ks = yield initAccount(state.oracleAdmin);
            state.oracleAdmin.secretKey = ks.secretKey;
            changed = true;
        }
        if (!state.oracleUserAlice.secretKey || state.oracleUserAlice.secretKey.length === 0) {
            const ks = yield initAccount(state.oracleUserAlice);
            state.oracleUserAlice.secretKey = ks.secretKey;
            changed = true;
        }
        if (!state.tokenAddress) {
            const adminKeyStore = yield conseiljs_softsigner_1.KeyStoreUtils.restoreIdentityFromSecretKey(state.oracleAdmin.secretKey);
            const adminSigner = yield conseiljs_softsigner_1.SoftSigner.createSigner(conseiljs_2.TezosMessageUtils.writeKeyWithHint(adminKeyStore.secretKey, 'edsk'));
            const tokenAddress = yield deployTokenContract(adminSigner, adminKeyStore, true, 0, 5, adminKeyStore.publicKeyHash, state.tokenAddress);
            state.tokenAddress = tokenAddress;
            changed = true;
        }
        if (!state.faucetAddress) {
            const adminKeyStore = yield conseiljs_softsigner_1.KeyStoreUtils.restoreIdentityFromSecretKey(state.oracleAdmin.secretKey);
            const adminSigner = yield conseiljs_softsigner_1.SoftSigner.createSigner(conseiljs_2.TezosMessageUtils.writeKeyWithHint(adminKeyStore.secretKey, 'edsk'));
            const faucetAddress = yield deployFaucetContract(adminSigner, adminKeyStore, adminKeyStore.publicKeyHash, 10, state.tokenAddress);
            state.faucetAddress = faucetAddress;
            changed = true;
        }
        if (!state.oracleAddress) {
            const adminKeyStore = yield conseiljs_softsigner_1.KeyStoreUtils.restoreIdentityFromSecretKey(state.oracleAdmin.secretKey);
            const adminSigner = yield conseiljs_softsigner_1.SoftSigner.createSigner(conseiljs_2.TezosMessageUtils.writeKeyWithHint(adminKeyStore.secretKey, 'edsk'));
            const oracleAddress = yield deployOracleContract(adminSigner, adminKeyStore, true, 0, 5, adminKeyStore.publicKeyHash, state.tokenAddress);
            state.oracleAddress = oracleAddress;
            changed = true;
        }
        if (!state.clientAddress) {
            const clientKeyStore = yield conseiljs_softsigner_1.KeyStoreUtils.restoreIdentityFromSecretKey(state.oracleAdmin.secretKey);
            const clientSigner = yield conseiljs_softsigner_1.SoftSigner.createSigner(conseiljs_2.TezosMessageUtils.writeKeyWithHint(clientKeyStore.secretKey, 'edsk'));
            const clientAddress = yield deployFortuneSeekerContract(clientSigner, clientKeyStore, clientKeyStore.publicKeyHash, state.oracleAddress, state.tokenAddress);
            state.clientAddress = clientAddress;
            changed = true;
        }
        if (changed) {
            fs.writeFileSync(stateFile, JSON.stringify(state, null, 4));
        }
        yield seedTokens([state.oracleAdmin.pkh, state.oracleUserAlice.pkh, state.oracleAddress, state.clientAddress]);
    });
}
run();
//# sourceMappingURL=initialize.js.map