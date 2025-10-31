import { Skeleton } from "@/components/ui/skeleton"

export default function BlogFormSkeleton() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="min-h-14 w-full rounded-md" />
      <Skeleton className="min-h-14 w-full rounded-md" />
      <Skeleton className="min-h-14 w-full rounded-md" />
      <Skeleton className="min-h-14 w-full rounded-md" />
      <Skeleton className="min-h-14 w-full rounded-md" />
    </div>
  )
}
