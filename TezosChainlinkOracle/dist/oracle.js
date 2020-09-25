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
const web3_1 = __importDefault(require("web3"));
const abi = require('../abi/bxtz.json');
const contractAddress = '0x210bfF5facf8392E6FFe7B194B9A8A17f44Fb1eb';
const logger = log.getLogger('conseiljs');
logger.setLevel('debug', false);
conseiljs_1.registerLogger(logger);
conseiljs_1.registerFetch(node_fetch_1.default);
let state;
let tezosNode;
let conseilServer;
let networkBlockTime;
let oracleAddress;
let pendingCheck = false;
let monitor;
let mapId;
let currentRequestId;
function clearRPCOperationGroupHash(hash) {
    return hash.replace(/\"/g, '').replace(/\n/, '');
}
function init() {
    state = JSON.parse(fs.readFileSync('state.json').toString());
    tezosNode = state.config.tezosNode;
    conseilServer = { url: state.config.conseilURL, apiKey: state.config.conseilApiKey, network: state.config.conseilNetwork };
    networkBlockTime = state.config.networkBlockTime;
    oracleAddress = state.oracleAddress;
}
function getSimpleStorage() {
    return __awaiter(this, void 0, void 0, function* () {
        const storageResult = yield conseiljs_2.TezosNodeReader.getContractStorage(tezosNode, oracleAddress);
        return {
            active: (jsonpath_plus_1.JSONPath({ path: '$.args[0].args[0].args[0].prim', json: storageResult })[0]).toString().toLowerCase().startsWith('t'),
            administrator: jsonpath_plus_1.JSONPath({ path: '$.args[0].args[0].args[1].string', json: storageResult })[0],
            fee: Number(jsonpath_plus_1.JSONPath({ path: '$.args[0].args[1].args[0].int', json: storageResult })[0]),
            timeout: Number(jsonpath_plus_1.JSONPath({ path: '$.args[0].args[1].args[1].int', json: storageResult })[0]),
            counter: Number(jsonpath_plus_1.JSONPath({ path: '$.args[1].args[0].args[0].int', json: storageResult })[0]),
            map: Number(jsonpath_plus_1.JSONPath({ path: '$.args[1].args[0].args[1].int', json: storageResult })[0]),
            lookup: Number(jsonpath_plus_1.JSONPath({ path: '$.args[1].args[1].args[0].int', json: storageResult })[0]),
            token: jsonpath_plus_1.JSONPath({ path: '$.args[1].args[1].args[1].string', json: storageResult })[0]
        };
    });
}
function checkForRequest(signer, keyStore) {
    return __awaiter(this, void 0, void 0, function* () {
        if (pendingCheck) {
            return;
        }
        pendingCheck = true;
        try {
            const packedKey = conseiljs_2.TezosMessageUtils.encodeBigMapKey(Buffer.from(conseiljs_2.TezosMessageUtils.writePackedData(currentRequestId, 'nat'), 'hex'));
            const mapResult = yield conseiljs_2.TezosNodeReader.getValueForBigMapKey(tezosNode, mapId, packedKey);
            const request = {
                amount: Number(jsonpath_plus_1.JSONPath({ path: '$.args[0].args[0].int', json: mapResult })[0]),
                client: jsonpath_plus_1.JSONPath({ path: '$.args[0].args[1].args[0].string', json: mapResult })[0],
                requestId: Number(jsonpath_plus_1.JSONPath({ path: '$.args[0].args[1].args[1].int', json: mapResult })[0]),
                jobId: jsonpath_plus_1.JSONPath({ path: '$.args[1].args[0].args[0].bytes', json: mapResult })[0],
                params: jsonpath_plus_1.JSONPath({ path: '$.args[1].args[0].args[1][0].args[1].args[0].bytes', json: mapResult })[0],
                target: jsonpath_plus_1.JSONPath({ path: '$.args[1].args[1].args[0].string', json: mapResult })[0],
                timestamp: new Date(jsonpath_plus_1.JSONPath({ path: '$.args[1].args[1].args[1].string', json: mapResult })[0]),
                oracleRequestId: currentRequestId
            };
            processRequest(signer, keyStore, request);
            currentRequestId += 1;
        }
        catch (err) {
            console.log(`error in checkForRequest, ${JSON.stringify(err)}`);
            console.trace(err);
        }
        finally {
            pendingCheck = false;
        }
    });
}
function processRequest(signer, keyStore, request) {
    return __awaiter(this, void 0, void 0, function* () {
        const fee = 300000;
        const gasLimit = 500000;
        const storageFee = 3000;
        const val = conseiljs_2.TezosMessageUtils.readPackedData(request.params, "address").toString().slice(4);
        const web3 = new web3_1.default('https://rinkeby.infura.io/v3/ed09c851cd06475aba678fdb5e84a15c');
        const myContract = new web3.eth.Contract(abi, contractAddress);
        const res = yield myContract.getPastEvents('Burn', {
            filter: { tezAccount: web3.utils.asciiToHex(val) },
            fromBlock: 0,
            toBlock: 'latest'
        });
        console.log(res[0]);
        console.log(res[0].returnValues[1]);
        const fortune = res[0].returnValues[1];
        const nodeResult = yield conseiljs_2.TezosNodeWriter.sendContractInvocationOperation(tezosNode, signer, keyStore, state.oracleAddress, 0, fee, storageFee, gasLimit, 'fulfill_request', `(Pair ${request.oracleRequestId} (Right (Left ${fortune}) ))`, conseiljs_2.TezosParameterFormat.Michelson);
        const groupid = clearRPCOperationGroupHash(nodeResult.operationGroupID);
        console.log(`Injected transaction operation with ${groupid}`);
        yield conseiljs_2.TezosConseilClient.awaitOperationConfirmation(conseilServer, conseilServer.network, groupid, 10, networkBlockTime);
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        init();
        const adminKeyStore = yield conseiljs_softsigner_1.KeyStoreUtils.restoreIdentityFromSecretKey(state.oracleAdmin.secretKey);
        const adminSigner = yield conseiljs_softsigner_1.SoftSigner.createSigner(conseiljs_2.TezosMessageUtils.writeKeyWithHint(adminKeyStore.secretKey, 'edsk'));
        const oracleStorage = yield getSimpleStorage();
        mapId = oracleStorage.map;
        currentRequestId = oracleStorage.counter - 1;
        yield checkForRequest(adminSigner, adminKeyStore);
    });
}
run();
//# sourceMappingURL=oracle.js.map