"use client";

import { Proposal, VoteType } from "@/types";
import { ethers } from "ethers";
import { VoteButtons } from "./VoteButtons";
import { useEffect, useState } from "react";

interface ProposalCardProps {
  proposal: Proposal;
  userVote?: VoteType | null;
  onVote: (proposalId: bigint, voteType: VoteType) => Promise<void>;
  onExecute: (proposalId: bigint) => Promise<void>;
  canExecute: boolean;
  userAddress?: string | null;
  isVoting?: boolean;
}

export function ProposalCard({
  proposal,
  userVote,
  onVote,
  onExecute,
  canExecute,
  userAddress,
  isVoting = false,
}: ProposalCardProps) {
  const [description, setDescription] = useState<string>("");
  const [blockchainTime, setBlockchainTime] = useState<Date>(new Date());

  useEffect(() => {
    // Load description from localStorage
    const descriptions = JSON.parse(localStorage.getItem("proposalDescriptions") || "{}");
    setDescription(descriptions[proposal.id.toString()] || "");
    
    // Update blockchain time every second
    const interval = setInterval(() => {
      setBlockchainTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, [proposal.id]);

  const deadline = new Date(Number(proposal.deadline) * 1000);
  const isActive = deadline > new Date() && !proposal.executed;
  const isPassed = proposal.votesFor > proposal.votesAgainst;
  const canExecuteNow =
    deadline <= new Date() &&
    isPassed &&
    !proposal.executed &&
    canExecute;

  // Calculate vote statistics
  const totalVotes = Number(proposal.votesFor) + Number(proposal.votesAgainst) + Number(proposal.votesAbstain);
  const forPercentage = totalVotes > 0 ? (Number(proposal.votesFor) / totalVotes) * 100 : 0;
  const againstPercentage = totalVotes > 0 ? (Number(proposal.votesAgainst) / totalVotes) * 100 : 0;
  const abstainPercentage = totalVotes > 0 ? (Number(proposal.votesAbstain) / totalVotes) * 100 : 0;

  const getStatus = () => {
    if (proposal.executed) return "Executed";
    if (!isActive && isPassed) return "Approved";
    if (!isActive && !isPassed) return "Rejected";
    return "Active";
  };

  const statusColor = {
    Executed: "bg-green-600",
    Approved: "bg-blue-600",
    Rejected: "bg-red-600",
    Active: "bg-yellow-600",
  }[getStatus()];

  return (
    <div className="p-6 bg-gray-800 rounded-lg">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white">Proposal #{proposal.id.toString()}</h3>
        <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${statusColor}`}>
          {getStatus()}
        </span>
      </div>

      {/* Description */}
      {description && (
        <div className="mb-4 p-3 bg-gray-700 rounded-lg">
          <p className="text-white font-medium">{description}</p>
        </div>
      )}

      {/* Blockchain Time */}
      <div className="mb-4 flex items-center gap-2 text-gray-400 text-sm">
        <span>🕐</span>
        <span>Blockchain Time: {blockchainTime.toLocaleString()}</span>
        <span className="text-gray-500">({Math.floor(blockchainTime.getTime() / 1000)})</span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-white">
          <span>Amount and Recipient:</span>
          <span className="font-bold">{ethers.formatEther(proposal.amount)} ETH to {proposal.recipient.slice(0, 10)}...</span>
        </div>
        <div className="flex justify-between text-white">
          <span>Deadline:</span>
          <span>{deadline.toLocaleString()}</span>
        </div>
      </div>

      {/* Vote Statistics with Bars */}
      <div className="mb-4 p-4 bg-gray-700 rounded-lg">
        <div className="mb-3">
          <div className="text-white font-medium mb-1">Total Votes: {totalVotes}</div>
        </div>
        
        {/* For Votes */}
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-green-400 font-medium">For</span>
            <span className="text-white">{proposal.votesFor.toString()} ({forPercentage.toFixed(1)}%)</span>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${forPercentage}%` }}
            />
          </div>
        </div>

        {/* Against Votes */}
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-red-400 font-medium">Against</span>
            <span className="text-white">{proposal.votesAgainst.toString()} ({againstPercentage.toFixed(1)}%)</span>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-2">
            <div 
              className="bg-red-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${againstPercentage}%` }}
            />
          </div>
        </div>

        {/* Abstain Votes */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-yellow-400 font-medium">Abstain</span>
            <span className="text-white">{proposal.votesAbstain.toString()} ({abstainPercentage.toFixed(1)}%)</span>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-2">
            <div 
              className="bg-yellow-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${abstainPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {userAddress && isActive && (
        <VoteButtons
          proposalId={proposal.id}
          currentVote={userVote}
          onVote={onVote}
          disabled={isVoting}
        />
      )}
      
      {isVoting && (
        <div className="mt-2 text-sm text-yellow-400 text-center">
          ⏳ Processing vote... Please wait
        </div>
      )}

      {canExecuteNow && (
        <button
          onClick={() => onExecute(proposal.id)}
          className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
        >
          Execute Proposal
        </button>
      )}

      {proposal.executed && proposal.executedAt > 0n && (
        <div className="mt-4 text-sm text-gray-400">
          Executed at: {new Date(Number(proposal.executedAt) * 1000).toLocaleString()}
        </div>
      )}
    </div>
  );
}

