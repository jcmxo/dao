"use client";

import { ConnectWallet } from "@/components/ConnectWallet";
import { FundingPanel } from "@/components/FundingPanel";
import { CreateProposal } from "@/components/CreateProposal";
import { ProposalList } from "@/components/ProposalList";

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold text-white">DAO Voting</h1>
            <ConnectWallet />
          </div>
          <p className="text-gray-400 mt-2">Gasless governance powered by meta-transactions</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <FundingPanel />
          <CreateProposal />
        </div>

        <ProposalList />
      </div>
    </main>
  );
}

