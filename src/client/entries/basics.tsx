/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

// OPEN TAB — public, unauthenticated entry point for BASIC RATION.
// Served at /basics to logged-out visitors (LOT-FM-001 §4). No app shell,
// no login wall, no store providers — same content a Usership member sees
// inside the app's Basics tab, per doctrine: the ledger is the marketing.
import * as React from 'react'
import { render } from '#client/utils/render'
import { Basics } from '#client/components/Basics'

render(<Basics standalone />)
