"use client";

import { useWeb3 } from "@/hooks/useWeb3";

export function ConnectWallet() {
  const { account, isConnecting, connect, disconnect, isConnected } = useWeb3();

  if (!isConnected) {
    return (
      <button
        onClick={connect}
        disabled={isConnecting}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="px-4 py-2 bg-gray-800 text-white rounded-lg">
        {account?.slice(0, 6)}...{account?.slice(-4)}
      </div>
      <button
        onClick={disconnect}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
      >
        Disconnect
      </button>
    </div>
  );
}

