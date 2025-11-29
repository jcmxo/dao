"use client";

import { useWeb3 } from "@/hooks/useWeb3";

export function ConnectWallet() {
  const { account, isConnecting, connect, disconnect, isConnected } = useWeb3();

  if (!isConnected) {
    return (
      <button
        onClick={connect}
        disabled={isConnecting}
        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 flex items-center gap-2"
      >
        {isConnecting ? (
          <>
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Connecting...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Connect Wallet
          </>
        )}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="px-4 py-2.5 bg-gray-800/80 backdrop-blur-sm border border-gray-700 text-white rounded-xl font-mono text-sm font-medium">
        {account?.slice(0, 6)}...{account?.slice(-4)}
      </div>
      <button
        onClick={disconnect}
        className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:from-red-500 hover:to-rose-500 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
      >
        Disconnect
      </button>
    </div>
  );
}

