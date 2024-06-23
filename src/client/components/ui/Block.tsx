import React from 'react'
import { useStore } from '@nanostores/react'
import * as stores from '#client/stores'
import { cn } from '#client/utils'

type Props = {
  blockView?: boolean
  label: string
  onLabelClick?: () => void
  children: React.ReactNode
  onChildrenClick?: () => void
  className?: string
  labelClassName?: string
  contentClassName?: string
  containsButton?: boolean
  containsSmallButton?: boolean
  onClick?: () => void
}

export const Block: React.FC<Props> = ({ blockView = false, ...props }) => {
  const theme = useStore(stores.theme)

  const hoverClassName = React.useMemo(() => {
    if (theme === 'dark') {
      return 'hover:bg-acc-400/20 group-hover:bg-acc-400/20'
    } else {
      return 'hover:bg-acc-400/10 group-hover:bg-acc-400/10'
    }
  }, [theme])

  return (
    <div className={props.className}>
      <div className="flex">
        <div
          className={cn(
            'flex items-start',
            !!props.onClick && 'group cursor-pointer'
          )}
          onClick={props.onClick}
        >
          <div
            className={cn(
              'w-[150px] mr-8 -ml-4',
              props.containsButton && 'translate-y-8',
              props.containsSmallButton && 'translate-y-4'
            )}
          >
            <span
              className={cn(
                'px-4 rounded',
                (!!props.onClick || !!props.onLabelClick) &&
                  cn(
                    'cursor-pointer transition-[background-color]',
                    hoverClassName
                  ),
                props.labelClassName
              )}
              onClick={props.onLabelClick}
            >
              {props.label}
            </span>
          </div>
          <div
            className={cn(
              'flex-1',
              blockView && 'pl-4',
              props.contentClassName
            )}
          >
            {blockView ? (
              props.children
            ) : (
              <span
                className={cn(
                  'px-4 rounded',
                  (!!props.onClick || !!props.onChildrenClick) &&
                    cn(
                      'cursor-pointer transition-[background-color]',
                      hoverClassName
                    ),
                  props.labelClassName
                )}
                onClick={props.onChildrenClick}
              >
                {props.children}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
