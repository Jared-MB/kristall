import type { LucideIcon } from "lucide-react-native";
import { cssInterop } from "nativewind";

/**
 * Enables NativeWind `className` (e.g. `text-muted-foreground`) to drive the
 * `color`/`opacity` of a lucide icon, mirroring how the web icons inherit
 * `currentColor`.
 */
export function iconWithClassName(icon: LucideIcon) {
  cssInterop(icon, {
    className: {
      target: "style",
      nativeStyleToProp: {
        color: true,
        opacity: true,
      },
    },
  });
  return icon;
}
