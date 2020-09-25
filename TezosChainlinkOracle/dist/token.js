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
let tokenAddress;
let clientAddress;
function init() {
    state = JSON.parse(fs.readFileSync('state.json').toString());
    tezosNode = state.config.tezosNode;
    conseilServer = { url: state.config.conseilURL, apiKey: state.config.conseilApiKey, network: state.config.conseilNetwork };
    networkBlockTime = state.config.networkBlockTime;
    tokenAddress = state.tokenAddress;
    clientAddress = state.clientAddress;
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        init();
        const storage = yield conseiljs_2.MultiAssetTokenHelper.getSimpleStorage(tezosNode, tokenAddress);
        console.log(JSON.stringify(storage, null, 4));
        const token = yield conseiljs_2.MultiAssetTokenHelper.getTokenDefinition(tezosNode, storage.metadataMap);
        console.log(JSON.stringify(token, null, 4));
        let balance = yield conseiljs_2.MultiAssetTokenHelper.getAccountBalance(tezosNode, storage.balanceMap, state.oracleUserZach.pkh, 0);
        console.log(balance);
        const userKeyStore = yield conseiljs_softsigner_1.KeyStoreUtils.restoreIdentityFromSecretKey(state.oracleUserZach.secretKey);
        const userSigner = yield conseiljs_softsigner_1.SoftSigner.createSigner(conseiljs_2.TezosMessageUtils.writeKeyWithHint(userKeyStore.secretKey, 'edsk'));
        const groupid = yield conseiljs_2.MultiAssetTokenHelper.transfer(tezosNode, tokenAddress, userSigner, userKeyStore, 100000, userKeyStore.publicKeyHash, [{ address: state.oracleUserAlice.pkh, tokenid: 0, balance: 10 }]);
        console.log(`Injected transaction operation with ${groupid}`);
        const conseilResult = yield conseiljs_2.TezosConseilClient.awaitOperationConfirmation(conseilServer, conseilServer.network, groupid, 7, networkBlockTime);
        balance = yield conseiljs_2.MultiAssetTokenHelper.getAccountBalance(tezosNode, storage.balanceMap, state.oracleUserAlice.pkh, 0);
        console.log(balance);
    });
}
run();
//# sourceMappingURL=token.js.map