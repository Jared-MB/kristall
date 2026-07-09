import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { Text, View } from "react-native";
import { cn } from "@/lib/utils";

const markerVariants = cva("relative w-full flex-row items-center gap-2", {
  variants: {
    variant: {
      default: "",
      separator: "",
      border: "border-b border-border pb-2",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

function Marker({
  className,
  variant = "default",
  children,
  ...props
}: ComponentProps<typeof View> & VariantProps<typeof markerVariants>) {
  return (
    <View className={cn(markerVariants({ variant }), className)} {...props}>
      {variant === "separator" && <View className="h-px flex-1 bg-border" />}
      {children}
      {variant === "separator" && <View className="h-px flex-1 bg-border" />}
    </View>
  );
}

function MarkerIcon({ className, ...props }: ComponentProps<typeof View>) {
  return <View className={cn("size-3.5 shrink-0", className)} {...props} />;
}

function MarkerContent({ className, ...props }: ComponentProps<typeof Text>) {
  return (
    <Text
      className={cn("min-w-0 text-xs text-muted-foreground", className)}
      {...props}
    />
  );
}

export { Marker, MarkerContent, MarkerIcon, markerVariants };
