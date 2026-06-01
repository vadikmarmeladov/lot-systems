/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import * as React from 'react'
import { useStore } from '@nanostores/react'
import * as stores from '#client/stores'
import { goTo } from '#client/stores/router'
import { Button, Page } from '#client/components/ui'
import { cn } from '#client/utils'

type RouteName = 'sync' | 'logs' | 'system' | 'api' | 'settings' | 'basics'

type NavItem = { label: string | null; spacer?: boolean; route?: RouteName }

type Props = {
  children: React.ReactNode
  hideNav?: boolean
}

export const Layout: React.FC<Props> = ({ children, hideNav = false }) => {
  const me = useStore(stores.me)
  const layoutView = useStore(stores.layoutView)
  const isMirrorOn = useStore(stores.isMirrorOn)
  const routerState = useStore(stores.router)
  const currentRoute = routerState?.route ?? 'system'
  const navLinks = React.useMemo<NavItem[]>(() => {
    const result: NavItem[] = me
      ? [
          { label: 'Sync', route: 'sync' },
          { label: 'Log', route: 'logs' },
          { label: 'System', route: 'system' },
          { label: 'Basics', route: 'basics' },
          { label: 'Self-care' },
          { label: 'Kids' },
          { label: 'Home' },
          { label: null, spacer: true },
          { label: 'API', route: 'api' },
          { label: 'Settings', route: 'settings' },
        ]
      : [
          { label: 'Sync' },
          { label: 'Logs' },
          { label: 'System', route: 'system' },
          { label: 'Basics' },
          { label: 'Self-care' },
          { label: 'Kids' },
          { label: 'Home' },
          { label: null, spacer: true },
          { label: 'Settings' },
        ]
    return layoutView === 'desktop' ? result : result.reverse()
  }, [layoutView, me])

  return (
    <div className="min-h-[100dvh] grid leading-[1.5rem]" data-lot-genesis="true">
      <Page>{children}</Page>
      {!hideNav && (
        <div
          id="nav"
          className="sticky bottom-0 left-0 right-0 self-end transition-opacity"
        >
          <div className="px-16 phone:px-32 tablet:px-48 desktop:px-64 mb-16 phone:mb-32 tablet:mb-48 desktop:mb-64">
            <nav
              className={cn(
                'flex gap-8 phone:gap-6 -mb-4',
                'flex-wrap-reverse tablet:flex-wrap',
                'flex-row-reverse tablet:flex-row',
                'justify-end tablet:justify-start'
              )}
            >
              {navLinks.map((link, i) => {
                const isActive = link.route === currentRoute
                return link.spacer ? (
                  <div
                    key={link.label ?? i}
                    className="flex-grow tablet:block hidden"
                  />
                ) : (
                  <Button
                    key={link.label}
                    kind="secondary-rounded"
                    className={cn(
                      'mb-4 flex-shrink-0',
                      !link.route && 'opacity-30 pointer-events-none',
                      isActive && (isMirrorOn
                        ? 'bg-white/20 hover:bg-white/30'
                        : 'bg-acc text-bac hover:bg-acc/90')
                    )}
                    onClick={link.route ? () => goTo(link.route!) : undefined}
                    disabled={!link.route}
                  >
                    {link.label}
                  </Button>
                )
              })}
            </nav>
          </div>
        </div>
      )}
    </div>
  )
}
