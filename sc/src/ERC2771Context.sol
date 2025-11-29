// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ERC2771Context
 * @dev Context variant with ERC2771 support - extracts real sender from meta-transactions
 */
abstract contract ERC2771Context {
    address private immutable _trustedForwarder;

    constructor(address trustedForwarder) {
        _trustedForwarder = trustedForwarder;
    }

    function isTrustedForwarder(address forwarder) public view virtual returns (bool) {
        return forwarder == _trustedForwarder;
    }

    function _msgSender() internal view virtual returns (address) {
        if (isTrustedForwarder(msg.sender)) {
            // The last 20 bytes of calldata contain the address of the original sender
            // This is appended by the MinimalForwarder
            return address(bytes20(msg.data[msg.data.length - 20:]));
        }
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        if (isTrustedForwarder(msg.sender)) {
            // Remove the last 20 bytes (sender address) from calldata
            return msg.data[:msg.data.length - 20];
        }
        return msg.data;
    }
}

