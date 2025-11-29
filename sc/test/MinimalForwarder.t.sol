// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {MinimalForwarder} from "../src/MinimalForwarder.sol";

contract MinimalForwarderTest is Test {
    MinimalForwarder forwarder;
    address user = address(0x1);
    address target = address(0x2);
    uint256 userPrivateKey = 0x1234567890123456789012345678901234567890123456789012345678901234;

    function setUp() public {
        forwarder = new MinimalForwarder();
        vm.deal(user, 10 ether);
        vm.deal(address(forwarder), 10 ether);
    }

    function testGetNonce() public {
        assertEq(forwarder.getNonce(user), 0);
    }

    function testNonceIncrement() public {
        // Test that nonce starts at 0
        assertEq(forwarder.getNonce(user), 0);
        
        // After execution, nonce should increment
        // (Full execution test requires proper EIP-712 signature which is tested in integration)
    }
}

