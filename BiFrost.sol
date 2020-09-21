pragma solidity ^0.6.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/AccessControl.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20Burnable.sol";
import "https://github.com/smartcontractkit/chainlink/blob/develop/evm-contracts/src/v0.6/ChainlinkClient.sol";

contract BiFrost is ERC20, AccessControl, ChainlinkClient {

    uint256 public xtzBalance

    address private oracle;
    bytes32 private jobId;
    uint256 private fee;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    mapping(uint => string) public whitelistTezosAddress;
    mapping(address => mapping(uint => string)) public ethAddress;
    
    constructor(address minter, address burner) public ERC20("BiFrost", "FRST") {
        _setupRole(MINTER_ROLE, minter);
        _setupRole(BURNER_ROLE, burner);
        setPublicChainlinkToken();
        oracle = 0x;
        jobId = "";
        fee = HELP;
    }

    function requestXtzBalance() private returns (bytes32 requestId) {
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
        
        // Set the URL to perform the GET request on
        request.add("get", "TEZOS ADDRESS BALANCE API GOES HERE");
        
        // Set the path to find the desired data in the API response, where the response format is:
        // {"USD":243.33}
        request.add("path", "USD"); // needs updated
        
        // Multiply the result by 100 to remove decimals
        request.addInt("times", 100); // needs updated
        
        // Sends the request
        return sendChainlinkRequestTo(oracle, request, fee);    
    }

      function fulfill(bytes32 _requestId, uint256 _balance) public recordChainlinkFulfillment(_requestId)
    {
        xtzBalance = _balance
    }

        function requestXtzValue returns (bytes32 requestId) {
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
        
        // Set the URL to perform the GET request on
        request.add("get", "TEZOS ADDRESS VALUE IN ETH GOES HERE");
        
        // Set the path to find the desired data in the API response, where the response format is:
        // {"USD":243.33}
        request.add("path", "ETH"); //needs updated
        
        // Multiply the result by 100 to remove decimals
        request.addInt("times", 100); // needs updated
        
        // Sends the request
        return sendChainlinkRequestTo(oracle, request, fee);    
    }

      function fulfill(bytes32 _requestId, uint256 _exrate) public recordChainlinkFulfillment(_requestId)
    {
        exRate = _exrate
    }

    function mint(address to, uint256 amount) public {
        require(hasRole(MINTER_ROLE, msg.sender), "Caller is not a minter");
        require(amount >= (xtzBalance*exRate)/100), "Insufficient XTZ Balance");
        _mint(to, amount);
    }
    
    function burn(address from, uint256 amount) public {
        require(hasRole(BURNER_ROLE, msg.sender), "Caller is not a burner");
        require( CALLS CHAINLINK HERE )
        _burn(from, amount);
    }
}