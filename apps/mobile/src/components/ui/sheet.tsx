import * as SheetPrimitive from "@rn-primitives/dialog";
import { X as XIcon } from "lucide-react-native";
import type { ComponentProps } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideInLeft,
  SlideInRight,
  SlideInUp,
} from "react-native-reanimated";
import { Button } from "@/components/ui/button";
import { iconWithClassName } from "@/lib/icons";
import { cn } from "@/lib/utils";

const X = iconWithClassName(XIcon);

const AnimatedContent = Animated.createAnimatedComponent(
  SheetPrimitive.Content,
);

function Sheet(props: ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root {...props} />;
}

function SheetTrigger(props: ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger {...props} />;
}

function SheetClose(props: ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close {...props} />;
}

function SheetPortal(props: ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal {...props} />;
}

function SheetOverlay({
  className,
  ...props
}: ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      style={StyleSheet.absoluteFill}
      className={cn("z-50 bg-black/80", className)}
      asChild
      {...props}
    >
      <Animated.View entering={FadeIn} exiting={FadeOut} />
    </SheetPrimitive.Overlay>
  );
}

const sideClasses = {
  top: "inset-x-0 top-0 border-b",
  bottom: "inset-x-0 bottom-0 border-t",
  left: "inset-y-0 left-0 h-full w-3/4 max-w-sm border-r",
  right: "inset-y-0 right-0 h-full w-3/4 max-w-sm border-l",
} as const;

const sideEntering = {
  top: SlideInUp,
  bottom: SlideInDown,
  left: SlideInLeft,
  right: SlideInRight,
} as const;

function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  portalHost,
  ...props
}: ComponentProps<typeof SheetPrimitive.Content> & {
  side?: "top" | "right" | "bottom" | "left";
  showCloseButton?: boolean;
  portalHost?: string;
}) {
  return (
    <SheetPortal hostName={portalHost}>
      <SheetOverlay />
      <AnimatedContent
        entering={sideEntering[side]}
        className={cn(
          "absolute z-50 flex-col gap-4 bg-popover p-6 shadow-lg",
          sideClasses[side],
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetPrimitive.Close asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="absolute right-4 top-4"
            >
              <X className="text-foreground" size={16} />
            </Button>
          </SheetPrimitive.Close>
        )}
      </AnimatedContent>
    </SheetPortal>
  );
}

function SheetHeader({
  className,
  ...props
}: ComponentProps<typeof Animated.View>) {
  return (
    <Animated.View className={cn("flex-col gap-1.5", className)} {...props} />
  );
}

function SheetFooter({
  className,
  ...props
}: ComponentProps<typeof Animated.View>) {
  return (
    <Animated.View
      className={cn("mt-auto flex-col gap-2", className)}
      {...props}
    />
  );
}

function SheetTitle({
  className,
  ...props
}: ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      className={cn("text-sm font-medium text-foreground", className)}
      {...props}
    />
  );
}

function SheetDescription({
  className,
  ...props
}: ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      className={cn("text-xs text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
};
