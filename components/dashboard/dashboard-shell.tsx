interface DashboardShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DashboardShell({
  children,
  className,
  ...props
}: DashboardShellProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-4" {...props}>
        {children}
      </div>
    </div>
  )
}

