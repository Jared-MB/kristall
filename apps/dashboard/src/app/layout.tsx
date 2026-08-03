import "./globals.css";

import type { Metadata } from "next";
import { Geist_Mono, Quicksand } from "next/font/google";

import { QueryProvider } from "@/components/query-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const quicksandSans = Quicksand({
	variable: "--font-quicksand-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Kristall",
	description: "Kristall",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
			className={cn(
				quicksandSans.variable,
				geistMono.variable,
				"h-full",
				"antialiased",
				"font-sans",
			)}
		>
			<body className="min-h-full">
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<QueryProvider>
						<TooltipProvider>{children}</TooltipProvider>
					</QueryProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
