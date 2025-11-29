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
  const [isGasless, setIsGasless] = useState<boolean | null>(null);
  const [blockchainTime, setBlockchainTime] = useState<Date>(new Date());

  useEffect(() => {
    // Load proposal data from localStorage (description and gasless info)
    try {
      const proposalData = JSON.parse(localStorage.getItem("proposalData") || "{}");
      const data = proposalData[proposal.id.toString()];
      if (data) {
        setDescription(data.description || "");
        setIsGasless(data.isGasless !== undefined ? data.isGasless : null);
      } else {
        // Fallback: try old format for backward compatibility
        const descriptions = JSON.parse(localStorage.getItem("proposalDescriptions") || "{}");
        setDescription(descriptions[proposal.id.toString()] || "");
      }
    } catch (error) {
      console.error("Error loading proposal data:", error);
    }
    
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
    Executed: "bg-gradient-to-r from-emerald-600 to-green-600",
    Approved: "bg-gradient-to-r from-indigo-600 to-blue-600",
    Rejected: "bg-gradient-to-r from-red-600 to-rose-600",
    Active: "bg-gradient-to-r from-amber-600 to-yellow-600",
  }[getStatus()];

  return (
    <div className="p-6 md:p-8 glass-effect rounded-2xl card-hover shadow-xl border border-gray-700/50">
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <h3 className="text-xl md:text-2xl font-bold text-white">
              Proposal #{proposal.id.toString()}
            </h3>
            {isGasless !== null && (
              <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                isGasless 
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
              }`}>
                {isGasless ? (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Gasless
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Paid Gas
                  </>
                )}
              </span>
            )}
          </div>
        </div>
        <span className={`px-4 py-1.5 rounded-full text-white text-xs font-semibold uppercase tracking-wider ${statusColor} shadow-lg`}>
          {getStatus()}
        </span>
      </div>

      {/* Description */}
      {description && (
        <div className="mb-5 p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-500/20">
          <p className="text-white font-semibold text-lg">{description}</p>
        </div>
      )}

      {/* Blockchain Time */}
      <div className="mb-5 flex items-center gap-2 text-gray-400 text-xs bg-gray-800/50 px-3 py-2 rounded-lg">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Blockchain Time: {blockchainTime.toLocaleString()}</span>
      </div>

      <div className="space-y-3 mb-6 p-4 bg-gray-800/30 rounded-xl">
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">Amount and Recipient</span>
          <span className="text-white font-semibold">{ethers.formatEther(proposal.amount)} ETH to {proposal.recipient.slice(0, 10)}...</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-gray-700">
          <span className="text-gray-400 text-sm">Deadline</span>
          <span className="text-white font-medium">{deadline.toLocaleString()}</span>
        </div>
      </div>

      {/* Vote Statistics with Bars */}
      <div className="mb-6 p-5 bg-gray-800/50 rounded-xl border border-gray-700/50">
        <div className="mb-4 pb-3 border-b border-gray-700">
          <div className="text-white font-semibold text-sm">Total Votes: <span className="text-indigo-400">{totalVotes}</span></div>
        </div>
        
        {/* For Votes */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              For
            </span>
            <span className="text-white font-medium">{proposal.votesFor.toString()} ({forPercentage.toFixed(1)}%)</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2.5 rounded-full transition-all duration-500 shadow-lg" 
              style={{ width: `${forPercentage}%` }}
            />
          </div>
        </div>

        {/* Against Votes */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-red-400 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              Against
            </span>
            <span className="text-white font-medium">{proposal.votesAgainst.toString()} ({againstPercentage.toFixed(1)}%)</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-red-500 to-red-400 h-2.5 rounded-full transition-all duration-500 shadow-lg" 
              style={{ width: `${againstPercentage}%` }}
            />
          </div>
        </div>

        {/* Abstain Votes */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-amber-400 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              Abstain
            </span>
            <span className="text-white font-medium">{proposal.votesAbstain.toString()} ({abstainPercentage.toFixed(1)}%)</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-amber-500 to-amber-400 h-2.5 rounded-full transition-all duration-500 shadow-lg" 
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
        <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center justify-center gap-2">
          <svg className="animate-spin h-5 w-5 text-amber-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-amber-400 text-sm font-medium">Processing vote... Please wait</span>
        </div>
      )}

      {canExecuteNow && (
        <button
          onClick={() => onExecute(proposal.id)}
          className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl hover:from-emerald-500 hover:to-green-500 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
        >
          Execute Proposal
        </button>
      )}

      {proposal.executed && proposal.executedAt > 0n && (
        <div className="mt-5 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
          <p className="text-emerald-400 text-sm font-medium">
            ✓ Executed at: {new Date(Number(proposal.executedAt) * 1000).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}

