/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 *
 * OPEN TAB — public, unauthenticated entry point for /basics.
 * No getMe(), no auth store hydration: a stranger reads the ration
 * ledger and doctrine without signing in. LOT-FM-001 Month 1.
 */

import * as React from 'react'
import { Basics } from '#client/components/Basics'
import { render } from '#client/utils/render'
import '#client/stores/theme'
import { Layout } from '#client/components/ui'

const App = () => {
  return (
    <Layout hideNav={true}>
      <Basics />
    </Layout>
  )
}

render(<App />)
