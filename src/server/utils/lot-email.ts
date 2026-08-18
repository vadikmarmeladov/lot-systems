/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const lotEmailTemplate = (
  senderName: string,
  message: string,
  isCohortMatch?: boolean
) => `
✉️ LOT Email

From: ${senderName} (LOT Community)
${isCohortMatch ? 'This message was sent by one of your Cohort Matches.\n' : ''}
${message}

—
Sent via LOT Log ("/email to ...") · brand.lot-systems.com
`.trim()

export async function sendLotEmail(
  to: string,
  senderName: string,
  message: string,
  isCohortMatch?: boolean
) {
  const { data, error } = await resend.emails.send({
    from: 'auth@lot-systems.com',
    to: [to],
    subject: `LOT Email — ${senderName} sent you a message`,
    text: lotEmailTemplate(senderName, message, isCohortMatch),
  })

  if (error) {
    console.error('LOT Email sending error:', error)
    throw new Error('Failed to send LOT Email')
  }

  return data
}
