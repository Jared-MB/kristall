import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/** Placeholder grid shown while `getLocations` resolves. */
export function LocationsSkeleton() {
	return (
		<>
			{Array.from({ length: 3 }, (_, index) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: static placeholder list
				<Card key={index} className="pt-6">
					<CardHeader className="px-6">
						<Skeleton className="h-7 w-40" />
					</CardHeader>
					<CardContent className="flex-1 px-6">
						<div className="flex flex-col gap-4">
							<Skeleton className="h-5 w-48" />
							<Skeleton className="h-5 w-32" />
						</div>
					</CardContent>
					<CardFooter className="px-6 justify-end gap-2">
						<Skeleton className="h-9 w-32" />
						<Skeleton className="h-9 w-20" />
					</CardFooter>
				</Card>
			))}
		</>
	);
}
