import { ethers } from "ethers";
import { ForwardRequest } from "@/types";

const EIP712_DOMAIN = {
  name: "MinimalForwarder",
  version: "0.0.1",
  chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID || 31337),
  verifyingContract: process.env.NEXT_PUBLIC_FORWARDER_ADDRESS || "",
};

const FORWARD_REQUEST_TYPE = {
  ForwardRequest: [
    { name: "from", type: "address" },
    { name: "to", type: "address" },
    { name: "value", type: "uint256" },
    { name: "gas", type: "uint256" },
    { name: "nonce", type: "uint256" },
    { name: "data", type: "bytes" },
  ],
};

export async function signMetaTransaction(
  provider: ethers.BrowserProvider,
  request: ForwardRequest
): Promise<string> {
  const signer = await provider.getSigner();
  const network = await provider.getNetwork();
  
  const domain = {
    name: EIP712_DOMAIN.name,
    version: EIP712_DOMAIN.version,
    chainId: network.chainId,
    verifyingContract: EIP712_DOMAIN.verifyingContract,
  };

  const message = {
    from: request.from,
    to: request.to,
    value: request.value,
    gas: request.gas,
    nonce: request.nonce,
    data: request.data.startsWith("0x") ? request.data : "0x" + request.data,
  };

  const signature = await signer.signTypedData(domain, FORWARD_REQUEST_TYPE, message);

  return signature;
}

export async function sendToRelayer(
  request: ForwardRequest,
  signature: string
): Promise<string> {
  try {
    const response = await fetch("/api/relay", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        request: {
          ...request,
          value: request.value.toString(),
          gas: request.gas.toString(),
          nonce: request.nonce.toString(),
          data: request.data,
        },
        signature,
      }),
    });

    if (!response.ok) {
      let errorMessage = "Failed to relay transaction";
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (e) {
        // If response is not JSON, use status text
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    if (!result.txHash) {
      throw new Error("No transaction hash returned from relayer");
    }
    return result.txHash;
  } catch (error: any) {
    console.error("sendToRelayer error:", error);
    throw error;
  }
}

