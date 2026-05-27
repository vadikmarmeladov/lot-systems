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

type RouteName = 'sync' | 'logs' | 'system' | 'api' | 'settings'

type NavItem = { href: string | null; label: string | null; spacer?: boolean; route?: RouteName }

const PATH_TO_ROUTE: Record<string, RouteName> = {
  '/sync': 'sync',
  '/log': 'logs',
  '/': 'system',
  '/api': 'api',
  '/settings': 'settings',
}

type Props = {
  children: React.ReactNode
  hideNav?: boolean
}

export const Layout: React.FC<Props> = ({ children, hideNav = false }) => {
  const me = useStore(stores.me)
  const layoutView = useStore(stores.layoutView)
  const isMirrorOn = useStore(stores.isMirrorOn)
  const routerState = useStore(stores.router)
  const none = React.useMemo(() => () => {}, [])
  const currentRoute = routerState?.route ?? 'system'
  const navLinks = React.useMemo<NavItem[]>(() => {
    const result: NavItem[] = me
      ? [
          { href: '/sync', label: 'Sync', route: 'sync' },
          { href: '/log', label: 'Log', route: 'logs' },
          { href: '/', label: 'System', route: 'system' },
          { href: null, label: 'Basics' },
          { href: null, label: 'Self-care' },
          { href: null, label: 'Kids' },
          { href: null, label: 'Home' },
          { href: null, label: null, spacer: true },
          { href: '/api', label: 'API', route: 'api' },
          { href: '/settings', label: 'Settings', route: 'settings' },
        ]
      : [
          { href: null, label: 'Sync' },
          { href: null, label: 'Logs' },
          { href: '/', label: 'System', route: 'system' },
          { href: null, label: 'Basics' },
          { href: null, label: 'Self-care' },
          { href: null, label: 'Kids' },
          { href: null, label: 'Home' },
          { href: null, label: null, spacer: true },
          { href: null, label: 'Settings' },
        ]
    return layoutView === 'desktop' ? result : result.reverse()
  }, [layoutView, me])

  const handleNavClick = React.useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const route = PATH_TO_ROUTE[href]
    if (route) goTo(route)
  }, [])

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
                    href={link.href ?? undefined}
                    kind="secondary-rounded"
                    className={cn(
                      'mb-4 flex-shrink-0',
                      isActive && (isMirrorOn
                        ? 'bg-white/20 hover:bg-white/30'
                        : 'bg-acc text-bac hover:bg-acc/90')
                    )}
                    onClick={link.href ? (e: React.MouseEvent<HTMLAnchorElement>) => handleNavClick(e, link.href!) : none}
                    disabled={!link.href}
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
