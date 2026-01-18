"use client";

import * as React from "react";

const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
  return <div className="relative inline-block">{children}</div>;
};

const DropdownMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ children, asChild, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  React.useImperativeHandle(ref, () => triggerRef.current!);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <>
      <button ref={triggerRef} onClick={toggle} {...props}>
        {children}
      </button>
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
});
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

const DropdownMenuContent = ({
  children,
  align = "start",
}: {
  children: React.ReactNode;
  align?: "start" | "end";
}) => {
  return (
    <div
      className={`absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80 ${
        align === "end" ? "right-0" : "left-0"
      }`}
    >
      {children}
    </div>
  );
};

const DropdownMenuItem = ({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${className}`}
    >
      {children}
    </div>
  );
};

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem };
