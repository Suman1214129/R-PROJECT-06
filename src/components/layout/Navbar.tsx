"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wallet, Bell, Loader2, User, MessageCircle } from "lucide-react";
import { useWalletStore } from "@/store/wallet";
import { useUIStore } from "@/store/ui";
import { truncateAddress } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { isConnected, isConnecting, address, setShowConnectModal } = useWalletStore();
  const { toggleMessages } = useUIStore();

  const navItems = [
    { href: "/", label: "Browse" },
    { href: "/dashboard/listings", label: "Sell" },
    { href: "/orders", label: "Orders" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <span className="font-serif text-xl italic text-text-primary">CampusSwap</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 ml-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium tracking-wide transition-all ${isActive
                      ? "text-text-primary bg-surface-2"
                      : "text-text-muted hover:text-text-primary"
                    }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-1.5">
            {/* Messages Toggle */}
            <button
              onClick={toggleMessages}
              className="relative p-2 rounded-full text-text-muted hover:text-text-primary hover:bg-surface-2 transition-all"
            >
              <MessageCircle className="w-[18px] h-[18px]" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent" />
            </button>

            {/* Notifications */}
            <button className="relative p-2 rounded-full text-text-muted hover:text-text-primary hover:bg-surface-2 transition-all">
              <Bell className="w-[18px] h-[18px]" />
            </button>

            {/* Wallet Button */}
            {isConnected ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-2 border border-border ml-1">
                <span className="w-1.5 h-1.5 rounded-full bg-success" />
                <span className="text-xs font-mono text-text-secondary">{truncateAddress(address || "")}</span>
              </div>
            ) : isConnecting ? (
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-2 border border-border text-[13px] text-text-muted ml-1">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span className="hidden sm:block">Connecting</span>
              </button>
            ) : (
              <button
                onClick={() => setShowConnectModal(true)}
                className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary hover:bg-primary-hover text-white text-[13px] font-medium tracking-wide transition-all active:scale-[0.97] ml-1"
              >
                <Wallet className="w-3.5 h-3.5" />
                <span className="hidden sm:block">Connect</span>
              </button>
            )}

            {/* Profile */}
            <Link href="/profile/seller-1" className="hidden md:flex ml-0.5">
              <div className="w-8 h-8 rounded-full bg-surface-2 border border-border flex items-center justify-center hover:border-border-hover transition-all">
                <User className="w-4 h-4 text-text-muted" />
              </div>
            </Link>
          </div>
        </div>

        {/* Mobile Nav — Inline row */}
        <nav className="flex md:hidden items-center gap-1 pb-2 overflow-x-auto scrollbar-hide -mx-1 px-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${isActive
                    ? "text-text-primary bg-surface-2"
                    : "text-text-muted hover:text-text-primary"
                  }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/profile/seller-1"
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${pathname.startsWith("/profile")
                ? "text-text-primary bg-surface-2"
                : "text-text-muted hover:text-text-primary"
              }`}
          >
            Profile
          </Link>
        </nav>
      </div>
    </header>
  );
}
