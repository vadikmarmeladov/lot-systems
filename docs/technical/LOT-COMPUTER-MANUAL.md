<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

================================================================================
LOT SYSTEMS CORPORATION
DOCUMENT: LOT-COMPUTER-MANUAL
TITLE:    LOT® Computer — Owner's Manual (v1.0 Pilot Unit)
CLASS:    Public — ships with unit / PDF export (brief point 7)
DATE:     2026-08-03
================================================================================

--------------------------------------------------------------------------------
WHAT THIS IS
--------------------------------------------------------------------------------

LOT® Computer is a flat stainless steel terminal that sits on your desk and
shows you exactly one thing, at exactly the right moment: a short line of
text from your LOT® account. No app to check. No feed to scroll. When there
is nothing to say, the screen is dark.

--------------------------------------------------------------------------------
IN THE BOX
--------------------------------------------------------------------------------

  - 1x LOT® Computer unit (40mm x 40mm x 6.8mm, 316L stainless steel)
  - 1x LOT® Plinth wireless charging base
  - 1x USB-C cable (charges the Plinth, not the unit directly)
  - This manual

--------------------------------------------------------------------------------
SETUP
--------------------------------------------------------------------------------

  1. Place the unit polished-side-down on the LOT® Plinth. A single LED
     ring lights briefly to confirm it is charging.
  2. On your phone or computer, sign in to your LOT® Usership account and
     go to lot-systems.com/computer/setup.
  3. Follow the on-screen pairing steps. This takes under two minutes and
     you will not need to do it again unless you change WiFi networks.
  4. Once paired, place the unit anywhere on your desk within WiFi range —
     it no longer needs to sit on the Plinth except to recharge.

--------------------------------------------------------------------------------
USING IT
--------------------------------------------------------------------------------

  THE SCREEN         Shows a short message when your LOT® account has
                      something for you — a routine reminder, a weather
                      note, a badge — and returns to dark on its own after
                      a few seconds. It does not stay lit. It is not a
                      clock. Nothing is lost if you miss it; anything
                      important is also in your LOT® account when you next
                      open it.

  THE COPY BUTTON     Press it while a message is showing, and that
                      message is saved to your Log tab on lot-systems.com —
                      automatically, with no typing. Press it when nothing
                      is showing, and nothing happens. It has exactly one
                      job.

  CHARGING            Set it on the LOT® Plinth. A full charge from empty
                      takes roughly 1.5-2 hours (measured target — see
                      Technical Notes). Typical use between charges is
                      several days.

--------------------------------------------------------------------------------
ABOUT THE CAMERA
--------------------------------------------------------------------------------

LOT® Computer has a small camera on the same face as the screen. It is used
for exactly one thing: telling whether someone is currently sitting in
front of the unit, so a message can be timed to when you're actually there
instead of interrupting an empty room later.

  - The camera never sends a picture anywhere. Every frame it captures is
    turned into a single yes/no answer on the device itself and thrown
    away in the same instant — there is no path in the device's software
    that connects the camera to the WiFi radio. This is a hardware/
    firmware design choice, documented for engineers in
    docs/technical/LOT-COMPUTER-FIRMWARE.md, Section 03 — not a policy we
    are asking you to trust without being able to check it.
  - The only thing that ever leaves the device because of the camera is a
    single word — "present" or "not present" — timestamped, the same as a
    motion sensor would report.

--------------------------------------------------------------------------------
CARE
--------------------------------------------------------------------------------

  - Wipe with a soft cloth. The polished face is bare stainless steel, not
    coated — it will pick up fingerprints and that is normal, not a defect.
  - Rated for dust and light splashes (IP54 target). Not for submersion,
    dishwashers, or the shower.
  - No user-serviceable parts inside. The two-part shell is sealed at the
    factory; opening it voids the pilot-unit warranty.

--------------------------------------------------------------------------------
TECHNICAL NOTES (PILOT UNIT, v1.0)
--------------------------------------------------------------------------------

  DIMENSIONS       40mm x 40mm x 6.8mm (see Hardware Plan Section 04.4 for
                    why this is 6.8mm and not the original 5mm target, and
                    the roadmap to close that gap)
  MATERIAL          316L stainless steel, two-part construction
  DISPLAY           1.28" round, 240x240
  CONNECTIVITY      WiFi 802.11 b/g/n, Bluetooth LE (setup only)
  CHARGING          Qi-class wireless, via LOT® Plinth
  BATTERY           ~350-400mAh, several days typical use
  SENSORS           Temperature, humidity, pressure, air quality (VOC),
                    motion/orientation, presence (camera-derived, see
                    "About the Camera" above)
  WHAT IS NOT YET   FCC/CE certification and battery shipping certification
  CERTIFIED         are in progress for this pilot batch — see the Hardware
                    Plan, Section 07. Pilot units are for controlled internal
                    and early Usership-tier testing under this manual's
                    guidance, not general retail sale.

--------------------------------------------------------------------------------
SUPPORT
--------------------------------------------------------------------------------

For setup help or questions about your pilot unit, use the same support
channel as your LOT® Usership account at lot-systems.com.

================================================================================
LOT SYSTEMS CORPORATION — brand.lot-systems.com
END LOT-COMPUTER-MANUAL
================================================================================
