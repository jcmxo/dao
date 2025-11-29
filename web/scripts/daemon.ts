#!/usr/bin/env node

/**
 * Daemon to automatically execute approved proposals
 * Run this as a background process or cron job
 */

import { ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const daoAddress = process.env.NEXT_PUBLIC_DAO_ADDRESS || "";
const relayerPrivateKey = process.env.RELAYER_PRIVATE_KEY || "";
const rpcUrl = process.env.RPC_URL || "http://127.0.0.1:8545";
const intervalSeconds = parseInt(process.env.DAEMON_INTERVAL_SECONDS || "60");

const DAO_ABI = [
  "function getProposal(uint256 proposalId) external view returns (tuple(uint256 id, address recipient, uint256 amount, uint256 deadline, uint256 votesFor, uint256 votesAgainst, uint256 votesAbstain, bool executed, uint256 executedAt))",
  "function executeProposal(uint256 proposalId) external",
] as const;

async function checkAndExecuteProposals() {
  if (!relayerPrivateKey || !daoAddress) {
    console.error("Configuration missing. Please check .env.local");
    return;
  }

  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const relayerWallet = new ethers.Wallet(relayerPrivateKey, provider);
    const daoContract = new ethers.Contract(daoAddress, DAO_ABI, relayerWallet);

    console.log(`[${new Date().toISOString()}] Checking proposals...`);

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
          console.log(`[${new Date().toISOString()}] Executing proposal ${i}...`);
          try {
            const tx = await daoContract.executeProposal(i);
            console.log(`[${new Date().toISOString()}] Transaction sent: ${tx.hash}`);
            const receipt = await tx.wait();
            console.log(`[${new Date().toISOString()}] Proposal ${i} executed successfully in block ${receipt.blockNumber}`);
          } catch (error: any) {
            console.error(`[${new Date().toISOString()}] Failed to execute proposal ${i}:`, error.message);
          }
        }
      } catch (error) {
        break; // No more proposals
      }
    }
  } catch (error: any) {
    console.error(`[${new Date().toISOString()}] Error checking proposals:`, error.message);
  }
}

// Run immediately, then on interval
checkAndExecuteProposals();
setInterval(checkAndExecuteProposals, intervalSeconds * 1000);

console.log(`Daemon started. Checking every ${intervalSeconds} seconds...`);

