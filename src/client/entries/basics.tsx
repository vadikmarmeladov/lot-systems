/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import * as React from 'react'
import { render } from '#client/utils/render'
import { Basics } from '#client/components/Basics'
import { getMe } from '#client/queries'
import * as stores from '#client/stores'

// OPEN TAB — public. Try to hydrate `me` for a logged-in visitor so
// enrollment state shows; silently stay anonymous/read-only otherwise.
getMe().then((user) => stores.me.set(user)).catch(() => {})

render(<Basics />)
