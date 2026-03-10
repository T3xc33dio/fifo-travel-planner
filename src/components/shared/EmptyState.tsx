interface Props {
  title: string
  description: string
  action?: { label: string; onClick: () => void }
}

export function EmptyState({ title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center gap-3">
      <p className="font-semibold text-gray-700">{title}</p>
      <p className="text-sm text-gray-500">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
