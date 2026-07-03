/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import { createRouter, openPage } from '@nanostores/router'

type Routes = {
  system: void
  settings: void
  api: void
  sync: void
  status: void
  basics: void
  adminUsers: void
  adminUser: 'userId'
  logs: void
  dm: 'userId'
}

export const router = createRouter<Routes>({
  system: '/',
  settings: '/settings',
  api: '/api',
  sync: '/sync',
  status: '/status',
  basics: '/basics',
  adminUsers: '/us',
  adminUser: '/us/:userId',
  logs: '/log',
  dm: '/dm/:userId',
})

export const goTo = <P extends keyof Routes>(
  page: P,
  params: Record<string, string> = {}
  // @ts-ignore FIXME:
) => {
  openPage(router, page, params)
}
