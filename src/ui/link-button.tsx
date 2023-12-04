import * as React from "react";
import Link from "next/link";
import { VariantProps } from "class-variance-authority";

import { cn } from "@raight/utils";

import { buttonVariants } from "./button";

export interface LinkButtonProps
  extends React.ComponentProps<typeof Link>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const LinkButton = React.forwardRef<HTMLAnchorElement, LinkButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    variant = variant || "ghost";
    return (
      <Link
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
LinkButton.displayName = "LinkButton";

export { LinkButton };
