import type { ComponentProps } from "react";
import { TextInput } from "react-native";
import { cn } from "@/lib/utils";

function Input({ className, ...props }: ComponentProps<typeof TextInput>) {
  return (
    <TextInput
      className={cn(
        "h-7 w-full min-w-0 rounded-md border border-input bg-input/20 px-2 py-0.5 text-sm text-foreground placeholder:text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
