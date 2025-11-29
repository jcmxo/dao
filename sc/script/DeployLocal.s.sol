// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {MinimalForwarder} from "../src/MinimalForwarder.sol";
import {DAOVoting} from "../src/DAOVoting.sol";

contract DeployLocal is Script {
    function run() external {
        // For local deployment, use the default account (first Anvil account)
        vm.startBroadcast();

        console.log("Deploying MinimalForwarder to local network...");
        MinimalForwarder forwarder = new MinimalForwarder();
        console.log("MinimalForwarder deployed at:", address(forwarder));

        console.log("Deploying DAOVoting to local network...");
        DAOVoting dao = new DAOVoting(address(forwarder));
        console.log("DAOVoting deployed at:", address(dao));

        console.log("\n=== Local Deployment Summary ===");
        console.log("Forwarder:", address(forwarder));
        console.log("DAO:", address(dao));
        console.log("\nAdd these to your .env.local:");
        console.log("NEXT_PUBLIC_FORWARDER_ADDRESS=", address(forwarder));
        console.log("NEXT_PUBLIC_DAO_ADDRESS=", address(dao));
        console.log("==================================");

        vm.stopBroadcast();
    }
}

