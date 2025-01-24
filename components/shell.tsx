interface ShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Shell({ children, className, ...props }: ShellProps) {
  return (
    <div className="container grid items-center gap-8 pb-8 pt-6 md:py-8">
      {children}
    </div>
  )
}

