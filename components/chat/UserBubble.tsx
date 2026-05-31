interface UserBubbleProps {
  content: string
}

export function UserBubble({ content }: UserBubbleProps) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[75%] rounded-2xl rounded-tr-sm bg-brand-500 px-4 py-2.5 text-sm text-white shadow-sm">
        {content}
      </div>
    </div>
  )
}
