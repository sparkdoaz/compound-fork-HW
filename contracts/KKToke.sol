pragma solidity ^0.5.16;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";

contract KKToken is ERC20, ERC20Detailed {
    constructor(uint256 initialSupply) ERC20Detailed("KKToken", "KKT", 18) public {
        _mint(msg.sender, initialSupply);
    }
}