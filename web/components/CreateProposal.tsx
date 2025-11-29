"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useWeb3 } from "@/hooks/useWeb3";
import { DAO_ABI, FORWARDER_ABI } from "@/lib/contracts";
import { signMetaTransaction, sendToRelayer } from "@/lib/metaTransaction";

export function CreateProposal() {
  const { account, provider, isConnected } = useWeb3();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [votingDuration, setVotingDuration] = useState("7"); // Default 7 days
  const [description, setDescription] = useState("");
  const [canCreate, setCanCreate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [useGasless, setUseGasless] = useState(true); // Default: gasless enabled

  const daoAddress = process.env.NEXT_PUBLIC_DAO_ADDRESS || "";
  const forwarderAddress = process.env.NEXT_PUBLIC_FORWARDER_ADDRESS || "";

  useEffect(() => {
    const checkCanCreate = async () => {
      if (!provider || !account || !daoAddress) {
        setCanCreate(false);
        return;
      }

      try {
        const contract = new ethers.Contract(daoAddress, DAO_ABI, provider);
        const canCreateProposal = await contract.canCreateProposal(account);
        setCanCreate(canCreateProposal);
      } catch (error) {
        console.error("Error checking if can create proposal:", error);
        setCanCreate(false);
      }
    };

    if (isConnected) {
      checkCanCreate();
    }
  }, [isConnected, account, provider]);

  const handleCreate = async () => {
    if (!provider || !account || !daoAddress) return;

    if (!ethers.isAddress(recipient)) {
      alert("Invalid recipient address");
      return;
    }

    const amountWei = ethers.parseEther(amount);
    if (amountWei <= 0n) {
      alert("Please enter a valid amount");
      return;
    }

    const days = parseInt(votingDuration);
    if (isNaN(days) || days <= 0) {
      alert("Please enter a valid number of days (must be greater than 0)");
      return;
    }

    // Calculate deadline: current time + days in seconds
    const deadlineTimestamp = Math.floor(Date.now() / 1000) + (days * 24 * 60 * 60);

    setIsLoading(true);
    try {
      const daoContract = new ethers.Contract(daoAddress, DAO_ABI, provider);
      let proposalId: bigint | null = null;
      let txHash: string = "";

      if (useGasless) {
        // GASLESS: Use meta-transaction (no gas cost for user)
        console.log("Creating proposal via gasless transaction...");
        
        const data = daoContract.interface.encodeFunctionData("createProposal", [recipient, amountWei, deadlineTimestamp]);

        // Get nonce from forwarder
        const forwarderContract = new ethers.Contract(forwarderAddress, FORWARDER_ABI, provider);
        let nonce;
        try {
          nonce = await forwarderContract.getNonce(account);
        } catch (error: any) {
          console.error("Error getting nonce:", error);
          throw new Error("Failed to get nonce from forwarder: " + error.message);
        }

        // Create forward request
        const request = {
          from: account,
          to: daoAddress,
          value: 0n,
          gas: 200000n, // More gas for creating proposals
          nonce: nonce,
          data: data,
        };

        // Sign meta-transaction
        let signature;
        try {
          signature = await signMetaTransaction(provider, request);
        } catch (error: any) {
          console.error("Error signing meta-transaction:", error);
          throw new Error("Failed to sign transaction: " + error.message);
        }

        // Send to relayer
        try {
          txHash = await sendToRelayer(request, signature);
        } catch (error: any) {
          console.error("Error sending to relayer:", error);
          throw new Error("Failed to relay transaction: " + error.message);
        }

        // Wait a bit for the transaction to be mined
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Try to get proposal ID
        try {
          const nextId = await daoContract.nextProposalId();
          proposalId = nextId - 1n;
        } catch (error) {
          console.error("Error getting proposal ID:", error);
        }
      } else {
        // NORMAL: Use regular transaction (user pays gas)
        console.log("Creating proposal via regular transaction (user pays gas)...");
        
        const signer = await provider.getSigner();
        const contractWithSigner = new ethers.Contract(daoAddress, DAO_ABI, signer);
        const tx = await contractWithSigner.createProposal(recipient, amountWei, deadlineTimestamp);
        txHash = tx.hash;
        const receipt = await tx.wait();
        
        // Get the proposal ID from events
        for (const log of receipt.logs) {
          try {
            const parsed = contractWithSigner.interface.parseLog(log);
            if (parsed && parsed.name === "ProposalCreated") {
              proposalId = parsed.args[0];
              break;
            }
          } catch {
            // Continue searching
          }
        }
        
        // Fallback: get nextId and subtract 1
        if (!proposalId) {
          try {
            const nextId = await daoContract.nextProposalId();
            proposalId = nextId - 1n;
          } catch (error) {
            console.error("Error getting proposal ID:", error);
          }
        }
      }

      // Store description and gasless info in localStorage
      if (proposalId) {
        try {
          const proposalData = JSON.parse(localStorage.getItem("proposalData") || "{}");
          proposalData[proposalId.toString()] = {
            description: description.trim() || "",
            isGasless: useGasless,
          };
          localStorage.setItem("proposalData", JSON.stringify(proposalData));
        } catch (error) {
          console.error("Error saving proposal data:", error);
        }
      }
      
      setRecipient("");
      setAmount("");
      setVotingDuration("7");
      setDescription("");
      
      const gaslessMessage = useGasless ? " (Gasless - no gas cost)" : " (You paid gas)";
      alert(`Proposal created successfully! Transaction: ${txHash}${gaslessMessage}\n\nYour proposal will appear shortly.`);
    } catch (error: any) {
      console.error("Error creating proposal:", error);
      const errorMessage = error.message || "Failed to create proposal";
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
          <p className="text-gray-300 font-medium">Please connect your wallet to create a proposal</p>
        </div>
      </div>
    );
  }

  if (!canCreate) {
    return (
      <div className="p-6 md:p-8 glass-effect rounded-2xl card-hover shadow-xl border border-amber-500/20">
        <div className="flex items-start gap-3 p-4 bg-amber-500/10 rounded-xl">
          <svg className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-amber-400 font-medium">
            You need at least 10% of the total DAO balance to create a proposal
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 glass-effect rounded-2xl card-hover shadow-xl">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-2">
        <span className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></span>
        Create Proposal
      </h2>
      
      <div className="space-y-5">
        <div>
          <label className="block text-white mb-2 font-medium text-sm">Recipient Address</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-500 font-mono text-sm"
            placeholder="0x..."
          />
        </div>

        <div>
          <label className="block text-white mb-2 font-medium text-sm">Amount (ETH)</label>
          <input
            type="number"
            step="0.001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-500"
            placeholder="0.0"
          />
        </div>

        <div>
          <label className="block text-white mb-2 font-medium text-sm">Voting Duration (days)</label>
          <input
            type="number"
            min="1"
            value={votingDuration}
            onChange={(e) => setVotingDuration(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-500"
            placeholder="7"
          />
        </div>

        <div>
          <label className="block text-white mb-2 font-medium text-sm">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all placeholder-gray-500"
            placeholder="Describe your proposal..."
          />
        </div>

        <div className="flex items-center gap-3 p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20 hover:bg-indigo-500/15 transition-colors">
          <input
            type="checkbox"
            id="gasless-checkbox"
            checked={useGasless}
            onChange={(e) => setUseGasless(e.target.checked)}
            className="w-5 h-5 text-indigo-600 bg-gray-800 border-gray-600 rounded focus:ring-indigo-500 focus:ring-2 cursor-pointer"
          />
          <label htmlFor="gasless-checkbox" className="text-white text-sm font-medium flex-1 cursor-pointer">
            {useGasless 
              ? "Gasless transaction (free - relayer pays gas)" 
              : "Regular transaction (you pay gas)"}
          </label>
        </div>
        
        {!useGasless && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <p className="text-amber-400 text-xs flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              You will pay gas fees when creating this proposal. Make sure you have enough ETH in your wallet.
            </p>
          </div>
        )}

        <button
          onClick={handleCreate}
          disabled={isLoading || !recipient || !amount || !votingDuration}
          className={`w-full px-6 py-3 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 ${
            useGasless 
              ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500"
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating...
            </span>
          ) : (
            useGasless ? "Create Proposal" : "Create Proposal & Pay Gas"
          )}
        </button>

        <p className="text-xs text-gray-400 mt-3 leading-relaxed">
          Note: You need at least 10% of the DAO contract balance to create a proposal
        </p>
      </div>
    </div>
  );
}

