import * as TooltipPrimitive from "@rn-primitives/tooltip";
import type { ComponentProps, ReactNode } from "react";
import { StyleSheet } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { cn } from "@/lib/utils";

// Kept for API parity with the web package; native tooltips need no provider.
function TooltipProvider({
  children,
}: {
  children: ReactNode;
  delayDuration?: number;
}) {
  return <>{children}</>;
}

function Tooltip(props: ComponentProps<typeof TooltipPrimitive.Root>) {
  return <TooltipPrimitive.Root {...props} />;
}

function TooltipTrigger(
  props: ComponentProps<typeof TooltipPrimitive.Trigger>,
) {
  return <TooltipPrimitive.Trigger {...props} />;
}

function TooltipContent({
  className,
  sideOffset = 4,
  portalHost,
  children,
  ...props
}: ComponentProps<typeof TooltipPrimitive.Content> & {
  portalHost?: string;
}) {
  return (
    <TooltipPrimitive.Portal hostName={portalHost}>
      <TooltipPrimitive.Overlay style={StyleSheet.absoluteFill}>
        <Animated.View entering={FadeIn} exiting={FadeOut}>
          <TooltipPrimitive.Content
            sideOffset={sideOffset}
            className={cn(
              "z-50 w-fit max-w-xs items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5",
              className,
            )}
            {...props}
          >
            {typeof children === "string" ? (
              <Animated.Text className="text-xs text-background">
                {children}
              </Animated.Text>
            ) : (
              children
            )}
          </TooltipPrimitive.Content>
        </Animated.View>
      </TooltipPrimitive.Overlay>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
