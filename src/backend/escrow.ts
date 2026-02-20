/**
 * escrow.ts — CampusSwap escrow order orchestration
 */

import { compileEscrow, buildPaymentToEscrow, releaseEscrowToSeller, refundEscrowToBuyer } from "./algorand";
import { createOrder, setOrderCompleted, cancelOrder, getOrder } from "./firestore";

/**
 * Generate a random 9-digit delivery code.
 */
export function generateDeliveryCode(): string {
     return Math.floor(100_000_000 + Math.random() * 900_000_000).toString();
}

/**
 * Build the delivery-confirmation QR payload (shown by seller, scanned by buyer to confirm receipt).
 * Format: campusswap:confirm:{orderId}:{deliveryCode}
 */
export function buildQRPayload(orderId: string, deliveryCode: string): string {
     return `campusswap:confirm:${orderId}:${deliveryCode}`;
}

/**
 * Parse a scanned delivery-confirmation QR string.
 * Returns null if the format doesn't match.
 */
export function parseQRPayload(
     raw: string
): { orderId: string; deliveryCode: string } | null {
     const prefix = "campusswap:confirm:";
     if (!raw.startsWith(prefix)) return null;

     const rest = raw.slice(prefix.length);
     const parts = rest.split(":");
     if (parts.length !== 2) return null;

     const [orderId, deliveryCode] = parts;
     if (!orderId || !deliveryCode) return null;

     return { orderId, deliveryCode };
}

/**
 * Build the PAYMENT RELEASE QR payload — embedded in the wallet QR the seller shows.
 * When buyer scans this, it triggers automatic escrow release to seller.
 * Format: campusswap:pay:{orderId}:{sellerAddress}
 */
export function buildPaymentQRPayload(orderId: string, sellerAddress: string): string {
     return `campusswap:pay:${orderId}:${sellerAddress}`;
}

/**
 * Parse a scanned payment-release QR string.
 * Returns null if the format doesn't match.
 */
export function parsePaymentQRPayload(
     raw: string
): { orderId: string; sellerAddress: string } | null {
     const prefix = "campusswap:pay:";
     if (!raw.startsWith(prefix)) return null;

     const rest = raw.slice(prefix.length);
     // sellerAddress contains colons in base32 — split only on first colon
     const colonIdx = rest.indexOf(":");
     if (colonIdx === -1) return null;

     const orderId = rest.slice(0, colonIdx);
     const sellerAddress = rest.slice(colonIdx + 1);
     if (!orderId || !sellerAddress) return null;

     return { orderId, sellerAddress };
}

/**
 * Build a listing-link QR payload for the home scanner.
 * Format: campusswap:listing:{listingId}
 */
export function buildListingQRPayload(listingId: string): string {
     return `campusswap:listing:${listingId}`;
}

/**
 * Parse a listing-link QR string.
 */
export function parseListingQRPayload(raw: string): { listingId: string } | null {
     const prefix = "campusswap:listing:";
     if (!raw.startsWith(prefix)) return null;
     const listingId = raw.slice(prefix.length);
     return listingId ? { listingId } : null;
}

export interface InitEscrowResult {
     orderId: string;
     escrowAddress: string;
     deliveryCode: string;
     /** Unsigned txn bytes (base64) — pass to Pera Wallet for signing */
     unsignedTxnBase64: string;
}

/**
 * Initialise an escrow order:
 * 1. Compile TEAL → get escrow address
 * 2. Generate 9-digit delivery code
 * 3. Build unsigned payment txn for buyer to sign via Pera Wallet
 * 4. Persist order in Firestore (status = 'pending', fills in after payment)
 */
export async function initEscrowOrder(params: {
     listingId: string;
     listingTitle: string;
     listingImage: string;
     buyerUid: string;
     buyerAddress: string;
     sellerAddress: string;
     amount: number; // ALGO
}): Promise<InitEscrowResult> {
     const { listingId, listingTitle, listingImage, buyerUid, buyerAddress, sellerAddress, amount } =
          params;

     // 1. Compile TEAL escrow for this seller
     const { address: escrowAddress, programBase64 } = await compileEscrow(sellerAddress);

     // 2. 9-digit delivery code
     const deliveryCode = generateDeliveryCode();

     // 3. Build unsigned payment txn
     const payTxn = await buildPaymentToEscrow(buyerAddress, escrowAddress, amount);
     const unsignedTxnBase64 = Buffer.from(payTxn.toByte()).toString("base64");

     // 4. Save order to Firestore (paymentTxId will be filled after signing)
     const orderId = await createOrder({
          listingId,
          listingTitle,
          listingImage,
          buyerUid,
          buyerAddress,
          sellerAddress,
          amount,
          escrowAddress,
          escrowProgram: programBase64,
          deliveryCode,
     });

     return { orderId, escrowAddress, deliveryCode, unsignedTxnBase64 };
}

/**
 * After buyer scans the payment QR (or delivery QR), verify and release escrow to seller.
 */
export async function confirmAndRelease(orderId: string): Promise<string> {
     const order = await getOrder(orderId);
     if (!order) throw new Error("Order not found");
     if (order.status !== "paid")
          throw new Error(`Order is not in paid state. Current: ${order.status}`);

     // Release escrow to seller
     const releaseTxId = await releaseEscrowToSeller(
          order.escrowAddress,
          order.escrowProgram,
          order.sellerAddress
     );

     // Update Firestore
     await setOrderCompleted(orderId, releaseTxId);

     return releaseTxId;
}

/**
 * Cancel an order and refund the escrowed ALGO back to the buyer.
 * Callable by buyer when status is 'paid'.
 */
export async function cancelAndRefund(orderId: string): Promise<string> {
     const order = await getOrder(orderId);
     if (!order) throw new Error("Order not found");
     if (order.status !== "paid")
          throw new Error(`Cannot cancel — order status is: ${order.status}`);

     // Close escrow back to buyer
     const refundTxId = await refundEscrowToBuyer(
          order.escrowAddress,
          order.escrowProgram,
          order.buyerAddress
     );

     // Mark as cancelled in Firestore
     await cancelOrder(orderId, refundTxId);

     return refundTxId;
}
