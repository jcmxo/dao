import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import { DAO_ABI } from "@/lib/contracts";

const daoAddress = process.env.NEXT_PUBLIC_DAO_ADDRESS || "";
const relayerPrivateKey = process.env.RELAYER_PRIVATE_KEY || "";
const rpcUrl = process.env.RPC_URL || "http://127.0.0.1:8545";

export async function POST(request: NextRequest) {
  try {
    // This endpoint can be called by a cron job or daemon
    if (!relayerPrivateKey || !daoAddress) {
      return NextResponse.json(
        { error: "Configuration missing" },
        { status: 500 }
      );
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const relayerWallet = new ethers.Wallet(relayerPrivateKey, provider);
    const daoContract = new ethers.Contract(daoAddress, DAO_ABI, relayerWallet);

    const executed: string[] = [];

    // Check proposals (up to 100)
    for (let i = 1; i <= 100; i++) {
      try {
        const proposal = await daoContract.getProposal(i);
        
        if (proposal.id === 0n) break; // No more proposals

        // Check if proposal can be executed
        const deadline = Number(proposal.deadline);
        const currentTime = Math.floor(Date.now() / 1000);
        const securityPeriod = 24 * 60 * 60; // 24 hours in seconds
        const hasPassed = proposal.votesFor > proposal.votesAgainst;
        const canExecute = 
          !proposal.executed &&
          currentTime >= deadline + securityPeriod &&
          hasPassed;

        if (canExecute) {
          try {
            const tx = await daoContract.executeProposal(i);
            const receipt = await tx.wait();
            executed.push(`Proposal ${i}: ${receipt.hash}`);
          } catch (error: any) {
            console.error(`Failed to execute proposal ${i}:`, error);
          }
        }
      } catch (error) {
        break; // No more proposals
      }
    }

    return NextResponse.json({
      success: true,
      executed: executed.length,
      transactions: executed,
    });
  } catch (error: any) {
    console.error("Execution daemon error:", error);
    return NextResponse.json(
      { error: "Internal server error: " + error.message },
      { status: 500 }
    );
  }
}

