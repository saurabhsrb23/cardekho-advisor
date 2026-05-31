export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <span className="text-5xl">📋</span>
      <h2 className="text-xl font-semibold text-gray-900">Your shortlist is empty</h2>
      <p className="max-w-sm text-sm text-gray-500">
        Chat with the advisor to find cars that match your needs, then save them here to compare
        side-by-side.
      </p>
      <a
        href="/"
        className="mt-2 rounded-xl bg-brand-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
      >
        Start exploring cars
      </a>
    </div>
  )
}
