"use client";

import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { BrowserProvider } from "ethers";

export function useWeb3() {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnected, setIsDisconnected] = useState(false);

  const connect = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    setIsConnecting(true);
    setIsDisconnected(false); // Reset disconnect flag
    try {
      const provider = new BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();

      setProvider(provider);
      setAccount(address);
      setChainId(Number(network.chainId));
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      alert("Failed to connect to MetaMask");
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setIsDisconnected(true); // Set flag to prevent auto-reconnect
    setAccount(null);
    setProvider(null);
    setChainId(null);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        setIsDisconnected(true);
        setAccount(null);
        setProvider(null);
        setChainId(null);
      } else {
        // Always update account when MetaMask accounts change
        setAccount(accounts[0]);
        setIsDisconnected(false); // Reset disconnect flag if account changes in MetaMask
      }
    };

    const handleChainChanged = async () => {
      try {
        const currentProvider = new BrowserProvider(window.ethereum);
        const network = await currentProvider.getNetwork();
        setChainId(Number(network.chainId));
      } catch (error) {
        console.error("Error getting network:", error);
      }
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    // Try to reconnect if already connected, but only if not manually disconnected
    const checkConnection = async () => {
      if (isDisconnected) return; // Don't auto-reconnect if manually disconnected
      
      try {
        const currentProvider = new BrowserProvider(window.ethereum);
        const accounts = await currentProvider.listAccounts();
        if (accounts.length > 0 && account === null) {
          // Only auto-connect if we don't already have an account
          const network = await currentProvider.getNetwork();
          setProvider(currentProvider);
          setAccount(accounts[0].address);
          setChainId(Number(network.chainId));
        }
      } catch (error) {
        console.error("Error checking connection:", error);
      }
    };

    checkConnection();

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum?.removeListener("chainChanged", handleChainChanged);
    };
  }, [isDisconnected, account]);

  return {
    account,
    provider,
    chainId,
    isConnecting,
    connect,
    disconnect,
    isConnected: account !== null,
  };
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

