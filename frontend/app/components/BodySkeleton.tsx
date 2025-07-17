import { Card, CardContent } from "@/components/ui/card";

export default function ProfileSkeleton() {
  return (
    <Card className="w-full max-w-md border-0 shadow-none animate-pulse">
      <div className="relative">
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "1/1" }}>
          <div className="h-full w-full rounded-xl bg-gray-200" />
        </div>
      </div>
      <CardContent className="p-0 !py-3">
        <div className="flex items-start justify-between">
          <div className="h-6 w-1/2 bg-gray-200 rounded" />
          <div className="flex items-center gap-1">
            <div className="h-4 w-4 bg-gray-200 rounded-full" />
            <div className="h-4 w-8 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="mt-2 h-4 w-3/4 bg-gray-200 rounded" />
      </CardContent>
    </Card>
  )
}
