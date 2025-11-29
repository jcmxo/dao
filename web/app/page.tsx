"use client";

import { ConnectWallet } from "@/components/ConnectWallet";
import { FundingPanel } from "@/components/FundingPanel";
import { CreateProposal } from "@/components/CreateProposal";
import { ProposalList } from "@/components/ProposalList";

export default function Home() {
  return (
    <main className="min-h-screen p-6 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 md:mb-12">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                <span className="gradient-text">DAO Voting</span>
              </h1>
              <p className="text-gray-400 text-sm md:text-base">
                Gasless governance powered by meta-transactions
              </p>
            </div>
            <ConnectWallet />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-10">
          <FundingPanel />
          <CreateProposal />
        </div>

        <ProposalList />
      </div>
    </main>
  );
}

