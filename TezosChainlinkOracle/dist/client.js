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
const jsonpath_plus_1 = require("jsonpath-plus");
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
let tokenAddress;
let oracleAddress;
let clientAddress;
let monitor;
let currentFortune;
let newFortune;
function clearRPCOperationGroupHash(hash) {
    return hash.replace(/\"/g, '').replace(/\n/, '');
}
function init() {
    state = JSON.parse(fs.readFileSync('state.json').toString());
    tezosNode = state.config.tezosNode;
    conseilServer = { url: state.config.conseilURL, apiKey: state.config.conseilApiKey, network: state.config.conseilNetwork };
    networkBlockTime = state.config.networkBlockTime;
    tokenAddress = state.tokenAddress;
    oracleAddress = state.oracleAddress;
    clientAddress = state.clientAddress;
}
function getSimpleStorage() {
    return __awaiter(this, void 0, void 0, function* () {
        const storageResult = yield conseiljs_2.TezosNodeReader.getContractStorage(tezosNode, clientAddress);
        console.log("-8-8-8-8-8-8--8-8-8-8-8-8-8-8-8-8-8-8-8-8-8-8-");
        console.log(JSON.stringify(storageResult));
        let storage = {
            administrator: jsonpath_plus_1.JSONPath({ path: '$.args[0].args[0].string', json: storageResult })[0],
            fortune: jsonpath_plus_1.JSONPath({ path: '$.args[0].args[1].args[0].int', json: storageResult })[0],
            jobId: jsonpath_plus_1.JSONPath({ path: '$.args[0].args[1].args[1].bytes', json: storageResult })[0],
            requestId: Number(jsonpath_plus_1.JSONPath({ path: '$.args[1].args[0].args[0].int', json: storageResult })[0]),
            oracleAddress: jsonpath_plus_1.JSONPath({ path: '$.args[1].args[0].args[1].string', json: storageResult })[0],
            tokenAddress: jsonpath_plus_1.JSONPath({ path: '$.args[1].args[1].args[0].string', json: storageResult })[0],
            pendingRequestId: -1
        };
        try {
            storage.pendingRequestId = Number(jsonpath_plus_1.JSONPath({ path: '$.args[1].args[1].args[1].int', json: storageResult })[0]);
        }
        catch (_a) { }
        return storage;
    });
}
function checkFortune() {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
function switchOracle() {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
function requestFortune(signer, keyStore, payment, timeout = 5) {
    return __awaiter(this, void 0, void 0, function* () {
        const fee = 300000;
        const gasLimit = 500000;
        const storageFee = 3000;
        const nodeResult = yield conseiljs_2.TezosNodeWriter.sendContractInvocationOperation(tezosNode, signer, keyStore, clientAddress, 0, fee, storageFee, gasLimit, 'request_fortune', `(Pair ${payment} ${timeout})`, conseiljs_2.TezosParameterFormat.Michelson);
        const groupid = clearRPCOperationGroupHash(nodeResult.operationGroupID);
        console.log(`Injected transaction operation with ${groupid}`);
        const conseilResult = yield conseiljs_2.TezosConseilClient.awaitOperationConfirmation(conseilServer, conseilServer.network, groupid, 7, networkBlockTime);
        console.log(JSON.stringify(conseilResult));
    });
}
function cancelFortune(signer, keyStore, requestId) {
    return __awaiter(this, void 0, void 0, function* () {
        const fee = 300000;
        const gasLimit = 500000;
        const storageFee = 3000;
        const nodeResult = yield conseiljs_2.TezosNodeWriter.sendContractInvocationOperation(tezosNode, signer, keyStore, clientAddress, 0, fee, storageFee, gasLimit, '', '(Left (Left Unit))', conseiljs_2.TezosParameterFormat.Michelson);
        const groupid = clearRPCOperationGroupHash(nodeResult.operationGroupID);
        console.log(`Injected transaction operation with ${groupid}`);
        const conseilResult = yield conseiljs_2.TezosConseilClient.awaitOperationConfirmation(conseilServer, conseilServer.network, groupid, 7, networkBlockTime);
        console.log(JSON.stringify(conseilResult));
    });
}
function confirmTokenBalance(address, minimum) {
    return __awaiter(this, void 0, void 0, function* () {
        const storage = yield conseiljs_2.ChainlinkTokenHelper.getSimpleStorage(tezosNode, tokenAddress);
        const token = yield conseiljs_2.ChainlinkTokenHelper.getTokenDefinition(tezosNode, storage.metadataMap);
        try {
            const balance = yield conseiljs_2.ChainlinkTokenHelper.getAccountBalance(tezosNode, storage.balanceMap, address);
            if (balance < minimum) {
                throw new Error('Insufficient token balance');
            }
        }
        catch (_a) {
            throw new Error('No balance found');
        }
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        init();
        const oracleFee = 1;
        const userKeyStore = yield conseiljs_softsigner_1.KeyStoreUtils.restoreIdentityFromSecretKey(state.oracleUserAlice.secretKey);
        const userSigner = yield conseiljs_softsigner_1.SoftSigner.createSigner(conseiljs_2.TezosMessageUtils.writeKeyWithHint(userKeyStore.secretKey, 'edsk'));
        yield confirmTokenBalance(userKeyStore.publicKeyHash, oracleFee);
        const contractState = yield getSimpleStorage();
        console.log(`current fortune: "${contractState.fortune}"`);
        yield requestFortune(userSigner, userKeyStore, oracleFee);
    });
}
run();
//# sourceMappingURL=client.js.map