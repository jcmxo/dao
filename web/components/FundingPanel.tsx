"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useWeb3 } from "@/hooks/useWeb3";
import { DAO_ABI } from "@/lib/contracts";

export function FundingPanel() {
  const { account, provider, isConnected } = useWeb3();
  const [amount, setAmount] = useState("");
  const [userBalance, setUserBalance] = useState<string>("0");
  const [totalBalance, setTotalBalance] = useState<string>("0");
  const [totalProposals, setTotalProposals] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  const daoAddress = process.env.NEXT_PUBLIC_DAO_ADDRESS || "";

  const loadBalances = async () => {
    if (!provider || !daoAddress) return;

    try {
      const contract = new ethers.Contract(daoAddress, DAO_ABI, provider);
      const totalBal = await contract.totalBalance();
      setTotalBalance(ethers.formatEther(totalBal));

      // Load user balance if connected
      if (account) {
        const userBal = await contract.getUserBalance(account);
        setUserBalance(ethers.formatEther(userBal));
      }

      // Count total proposals
      let count = 0;
      for (let i = 1; i <= 100; i++) {
        try {
          const proposal = await contract.getProposal(i);
          if (proposal.id === 0n) break;
          count++;
        } catch {
          break;
        }
      }
      setTotalProposals(count);
    } catch (error) {
      console.error("Error loading balances:", error);
    }
  };

  useEffect(() => {
    if (isConnected) {
      loadBalances();
      const interval = setInterval(loadBalances, 5000); // Refresh every 5 seconds
      return () => clearInterval(interval);
    } else {
      // Still load total balance and proposals even if not connected
      loadBalances();
    }
  }, [isConnected, account, provider]);

  const handleFund = async () => {
    if (!provider || !account || !daoAddress) {
      alert("Missing configuration. Please check your wallet connection.");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    setIsLoading(true);
    try {
      const amountWei = ethers.parseEther(amount);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(daoAddress, DAO_ABI, signer);
      
      console.log("Sending transaction:", {
        to: daoAddress,
        value: amountWei.toString(),
        from: account
      });

      const tx = await contract.fundDAO({ value: amountWei });
      console.log("Transaction sent:", tx.hash);
      
      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt.hash);
      
      setAmount("");
      await loadBalances();
      alert(`Successfully deposited ${amount} ETH to the DAO!`);
    } catch (error: any) {
      console.error("Error funding DAO:", error);
      let errorMessage = "Failed to deposit to DAO";
      
      if (error.reason) {
        errorMessage = error.reason;
      } else if (error.message) {
        errorMessage = error.message;
      } else if (error.data?.message) {
        errorMessage = error.data.message;
      }
      
      alert(`Error: ${errorMessage}\n\nCheck the console (F12) for more details.`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="p-6 md:p-8 glass-effect rounded-2xl card-hover shadow-xl">
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-500/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <p className="text-gray-300 font-medium">Please connect your wallet to fund the DAO</p>
        </div>
      </div>
    );
  }

  const userBalanceNum = parseFloat(userBalance);
  const totalBalanceNum = parseFloat(totalBalance);
  const userPercentage = totalBalanceNum > 0 
    ? ((userBalanceNum / totalBalanceNum) * 100).toFixed(2)
    : "0.00";

  return (
    <div className="p-6 md:p-8 glass-effect rounded-2xl card-hover shadow-xl">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-2">
        <span className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></span>
        DAO Treasury
      </h2>
      
      {/* Treasury Balance - Prominent */}
      <div className="mb-6 p-4 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-500/20">
        <div className="text-gray-400 text-xs uppercase tracking-wider mb-2 font-semibold">Treasury Balance</div>
        <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          {totalBalanceNum.toFixed(4)} ETH
        </div>
      </div>

      {/* Total Proposals */}
      <div className="mb-6 p-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl border border-emerald-500/20">
        <div className="flex justify-between items-center">
          <span className="text-gray-300 text-sm font-medium">Total Proposals</span>
          <span className="text-2xl md:text-3xl font-bold text-emerald-400">{totalProposals}</span>
        </div>
      </div>

      {/* Your Balance in DAO */}
      {isConnected && (
        <div className="mb-6 p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
          <div className="text-gray-300 text-xs uppercase tracking-wider mb-1 font-semibold">Your Balance in DAO</div>
          <div className="text-xl md:text-2xl font-bold text-purple-400 mb-1">{userBalanceNum.toFixed(4)} ETH</div>
          <div className="text-gray-400 text-sm">{userPercentage}% of total</div>
        </div>
      )}

      {/* Deposit Section */}
      {isConnected && (
        <>
          <div className="mb-5">
            <label className="block text-white mb-2 font-medium text-sm">Deposit ETH to DAO</label>
            <input
              type="number"
              step="0.001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-500"
              placeholder="0.0"
            />
          </div>

          <button
            onClick={handleFund}
            disabled={isLoading || !amount}
            className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              "Deposit to DAO"
            )}
          </button>

          <p className="mt-4 text-xs text-gray-400 leading-relaxed">
            Depositing ETH allows you to participate in voting (requires minimum balance).
          </p>
        </>
      )}
    </div>
  );
}

