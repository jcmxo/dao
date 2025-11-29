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
    const baseClass = "px-4 py-2 rounded-lg font-medium transition-colors";
    
    if (disabled) {
      return `${baseClass} bg-gray-800 text-gray-500 cursor-not-allowed opacity-50`;
    }
    
    if (isActive) {
      if (voteType === VoteType.FOR) return `${baseClass} bg-green-600 text-white`;
      if (voteType === VoteType.AGAINST) return `${baseClass} bg-red-600 text-white`;
      return `${baseClass} bg-yellow-600 text-white`;
    }
    
    return `${baseClass} bg-gray-700 text-white hover:bg-gray-600`;
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => !disabled && onVote(proposalId, VoteType.FOR)}
        disabled={disabled}
        className={getButtonClass(VoteType.FOR, currentVote === VoteType.FOR)}
      >
        {currentVote === VoteType.FOR ? "✓ For" : "For"}
      </button>
      <button
        onClick={() => !disabled && onVote(proposalId, VoteType.AGAINST)}
        disabled={disabled}
        className={getButtonClass(VoteType.AGAINST, currentVote === VoteType.AGAINST)}
      >
        {currentVote === VoteType.AGAINST ? "✓ Against" : "Against"}
      </button>
      <button
        onClick={() => !disabled && onVote(proposalId, VoteType.ABSTAIN)}
        disabled={disabled}
        className={getButtonClass(VoteType.ABSTAIN, currentVote === VoteType.ABSTAIN)}
      >
        {currentVote === VoteType.ABSTAIN ? "✓ Abstain" : "Abstain"}
      </button>
    </div>
  );
}

