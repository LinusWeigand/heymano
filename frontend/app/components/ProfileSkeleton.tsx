import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProfileSkeleton() {
  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-2 animate-pulse">
      <CardHeader className="bg-muted/50 border-b pb-4">
        <div className="flex justify-center">
          <Skeleton className="h-8 w-48 rounded-md" />
        </div>
        <div className="flex justify-center mt-2">
          <Skeleton className="h-4 w-64 rounded-md" />
        </div>
        <div className="flex justify-between mt-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className={`h-1 w-full rounded-none ${index > 0 ? "ml-1" : ""}`} />
          ))}
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-3">
          <Skeleton className="h-5 w-24 rounded-md" />
          <Skeleton className="h-12 w-full rounded-md" />
          <Skeleton className="h-4 w-3/4 rounded-md" />
        </div>

        <div className="space-y-3">
          <Skeleton className="h-5 w-32 rounded-md" />
          <Skeleton className="h-12 w-full rounded-md" />
        </div>

        <div className="space-y-3">
          <Skeleton className="h-5 w-40 rounded-md" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-md" />
            <Skeleton className="h-12 w-28 rounded-md" />
            <Skeleton className="h-12 w-12 rounded-md" />
          </div>
        </div>

        <Skeleton className="h-12 w-full rounded-md" />
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-6 bg-muted/30">
        <Skeleton className="h-5 w-64 rounded-md" />
      </CardFooter>
    </Card>
  )
}

