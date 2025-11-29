"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useWeb3 } from "@/hooks/useWeb3";
import { DAO_ABI } from "@/lib/contracts";

export function CreateProposal() {
  const { account, provider, isConnected } = useWeb3();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [votingDuration, setVotingDuration] = useState("7"); // Default 7 days
  const [description, setDescription] = useState("");
  const [canCreate, setCanCreate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const daoAddress = process.env.NEXT_PUBLIC_DAO_ADDRESS || "";

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
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(daoAddress, DAO_ABI, signer);
      const tx = await contract.createProposal(recipient, amountWei, deadlineTimestamp);
      const receipt = await tx.wait();
      
      // Get the proposal ID from events
      let proposalId: bigint | null = null;
      
      // Try to get ID from event
      for (const log of receipt.logs) {
        try {
          const parsed = contract.interface.parseLog(log);
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
          const nextId = await contract.nextProposalId();
          proposalId = nextId - 1n;
        } catch (error) {
          console.error("Error getting proposal ID:", error);
        }
      }

      // Store description in localStorage
      if (proposalId && description.trim()) {
        try {
          const descriptions = JSON.parse(localStorage.getItem("proposalDescriptions") || "{}");
          descriptions[proposalId.toString()] = description.trim();
          localStorage.setItem("proposalDescriptions", JSON.stringify(descriptions));
        } catch (error) {
          console.error("Error saving description:", error);
        }
      }
      
      setRecipient("");
      setAmount("");
      setVotingDuration("7");
      setDescription("");
      alert("Proposal created successfully!");
    } catch (error: any) {
      console.error("Error creating proposal:", error);
      alert(error.message || "Failed to create proposal");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="p-6 bg-gray-800 rounded-lg">
        <p className="text-white">Please connect your wallet to create a proposal</p>
      </div>
    );
  }

  if (!canCreate) {
    return (
      <div className="p-6 bg-gray-800 rounded-lg">
        <p className="text-yellow-400">
          You need at least 10% of the total DAO balance to create a proposal
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold text-white mb-4">Create Proposal</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-white mb-2">Recipient Address</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0x..."
          />
        </div>

        <div>
          <label className="block text-white mb-2">Amount (ETH)</label>
          <input
            type="number"
            step="0.001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.0"
          />
        </div>

        <div>
          <label className="block text-white mb-2">Voting Duration (days)</label>
          <input
            type="number"
            min="1"
            value={votingDuration}
            onChange={(e) => setVotingDuration(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="7"
          />
        </div>

        <div>
          <label className="block text-white mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Describe your proposal..."
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="gasless-checkbox"
            checked={true}
            disabled={true}
            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
          />
          <label htmlFor="gasless-checkbox" className="text-white text-sm">
            Use gasless transaction (relayer pays gas)
          </label>
        </div>

        <button
          onClick={handleCreate}
          disabled={isLoading || !recipient || !amount || !votingDuration}
          className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isLoading ? "Creating..." : "Create Proposal (Gasless)"}
        </button>

        <p className="text-xs text-gray-400 mt-2">
          Note: You need at least 10% of the DAO contract balance to create a proposal
        </p>
      </div>
    </div>
  );
}

