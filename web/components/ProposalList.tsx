"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useWeb3 } from "@/hooks/useWeb3";
import { DAO_ABI } from "@/lib/contracts";
import { Proposal, VoteType } from "@/types";
import { ProposalCard } from "./ProposalCard";
import { signMetaTransaction, sendToRelayer } from "@/lib/metaTransaction";
import { FORWARDER_ABI } from "@/lib/contracts";

export function ProposalList() {
  const { account, provider, isConnected } = useWeb3();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [userVotes, setUserVotes] = useState<Map<bigint, VoteType>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [votingProposalId, setVotingProposalId] = useState<bigint | null>(null);

  const daoAddress = process.env.NEXT_PUBLIC_DAO_ADDRESS || "";
  const forwarderAddress = process.env.NEXT_PUBLIC_FORWARDER_ADDRESS || "";

  const loadProposals = async () => {
    if (!provider || !daoAddress) return;

    setIsLoading(true);
    try {
      const contract = new ethers.Contract(daoAddress, DAO_ABI, provider);
      
      // Load proposals (we'll check up to 100 proposals)
      const loadedProposals: Proposal[] = [];
      
      // First, try to get proposal 1 to check if any exist
      try {
        const firstProposal = await contract.getProposal(1);
        if (firstProposal.id === 0n) {
          // No proposals exist
          setProposals([]);
          setIsLoading(false);
          return;
        }
        loadedProposals.push(firstProposal);
        
        // If we have at least one, try to get more
        for (let i = 2; i <= 100; i++) {
          try {
            const proposal = await contract.getProposal(i);
            if (proposal.id === 0n) break; // No more proposals
            loadedProposals.push(proposal);
          } catch (error) {
            // If error getting proposal, assume no more exist
            break;
          }
        }
      } catch (error: any) {
        // If error getting first proposal, there are no proposals
        console.log("No proposals found:", error.message);
        setProposals([]);
        setIsLoading(false);
        return;
      }
      
      setProposals(loadedProposals);
      
      // Load user votes if connected
      if (account && loadedProposals.length > 0) {
        // Note: We'd need to add a view function to get user vote, or check events
        // For now, we'll track votes client-side after voting
      }
    } catch (error: any) {
      console.error("Error loading proposals:", error);
      setProposals([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected) {
      loadProposals();
      const interval = setInterval(loadProposals, 10000); // Refresh every 10 seconds
      return () => clearInterval(interval);
    }
  }, [isConnected, account, provider]);

  const handleVote = async (proposalId: bigint, voteType: VoteType) => {
    if (!provider || !account || !daoAddress || !forwarderAddress) {
      alert("Missing required configuration. Please check your wallet connection.");
      return;
    }

    // Prevent multiple simultaneous votes
    if (votingProposalId !== null) {
      alert("Please wait for the current vote to complete.");
      return;
    }

    setVotingProposalId(proposalId);

    try {
      // Prepare the vote transaction data
      const daoContract = new ethers.Contract(daoAddress, DAO_ABI, provider);
      const data = daoContract.interface.encodeFunctionData("vote", [proposalId, voteType]);

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
        gas: 100000n,
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
      let txHash;
      try {
        txHash = await sendToRelayer(request, signature);
      } catch (error: any) {
        console.error("Error sending to relayer:", error);
        throw new Error("Failed to relay transaction: " + error.message);
      }

      // Update local state
      setUserVotes(new Map(userVotes.set(proposalId, voteType)));

      alert(`Vote submitted! Transaction: ${txHash}`);
      await loadProposals(); // Refresh proposals
    } catch (error: any) {
      console.error("Error voting:", error);
      const errorMsg = error.message || "Failed to vote";
      alert(`Error: ${errorMsg}\n\nCheck the console (F12) for more details.`);
    } finally {
      setVotingProposalId(null); // Reset voting state
    }
  };

  const handleExecute = async (proposalId: bigint) => {
    if (!provider || !account || !daoAddress) return;

    try {
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(daoAddress, DAO_ABI, signer);
      const tx = await contract.executeProposal(proposalId);
      await tx.wait();
      
      alert("Proposal executed successfully!");
      await loadProposals();
    } catch (error: any) {
      console.error("Error executing proposal:", error);
      alert(error.message || "Failed to execute proposal");
    }
  };

  if (!isConnected) {
    return (
      <div className="p-6 bg-gray-800 rounded-lg">
        <p className="text-white">Please connect your wallet to view proposals</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-800 rounded-lg">
        <p className="text-white">Loading proposals...</p>
      </div>
    );
  }

  if (proposals.length === 0) {
    return (
      <div className="p-6 bg-gray-800 rounded-lg">
        <p className="text-white">No proposals yet. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Proposals</h2>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="gasless-voting-checkbox"
            checked={true}
            disabled={true}
            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
          />
          <label htmlFor="gasless-voting-checkbox" className="text-white text-sm">
            Gasless voting
          </label>
        </div>
      </div>
      {proposals.map((proposal) => (
        <ProposalCard
          key={proposal.id.toString()}
          proposal={proposal}
          userVote={userVotes.get(proposal.id)}
          onVote={handleVote}
          onExecute={handleExecute}
          canExecute={true} // In production, check if user has permission
          userAddress={account}
          isVoting={votingProposalId === proposal.id}
        />
      ))}
    </div>
  );
}

