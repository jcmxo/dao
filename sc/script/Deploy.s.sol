// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {MinimalForwarder} from "../src/MinimalForwarder.sol";
import {DAOVoting} from "../src/DAOVoting.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        console.log("Deploying MinimalForwarder...");
        MinimalForwarder forwarder = new MinimalForwarder();
        console.log("MinimalForwarder deployed at:", address(forwarder));

        console.log("Deploying DAOVoting...");
        DAOVoting dao = new DAOVoting(address(forwarder));
        console.log("DAOVoting deployed at:", address(dao));

        console.log("\n=== Deployment Summary ===");
        console.log("Forwarder:", address(forwarder));
        console.log("DAO:", address(dao));
        console.log("========================");

        vm.stopBroadcast();
    }
}

