import { Skeleton } from "@/components/ui/skeleton"

export default function FormSkeleton() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="min-h-9 w-full rounded-md" />
      <Skeleton className="min-h-9 w-full rounded-md" />
      <div className="space-y-2">
        <Skeleton className="min-h-[235px] w-full" />
      </div>
      <Skeleton className="min-h-9 w-full rounded-md" />
    </div>
  )
}
