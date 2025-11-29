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
      <div className="p-8 glass-effect rounded-2xl card-hover shadow-xl">
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-500/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <p className="text-gray-300 font-medium">Please connect your wallet to view proposals</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-8 glass-effect rounded-2xl shadow-xl">
        <div className="text-center py-12">
          <svg className="animate-spin h-8 w-8 text-indigo-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-300 font-medium">Loading proposals...</p>
        </div>
      </div>
    );
  }

  if (proposals.length === 0) {
    return (
      <div className="p-8 glass-effect rounded-2xl card-hover shadow-xl border border-gray-700/50">
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center">
            <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-300 font-medium text-lg mb-2">No proposals yet</p>
          <p className="text-gray-400 text-sm">Create one to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
          <span className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></span>
          Proposals
        </h2>
        <div className="flex items-center gap-3 px-4 py-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
          <input
            type="checkbox"
            id="gasless-voting-checkbox"
            checked={true}
            disabled={true}
            className="w-5 h-5 text-indigo-600 bg-gray-800 border-gray-600 rounded focus:ring-indigo-500 focus:ring-2 cursor-not-allowed"
          />
          <label htmlFor="gasless-voting-checkbox" className="text-white text-sm font-medium">
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

