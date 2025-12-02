export default function Loading() {
  return (
    <div className="max-w-lg mx-auto p-4 pb-24">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-muted rounded w-1/3"></div>
        <div className="h-64 bg-muted rounded"></div>
      </div>
    </div>
  )
}
