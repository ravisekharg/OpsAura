interface Props {
  title: string
  description: string
  children: React.ReactNode
}

export function SettingsSection({ title, description, children }: Props) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
      <div>
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{description}</p>
      </div>
      <div className="rounded-lg border border-border bg-card p-5">
        {children}
      </div>
    </div>
  )
}
