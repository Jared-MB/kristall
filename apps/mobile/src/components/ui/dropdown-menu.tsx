import * as DropdownMenuPrimitive from "@rn-primitives/dropdown-menu";
import {
  Check as CheckIcon,
  ChevronRight as ChevronRightIcon,
} from "lucide-react-native";
import type { ComponentProps, ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { iconWithClassName } from "@/lib/icons";
import { cn } from "@/lib/utils";

const Check = iconWithClassName(CheckIcon);
const ChevronRight = iconWithClassName(ChevronRightIcon);

function wrapText(children: unknown, className: string): ReactNode {
  return typeof children === "string" ? (
    <Text className={className}>{children}</Text>
  ) : (
    (children as ReactNode)
  );
}

function DropdownMenu(
  props: ComponentProps<typeof DropdownMenuPrimitive.Root>,
) {
  return <DropdownMenuPrimitive.Root {...props} />;
}

function DropdownMenuPortal(
  props: ComponentProps<typeof DropdownMenuPrimitive.Portal>,
) {
  return <DropdownMenuPrimitive.Portal {...props} />;
}

function DropdownMenuTrigger(
  props: ComponentProps<typeof DropdownMenuPrimitive.Trigger>,
) {
  return <DropdownMenuPrimitive.Trigger {...props} />;
}

function DropdownMenuGroup(
  props: ComponentProps<typeof DropdownMenuPrimitive.Group>,
) {
  return <DropdownMenuPrimitive.Group {...props} />;
}

function DropdownMenuRadioGroup(
  props: ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>,
) {
  return <DropdownMenuPrimitive.RadioGroup {...props} />;
}

function DropdownMenuSub(
  props: ComponentProps<typeof DropdownMenuPrimitive.Sub>,
) {
  return <DropdownMenuPrimitive.Sub {...props} />;
}

function DropdownMenuContent({
  className,
  sideOffset = 4,
  portalHost,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Content> & {
  portalHost?: string;
}) {
  return (
    <DropdownMenuPrimitive.Portal hostName={portalHost}>
      <DropdownMenuPrimitive.Overlay style={StyleSheet.absoluteFill}>
        <Animated.View entering={FadeIn} exiting={FadeOut}>
          <DropdownMenuPrimitive.Content
            sideOffset={sideOffset}
            className={cn(
              "z-50 min-w-32 overflow-hidden rounded-lg border border-border bg-popover p-1 shadow-md",
              className,
            )}
            {...props}
          />
        </Animated.View>
      </DropdownMenuPrimitive.Overlay>
    </DropdownMenuPrimitive.Portal>
  );
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  children,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean;
  variant?: "default" | "destructive";
}) {
  return (
    <DropdownMenuPrimitive.Item
      className={cn(
        "relative min-h-7 flex-row items-center gap-2 rounded-md px-2 py-1 active:bg-accent",
        inset && "pl-8",
        variant === "destructive" && "active:bg-destructive/10",
        className,
      )}
      {...props}
    >
      {wrapText(
        children,
        cn(
          "text-xs",
          variant === "destructive" ? "text-destructive" : "text-foreground",
        ),
      )}
    </DropdownMenuPrimitive.Item>
  );
}

function DropdownMenuCheckboxItem({
  className,
  children,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      className={cn(
        "relative min-h-7 flex-row items-center gap-2 rounded-md py-1.5 pl-2 pr-8 active:bg-accent",
        className,
      )}
      {...props}
    >
      <View className="absolute right-2 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <Check className="text-foreground" size={14} />
        </DropdownMenuPrimitive.ItemIndicator>
      </View>
      {wrapText(children, "text-xs text-foreground")}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
  return (
    <DropdownMenuPrimitive.RadioItem
      className={cn(
        "relative min-h-7 flex-row items-center gap-2 rounded-md py-1.5 pl-2 pr-8 active:bg-accent",
        className,
      )}
      {...props}
    >
      <View className="absolute right-2 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <Check className="text-foreground" size={14} />
        </DropdownMenuPrimitive.ItemIndicator>
      </View>
      {wrapText(children, "text-xs text-foreground")}
    </DropdownMenuPrimitive.RadioItem>
  );
}

function DropdownMenuLabel({
  className,
  inset,
  children,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Label> & { inset?: boolean }) {
  return (
    <DropdownMenuPrimitive.Label
      className={cn(
        "px-2 py-1.5 text-xs text-muted-foreground",
        inset && "pl-8",
        className,
      )}
      {...props}
    >
      {children}
    </DropdownMenuPrimitive.Label>
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      className={cn("-mx-1 my-1 h-px bg-border/50", className)}
      {...props}
    />
  );
}

function DropdownMenuShortcut({
  className,
  ...props
}: ComponentProps<typeof Text>) {
  return (
    <Text
      className={cn(
        "ml-auto text-[0.625rem] tracking-widest text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      className={cn(
        "min-h-7 flex-row items-center gap-2 rounded-md px-2 py-1 active:bg-accent",
        inset && "pl-8",
        className,
      )}
      {...props}
    >
      {wrapText(children, "text-xs text-foreground")}
      <ChevronRight className="ml-auto text-foreground" size={14} />
    </DropdownMenuPrimitive.SubTrigger>
  );
}

function DropdownMenuSubContent({
  className,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <DropdownMenuPrimitive.SubContent
      className={cn(
        "z-50 min-w-32 overflow-hidden rounded-lg border border-border bg-popover p-1 shadow-md",
        className,
      )}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
};
