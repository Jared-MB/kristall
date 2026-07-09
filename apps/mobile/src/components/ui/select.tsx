import * as SelectPrimitive from "@rn-primitives/select";
import {
  Check as CheckIcon,
  ChevronDown as ChevronDownIcon,
  ChevronsUpDown as ChevronsUpDownIcon,
  ChevronUp as ChevronUpIcon,
} from "lucide-react-native";
import type { ComponentProps, ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { iconWithClassName } from "@/lib/icons";
import { cn } from "@/lib/utils";

const Check = iconWithClassName(CheckIcon);
const ChevronDown = iconWithClassName(ChevronDownIcon);
const ChevronUp = iconWithClassName(ChevronUpIcon);
const ChevronsUpDown = iconWithClassName(ChevronsUpDownIcon);

function Select(props: ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root {...props} />;
}

function SelectGroup(props: ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group {...props} />;
}

function SelectValue({
  className,
  ...props
}: ComponentProps<typeof SelectPrimitive.Value>) {
  return (
    <SelectPrimitive.Value
      className={cn("text-xs text-foreground", className)}
      {...props}
    />
  );
}

function SelectTrigger({
  className,
  children,
  size = "default",
  ...props
}: ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default";
  children?: ReactNode;
}) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        "flex-row items-center justify-between gap-1.5 rounded-md border border-input bg-input/20 px-2",
        size === "sm" ? "h-6" : "h-7",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronsUpDown className="text-muted-foreground" size={14} />
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  position = "popper",
  portalHost,
  ...props
}: ComponentProps<typeof SelectPrimitive.Content> & {
  portalHost?: string;
}) {
  return (
    <SelectPrimitive.Portal hostName={portalHost}>
      <SelectPrimitive.Overlay style={StyleSheet.absoluteFill}>
        <Animated.View entering={FadeIn} exiting={FadeOut}>
          <SelectPrimitive.Content
            position={position}
            className={cn(
              "z-50 min-w-32 overflow-hidden rounded-lg border border-border bg-popover shadow-md",
              className,
            )}
            {...props}
          >
            <SelectScrollUpButton />
            <SelectPrimitive.Viewport className="p-1">
              {children}
            </SelectPrimitive.Viewport>
            <SelectScrollDownButton />
          </SelectPrimitive.Content>
        </Animated.View>
      </SelectPrimitive.Overlay>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({
  className,
  ...props
}: ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      className={cn("px-2 py-1.5 text-xs text-muted-foreground", className)}
      {...props}
    />
  );
}

// The visible label comes from the required `label` prop (rendered by
// `ItemText`), mirroring the native primitive rather than the web `children`.
function SelectItem({
  className,
  ...props
}: ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "relative min-h-7 flex-row items-center gap-2 rounded-md py-1 pl-2 pr-8 active:bg-accent",
        className,
      )}
      {...props}
    >
      <View className="absolute right-2 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="text-foreground" size={14} />
        </SelectPrimitive.ItemIndicator>
      </View>
      <SelectPrimitive.ItemText className="text-xs text-foreground" />
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      className={cn("-mx-1 my-1 h-px bg-border/50", className)}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      className={cn("items-center justify-center bg-popover py-1", className)}
      {...props}
    >
      <ChevronUp className="text-muted-foreground" size={14} />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      className={cn("items-center justify-center bg-popover py-1", className)}
      {...props}
    >
      <ChevronDown className="text-muted-foreground" size={14} />
    </SelectPrimitive.ScrollDownButton>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
