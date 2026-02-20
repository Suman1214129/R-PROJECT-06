/**
 * algorand.ts — Algorand TestNet helpers
 * Uses AlgoNode public API (no API key needed for TestNet)
 */

import algosdk from "algosdk";

const ALGOD_SERVER = "https://testnet-api.algonode.cloud";
const ALGOD_PORT = "";
const ALGOD_TOKEN = "";

let algodClient: algosdk.Algodv2 | null = null;

export function getAlgodClient(): algosdk.Algodv2 {
     if (!algodClient) {
          algodClient = new algosdk.Algodv2(ALGOD_TOKEN, ALGOD_SERVER, ALGOD_PORT);
     }
     return algodClient;
}

/**
 * Generate TEAL escrow source with seller address baked in.
 * This escrow only approves one transaction: a payment that:
 *   1. Goes to the seller
 *   2. Closes the remainder to the seller (empties account)
 *   3. Has a fee <= 2000 microALGO
 */
export function generateEscrowTEAL(sellerAddr: string): string {
     return `#pragma version 8
// Escrow for CampusSwap order
// Only approves release to seller: ${sellerAddr}

// Must be a pay transaction
txn TypeEnum
int pay
==

// Receiver must be the seller
txn Receiver
addr ${sellerAddr}
==
&&

// Close remainder to seller (drain all ALGO)
txn CloseRemainderTo
addr ${sellerAddr}
==
&&

// Fee must be reasonable
txn Fee
int 2000
<=
&&
`;
}

/**
 * Compile TEAL source via AlgoNode API.
 * Returns base64-encoded compiled program and the escrow address.
 */
export async function compileEscrow(
     sellerAddr: string
): Promise<{ address: string; programBase64: string }> {
     const teal = generateEscrowTEAL(sellerAddr);
     const client = getAlgodClient();

     const compiled = await client.compile(teal).do();
     const programBase64: string = compiled.result;
     const programBytes = new Uint8Array(Buffer.from(programBase64, "base64"));

     // Derive the contract account address from the compiled program
     const lsig = new algosdk.LogicSigAccount(programBytes);
     const address = lsig.address().toString();

     return { address, programBase64 };
}

/**
 * Build an unsigned payment transaction from buyer → escrow address.
 * The buyer must sign this with Pera Wallet.
 */
export async function buildPaymentToEscrow(
     buyerAddr: string,
     escrowAddr: string,
     algoAmount: number
): Promise<algosdk.Transaction> {
     const client = getAlgodClient();
     const params = await client.getTransactionParams().do();

     const microAlgo = Math.round(algoAmount * 1_000_000);

     return algosdk.makePaymentTxnWithSuggestedParamsFromObject({
          sender: buyerAddr,
          receiver: escrowAddr,
          amount: microAlgo,
          suggestedParams: params,
     });
}

/**
 * Build the release transaction: escrow → seller.
 * Signed by the LogicSig (no human key needed).
 * Broadcasts and returns the transaction ID.
 */
export async function releaseEscrowToSeller(
     escrowAddr: string,
     programBase64: string,
     sellerAddr: string
): Promise<string> {
     const client = getAlgodClient();
     const params = await client.getTransactionParams().do();

     // Check escrow balance
     const accountInfo = await client.accountInformation(escrowAddr).do();
     const balance = Number(accountInfo.amount as bigint | number);

     if (balance < 2000) {
          throw new Error(`Escrow has insufficient balance: ${balance} microALGO`);
     }

     const programBytes = new Uint8Array(Buffer.from(programBase64, "base64"));
     const lsig = new algosdk.LogicSigAccount(programBytes);

     // Build payment with closeRemainderTo to drain all ALGO to seller
     const releaseTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
          sender: escrowAddr,
          receiver: sellerAddr,
          amount: 0, // CloseRemainderTo drains everything
          closeRemainderTo: sellerAddr,
          suggestedParams: { ...params, fee: 2000, minFee: 2000, flatFee: true },
     });

     const signedTxn = algosdk.signLogicSigTransactionObject(releaseTxn, lsig);
     const { txid } = await client.sendRawTransaction(signedTxn.blob).do();

     // Wait for confirmation
     await algosdk.waitForConfirmation(client, txid, 5);

     return txid;
}

/**
 * Refund the escrow back to the buyer.
 * Signed by the LogicSig — closes all remaining ALGO to the buyer.
 * Used when buyer cancels a paid order.
 */
export async function refundEscrowToBuyer(
     escrowAddr: string,
     programBase64: string,
     buyerAddr: string
): Promise<string> {
     const client = getAlgodClient();
     const params = await client.getTransactionParams().do();

     // Check escrow balance
     const accountInfo = await client.accountInformation(escrowAddr).do();
     const balance = Number(accountInfo.amount as bigint | number);

     if (balance < 2000) {
          throw new Error(`Escrow has insufficient balance to refund: ${balance} microALGO`);
     }

     const programBytes = new Uint8Array(Buffer.from(programBase64, "base64"));
     const lsig = new algosdk.LogicSigAccount(programBytes);

     // Close all ALGO back to buyer
     const refundTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
          sender: escrowAddr,
          receiver: buyerAddr,
          amount: 0, // CloseRemainderTo drains everything
          closeRemainderTo: buyerAddr,
          suggestedParams: { ...params, fee: 2000, minFee: 2000, flatFee: true },
     });

     const signedTxn = algosdk.signLogicSigTransactionObject(refundTxn, lsig);
     const { txid } = await client.sendRawTransaction(signedTxn.blob).do();

     await algosdk.waitForConfirmation(client, txid, 5);

     return txid;
}

/**
 * Fetch ALGO balance for an address (in ALGO, not microALGO).
 */
export async function getAlgoBalance(address: string): Promise<number> {
     try {
          const client = getAlgodClient();
          const info = await client.accountInformation(address).do();
          return Number(info.amount as bigint | number) / 1_000_000;
     } catch {
          return 0;
     }
}
