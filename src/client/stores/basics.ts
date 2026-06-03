/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import { atom } from 'nanostores'
import type { RationStatus, RationRoster, RationIssue } from '#shared/types'

export const rationStatus = atom<RationStatus | null>(null)
export const rationRoster = atom<RationRoster | null>(null)
export const rationIssueCount = atom<number>(0)
export const rationNextIssueDate = atom<string | null>(null)
export const rationIssues = atom<RationIssue[]>([])
export const rationLoading = atom<boolean>(false)
export const rationError = atom<string | null>(null)
