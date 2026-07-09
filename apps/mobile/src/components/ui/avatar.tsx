import * as AvatarPrimitive from "@rn-primitives/avatar";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { View } from "react-native";
import { cn } from "@/lib/utils";

const avatarVariants = cva(
  "relative shrink-0 overflow-hidden rounded-full border border-border",
  {
    variants: {
      size: {
        default: "size-8",
        sm: "size-6",
        lg: "size-10",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

function Avatar({
  className,
  size,
  ...props
}: ComponentProps<typeof AvatarPrimitive.Root> &
  VariantProps<typeof avatarVariants>) {
  return (
    <AvatarPrimitive.Root
      className={cn(avatarVariants({ size }), className)}
      {...props}
    />
  );
}

function AvatarImage({
  className,
  ...props
}: ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      className={cn(
        "size-full items-center justify-center rounded-full bg-muted",
        className,
      )}
      {...props}
    />
  );
}

function AvatarBadge({ className, ...props }: ComponentProps<typeof View>) {
  return (
    <View
      className={cn(
        "absolute bottom-0 right-0 z-10 size-2.5 items-center justify-center rounded-full border-2 border-background bg-primary",
        className,
      )}
      {...props}
    />
  );
}

function AvatarGroup({ className, ...props }: ComponentProps<typeof View>) {
  return <View className={cn("flex-row -space-x-2", className)} {...props} />;
}

function AvatarGroupCount({
  className,
  ...props
}: ComponentProps<typeof View>) {
  return (
    <View
      className={cn(
        "size-8 items-center justify-center rounded-full border-2 border-background bg-muted",
        className,
      )}
      {...props}
    />
  );
}

export {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
};
