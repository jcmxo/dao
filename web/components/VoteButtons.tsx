"use client";

import { VoteType } from "@/types";

interface VoteButtonsProps {
  proposalId: bigint;
  currentVote?: VoteType | null;
  onVote: (proposalId: bigint, voteType: VoteType) => Promise<void>;
  disabled?: boolean;
}

export function VoteButtons({ proposalId, currentVote, onVote, disabled = false }: VoteButtonsProps) {
  const getButtonClass = (voteType: VoteType, isActive: boolean) => {
    const baseClass = "px-5 py-3 rounded-xl font-semibold transition-all duration-200 transform";
    
    if (disabled) {
      return `${baseClass} bg-gray-800/50 text-gray-500 cursor-not-allowed opacity-50 border border-gray-700`;
    }
    
    if (isActive) {
      if (voteType === VoteType.FOR) {
        return `${baseClass} bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg border-2 border-emerald-400`;
      }
      if (voteType === VoteType.AGAINST) {
        return `${baseClass} bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg border-2 border-red-400`;
      }
      return `${baseClass} bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-lg border-2 border-amber-400`;
    }
    
    return `${baseClass} bg-gray-800/50 text-white hover:bg-gray-700/80 border border-gray-700 hover:border-gray-600 hover:scale-105`;
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={() => !disabled && onVote(proposalId, VoteType.FOR)}
        disabled={disabled}
        className={getButtonClass(VoteType.FOR, currentVote === VoteType.FOR)}
      >
        {currentVote === VoteType.FOR ? (
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            For
          </span>
        ) : (
          "For"
        )}
      </button>
      <button
        onClick={() => !disabled && onVote(proposalId, VoteType.AGAINST)}
        disabled={disabled}
        className={getButtonClass(VoteType.AGAINST, currentVote === VoteType.AGAINST)}
      >
        {currentVote === VoteType.AGAINST ? (
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Against
          </span>
        ) : (
          "Against"
        )}
      </button>
      <button
        onClick={() => !disabled && onVote(proposalId, VoteType.ABSTAIN)}
        disabled={disabled}
        className={getButtonClass(VoteType.ABSTAIN, currentVote === VoteType.ABSTAIN)}
      >
        {currentVote === VoteType.ABSTAIN ? (
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Abstain
          </span>
        ) : (
          "Abstain"
        )}
      </button>
    </div>
  );
}

