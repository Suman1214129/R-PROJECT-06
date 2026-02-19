import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
     return twMerge(clsx(inputs));
}

const ALGO_TO_USD = 0.32;

export function formatALGO(amount: number): string {
     return `${amount.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ALGO`;
}

export function algoToUsd(algo: number): string {
     const usd = algo * ALGO_TO_USD;
     return `$${usd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function truncateAddress(address: string): string {
     if (address.length <= 10) return address;
     return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatDate(date: string): string {
     return new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
     });
}

export function timeAgo(date: string): string {
     const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
     if (seconds < 60) return "just now";
     const minutes = Math.floor(seconds / 60);
     if (minutes < 60) return `${minutes}m ago`;
     const hours = Math.floor(minutes / 60);
     if (hours < 24) return `${hours}h ago`;
     const days = Math.floor(hours / 24);
     if (days < 7) return `${days}d ago`;
     return formatDate(date);
}

export function generateId(): string {
     return Math.random().toString(36).substring(2, 9);
}
