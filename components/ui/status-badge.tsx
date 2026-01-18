import { cn } from "@/lib/utils";
import { Circle } from "lucide-react";

type StatusBadgeProps = {
  status: string;
  variant?: "default" | "dot" | "outline";
  className?: string;
};

const statusConfig: Record<
  string,
  { label: string; color: string; dotColor: string }
> = {
  active: {
    label: "Active",
    color: "bg-green-100 text-green-700 border-green-200",
    dotColor: "bg-green-500",
  },
  draft: {
    label: "Draft",
    color: "bg-gray-100 text-gray-700 border-gray-200",
    dotColor: "bg-gray-500",
  },
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    dotColor: "bg-yellow-500",
  },
  completed: {
    label: "Completed",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    dotColor: "bg-blue-500",
  },
  ended: {
    label: "Ended",
    color: "bg-red-100 text-red-700 border-red-200",
    dotColor: "bg-red-500",
  },
  paused: {
    label: "Paused",
    color: "bg-orange-100 text-orange-700 border-orange-200",
    dotColor: "bg-orange-500",
  },
  failed: {
    label: "Failed",
    color: "bg-red-100 text-red-700 border-red-200",
    dotColor: "bg-red-500",
  },
  paid: {
    label: "Paid",
    color: "bg-green-100 text-green-700 border-green-200",
    dotColor: "bg-green-500",
  },
  processing: {
    label: "Processing",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    dotColor: "bg-blue-500",
  },
  shipped: {
    label: "Shipped",
    color: "bg-purple-100 text-purple-700 border-purple-200",
    dotColor: "bg-purple-500",
  },
  delivered: {
    label: "Delivered",
    color: "bg-green-100 text-green-700 border-green-200",
    dotColor: "bg-green-500",
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-gray-100 text-gray-700 border-gray-200",
    dotColor: "bg-gray-500",
  },
  refunded: {
    label: "Refunded",
    color: "bg-orange-100 text-orange-700 border-orange-200",
    dotColor: "bg-orange-500",
  },
};

export default function StatusBadge({
  status,
  variant = "default",
  className = "",
}: StatusBadgeProps) {
  const config =
    statusConfig[status.toLowerCase()] ||
    statusConfig.draft;

  if (variant === "dot") {
    return (
      <div className={cn("inline-flex items-center gap-2", className)}>
        <Circle
          className={cn("h-2 w-2 rounded-full", config.dotColor)}
          fill="currentColor"
        />
        <span className="text-sm font-medium capitalize">{config.label}</span>
      </div>
    );
  }

  if (variant === "outline") {
    return (
      <span
        className={cn(
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
          config.color,
          className
        )}
      >
        {config.label}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  );
}
