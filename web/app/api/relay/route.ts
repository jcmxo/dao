import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import { FORWARDER_ABI } from "@/lib/contracts";

const forwarderAddress = process.env.NEXT_PUBLIC_FORWARDER_ADDRESS || "";
const relayerPrivateKey = process.env.RELAYER_PRIVATE_KEY || "";
const rpcUrl = process.env.RPC_URL || "http://127.0.0.1:8545";

export async function POST(request: NextRequest) {
  try {
    if (!relayerPrivateKey) {
      return NextResponse.json(
        { error: "Relayer not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { request: forwardRequest, signature } = body;

    // Validate request
    if (!forwardRequest || !signature) {
      return NextResponse.json(
        { error: "Missing request or signature" },
        { status: 400 }
      );
    }

    // Connect to blockchain
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const relayerWallet = new ethers.Wallet(relayerPrivateKey, provider);

    // Connect to forwarder contract
    const forwarder = new ethers.Contract(
      forwarderAddress,
      FORWARDER_ABI,
      relayerWallet
    );

    // Convert request to proper format
    const req = {
      from: forwardRequest.from,
      to: forwardRequest.to,
      value: BigInt(forwardRequest.value),
      gas: BigInt(forwardRequest.gas),
      nonce: BigInt(forwardRequest.nonce),
      data: forwardRequest.data,
    };

    // Verify the request first
    try {
      const isValid = await forwarder.verify(req, signature);
      if (!isValid) {
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 400 }
        );
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      return NextResponse.json(
        { error: "Verification failed: " + error.message },
        { status: 400 }
      );
    }

    // Execute the meta-transaction
    try {
      const tx = await forwarder.execute(req, signature, {
        gasLimit: BigInt(forwardRequest.gas) + 50000n, // Add buffer
      });

      const receipt = await tx.wait();

      return NextResponse.json({
        success: true,
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber,
      });
    } catch (error: any) {
      console.error("Execution error:", error);
      return NextResponse.json(
        { error: "Execution failed: " + error.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Relayer error:", error);
    return NextResponse.json(
      { error: "Internal server error: " + error.message },
      { status: 500 }
    );
  }
}

