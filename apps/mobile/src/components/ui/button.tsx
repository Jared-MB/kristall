import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";
import { Pressable, Text } from "react-native";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "flex-row shrink-0 items-center justify-center rounded-md border border-transparent active:opacity-80 disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary",
        outline: "border-border dark:bg-input/30",
        secondary: "bg-secondary",
        ghost: "active:bg-muted",
        destructive: "bg-destructive/10 dark:bg-destructive/20",
        link: "",
      },
      size: {
        default: "h-7 gap-1 px-2",
        xs: "h-5 gap-1 rounded-sm px-2",
        sm: "h-6 gap-1 px-2",
        lg: "h-8 gap-1 px-2.5",
        icon: "size-7",
        "icon-xs": "size-5 rounded-sm",
        "icon-sm": "size-6",
        "icon-lg": "size-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const buttonTextVariants = cva("text-xs font-medium", {
  variants: {
    variant: {
      default: "text-primary-foreground",
      outline: "text-foreground",
      secondary: "text-secondary-foreground",
      ghost: "text-foreground",
      destructive: "text-destructive",
      link: "text-primary underline",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type ButtonProps = Omit<ComponentProps<typeof Pressable>, "children"> &
  VariantProps<typeof buttonVariants> & {
    className?: string;
    textClassName?: string;
    children?: ReactNode;
  };

export function Button({
  className,
  textClassName,
  variant,
  size,
  children,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {typeof children === "string" ? (
        <Text className={cn(buttonTextVariants({ variant }), textClassName)}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
