"use client";

const statusMap: Record<string, { label: string; bg: string; text: string }> = {
     Active: { label: "Active", bg: "bg-emerald-50", text: "text-emerald-700" },
     Paused: { label: "Paused", bg: "bg-amber-50", text: "text-amber-700" },
     Sold: { label: "Sold", bg: "bg-gray-100", text: "text-gray-500" },
     placed: { label: "Placed", bg: "bg-blue-50", text: "text-blue-700" },
     confirmed: { label: "Confirmed", bg: "bg-indigo-50", text: "text-indigo-700" },
     preparing: { label: "Preparing", bg: "bg-amber-50", text: "text-amber-700" },
     ready: { label: "Ready", bg: "bg-emerald-50", text: "text-emerald-700" },
     delivered: { label: "Delivered", bg: "bg-teal-50", text: "text-teal-700" },
     completed: { label: "Completed", bg: "bg-gray-100", text: "text-gray-600" },
};

interface OrderStatusBadgeProps {
     status: string;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
     const config = statusMap[status] || { label: status, bg: "bg-gray-100", text: "text-gray-600" };

     return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium ${config.bg} ${config.text}`}>
               {config.label}
          </span>
     );
}
