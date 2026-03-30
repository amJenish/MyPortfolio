import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-sans text-sm font-semibold " +
    "transition-all duration-200 ease-out " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
    "disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] " +
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        /* Primary — maximum emphasis, filled indigo */
        default:
          "bg-primary text-primary-foreground border border-primary/80 shadow-sm hover:brightness-110 hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/20 active:translate-y-0",

        destructive:
          "bg-destructive text-destructive-foreground shadow-sm border border-destructive/80 hover:brightness-110",

        /* Outline — secondary action, clear border */
        outline:
          "border-2 border-border bg-transparent text-muted-foreground hover:border-primary/50 hover:bg-primary/[0.06] hover:text-primary active:scale-[0.97]",

        secondary:
          "border border-border bg-secondary text-secondary-foreground hover:bg-secondary/80",

        ghost:
          "border border-transparent text-muted-foreground hover:bg-muted/60 hover:text-foreground",

        link:
          "border-transparent text-primary underline-offset-4 hover:underline active:scale-100",

        /* CTA — hero primary action, strongest visual weight */
        cta:
          "btn-cta relative overflow-hidden rounded-xl border border-primary/90 bg-primary text-primary-foreground shadow-md " +
          "hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25 hover:brightness-110 active:translate-y-0 active:shadow-md",

        ctaSecondary:
          "btn-cta-secondary relative overflow-hidden rounded-xl border-2 border-primary/35 bg-background/80 text-foreground shadow-sm " +
          "hover:-translate-y-0.5 hover:border-primary/55 hover:bg-primary/[0.06] hover:text-primary hover:shadow-md active:translate-y-0",
      },
      size: {
        default: "min-h-9 px-4 py-2 text-sm",
        sm: "min-h-8 rounded-lg px-3 text-xs",
        lg: "min-h-11 rounded-xl px-8 text-sm",
        icon: "h-9 w-9 active:scale-100",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
