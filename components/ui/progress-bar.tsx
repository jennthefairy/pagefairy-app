import { cn } from "@/lib/utils";

type ProgressBarProps = {
  value: number; // 0-100
  max?: number;
  label?: string;
  showPercentage?: boolean;
  className?: string;
  barClassName?: string;
  size?: "sm" | "md" | "lg";
};

export default function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = false,
  className = "",
  barClassName = "",
  size = "md",
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const isComplete = percentage >= 100;

  const sizeClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  return (
    <div className={cn("space-y-2", className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-sm">
          {label && <span className="font-medium">{label}</span>}
          {showPercentage && (
            <span className="text-muted-foreground">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          "bg-muted rounded-full overflow-hidden",
          sizeClasses[size]
        )}
      >
        <div
          className={cn(
            "h-full transition-all duration-300",
            isComplete ? "bg-green-500" : "bg-primary",
            barClassName
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
