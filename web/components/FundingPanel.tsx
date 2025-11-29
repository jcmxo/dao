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
      <div className="p-6 bg-gray-800 rounded-lg">
        <p className="text-white">Please connect your wallet to fund the DAO</p>
      </div>
    );
  }

  const userBalanceNum = parseFloat(userBalance);
  const totalBalanceNum = parseFloat(totalBalance);
  const userPercentage = totalBalanceNum > 0 
    ? ((userBalanceNum / totalBalanceNum) * 100).toFixed(2)
    : "0.00";

  return (
    <div className="p-6 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold text-white mb-4">DAO Treasury</h2>
      
      {/* Treasury Balance - Prominent */}
      <div className="mb-6">
        <div className="text-gray-400 text-sm mb-1">Treasury Balance</div>
        <div className="text-3xl font-bold text-blue-400">{totalBalanceNum.toFixed(4)} ETH</div>
      </div>

      {/* Total Proposals */}
      <div className="mb-6 p-3 bg-gray-700 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Total Proposals</span>
          <span className="text-2xl font-bold text-green-400">{totalProposals}</span>
        </div>
      </div>

      {/* Your Balance in DAO */}
      {isConnected && (
        <div className="mb-6 p-3 bg-purple-900/30 rounded-lg border border-purple-500/30">
          <div className="text-gray-300 text-sm mb-1">Your Balance in DAO</div>
          <div className="text-xl font-bold text-purple-400">{userBalanceNum.toFixed(4)} ETH</div>
          <div className="text-gray-400 text-sm mt-1">{userPercentage}% of total</div>
        </div>
      )}

      {/* Deposit Section */}
      {isConnected && (
        <>
          <div className="mb-4">
            <label className="block text-white mb-2">Deposit ETH to DAO</label>
            <input
              type="number"
              step="0.001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.0"
            />
          </div>

          <button
            onClick={handleFund}
            disabled={isLoading || !amount}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? "Processing..." : "Deposit to DAO"}
          </button>

          <p className="mt-3 text-sm text-gray-400">
            Depositing ETH allows you to participate in voting (requires minimum balance).
          </p>
        </>
      )}
    </div>
  );
}

