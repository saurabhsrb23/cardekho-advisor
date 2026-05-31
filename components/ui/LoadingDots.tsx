export function LoadingDots() {
  return (
    <div className="flex items-center gap-1 py-1" aria-label="Loading response" role="status">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  )
}
