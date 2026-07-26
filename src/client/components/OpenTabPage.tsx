/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import * as React from 'react'
import { useDocumentTitle } from '#client/utils/hooks'
import { BasicsLedger } from '#client/components/basics/BasicsLedger'

// Public OPEN TAB surface — LOT-FM-001 MONTH 1. No login. No wrapper.
// A stranger reaches this at /open-tab and reads exactly what LOT issues
// and on what terms. Read-only.
export const OpenTabPage = () => {
  useDocumentTitle('Open Tab — LOT Basic Ration', true)

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: '#fff',
        color: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '32px 16px',
      }}
    >
      <div style={{ width: '100%', maxWidth: '720px' }}>
        <BasicsLedger />
        <div
          style={{
            fontFamily: "'Liberation Mono', 'Courier New', monospace",
            fontSize: '13px',
            marginTop: '16px',
            color: '#000',
          }}
        >
          <a href="/" style={{ textDecoration: 'underline' }}>
            LOT SYSTEMS
          </a>
          {' — '}
          this tab does not require an account.
        </div>
      </div>
    </div>
  )
}
