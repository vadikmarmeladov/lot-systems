import React from 'react'
import { cn } from '#client/utils'

export type ToggleSectionProps = {
  label: string
  children: React.ReactNode
  defaultOpen?: boolean
  indent?: number
  className?: string
  onToggle?: (isOpen: boolean) => void
}

/**
 * Collapsible toggle section component
 * Usage: [Memory] > [Awareness] > [Pattern 1]
 */
export function ToggleSection({
  label,
  children,
  defaultOpen = false,
  indent = 0,
  className,
  onToggle,
}: ToggleSectionProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)

  const handleToggle = () => {
    const newState = !isOpen
    setIsOpen(newState)
    onToggle?.(newState)
  }

  return (
    <div className={cn('w-full', className)}>
      <button
        type="button"
        onClick={handleToggle}
        className="w-full text-left flex items-center gap-8 py-8 transition-opacity hover:opacity-30"
        style={{ paddingLeft: indent > 0 ? `${indent * 16}px` : undefined }}
      >
        <span className="transition-transform duration-200" style={{
          transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
          display: 'inline-block',
          width: '8px'
        }}>
          ›
        </span>
        <span>{label}</span>
      </button>

      <div
        className={cn(
          'grid transition-[grid-template-rows] duration-300',
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        )}
      >
        <div className="overflow-hidden">
          <div className="py-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Group of toggle sections for nested structures
 */
export function ToggleGroup({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col', className)}>
      {children}
    </div>
  )
}
