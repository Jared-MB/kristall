import { cva, type VariantProps } from "class-variance-authority";
import { type ComponentProps, type ReactNode, useMemo } from "react";
import { Text, View } from "react-native";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

function FieldSet({ className, ...props }: ComponentProps<typeof View>) {
  return <View className={cn("flex-col gap-4", className)} {...props} />;
}

function FieldLegend({
  className,
  variant = "legend",
  ...props
}: ComponentProps<typeof Text> & { variant?: "legend" | "label" }) {
  return (
    <Text
      className={cn(
        "mb-2 font-medium text-foreground",
        variant === "label" ? "text-xs" : "text-sm",
        className,
      )}
      {...props}
    />
  );
}

function FieldGroup({ className, ...props }: ComponentProps<typeof View>) {
  return <View className={cn("w-full flex-col gap-4", className)} {...props} />;
}

const fieldVariants = cva("w-full gap-2", {
  variants: {
    orientation: {
      vertical: "flex-col",
      horizontal: "flex-row items-center",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
});

function Field({
  className,
  orientation = "vertical",
  ...props
}: ComponentProps<typeof View> & VariantProps<typeof fieldVariants>) {
  return (
    <View
      role="group"
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  );
}

function FieldContent({ className, ...props }: ComponentProps<typeof View>) {
  return (
    <View className={cn("flex-1 flex-col gap-0.5", className)} {...props} />
  );
}

function FieldLabel({ className, ...props }: ComponentProps<typeof Label>) {
  return <Label className={cn("gap-2", className)} {...props} />;
}

function FieldTitle({ className, ...props }: ComponentProps<typeof Text>) {
  return (
    <Text
      className={cn("text-xs font-medium text-foreground", className)}
      {...props}
    />
  );
}

function FieldDescription({
  className,
  ...props
}: ComponentProps<typeof Text>) {
  return (
    <Text
      className={cn("text-xs font-normal text-muted-foreground", className)}
      {...props}
    />
  );
}

function FieldSeparator({
  children,
  className,
  ...props
}: ComponentProps<typeof View> & { children?: ReactNode }) {
  return (
    <View
      className={cn(
        "relative -my-2 h-5 items-center justify-center",
        className,
      )}
      {...props}
    >
      <Separator className="absolute inset-x-0 top-1/2" />
      {children ? (
        <Text className="relative bg-background px-2 text-xs text-muted-foreground">
          {children}
        </Text>
      ) : null}
    </View>
  );
}

function FieldError({
  className,
  children,
  errors,
  ...props
}: ComponentProps<typeof View> & {
  errors?: Array<{ message?: string } | undefined>;
}) {
  const content = useMemo(() => {
    if (children) {
      return children;
    }

    if (!errors?.length) {
      return null;
    }

    const uniqueErrors = [
      ...new Map(errors.map((error) => [error?.message, error])).values(),
    ];

    if (uniqueErrors.length === 1) {
      return uniqueErrors[0]?.message;
    }

    return (
      <View className="ml-4 flex-col gap-1">
        {uniqueErrors.map((error) =>
          error?.message ? (
            <Text
              key={error.message}
              className="text-xs font-normal text-destructive"
            >
              {"•"} {error.message}
            </Text>
          ) : null,
        )}
      </View>
    );
  }, [children, errors]);

  if (!content) {
    return null;
  }

  return (
    <View role="alert" className={className} {...props}>
      {typeof content === "string" ? (
        <Text className="text-xs font-normal text-destructive">{content}</Text>
      ) : (
        content
      )}
    </View>
  );
}

export {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
};
