<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT Systems / Doctrine

rev A

Distilled, stable principles. Cited by clause number in future reports instead
of restating findings in full prose once they've proven stable across sessions.

--------------------------------------------------------------------------------

[D-001 rev A]  On RENDER-ISOLATION: any recordSignal()/atom.set() guarded by a
               "record once per mount" ref check must sit inside useEffect, not
               directly in the component render body. A render-body write
               cascades a synchronous re-render into every other subscriber of
               that store while React is still mid-paint of the calling
               widget. Confirmed recurring pattern across 6 widgets over 2
               sessions (SR-20260719-01 System.tsx quantumState;
               SR-20260727-01 GoalJourneyWidget, CohortConnectWidget,
               MicroImageWidget, InterventionsWidget, ChakraErgonomicsWidget).
               Supersedes prose in both reports — cite this clause going
               forward instead of re-describing the mechanism.

[D-002 rev A]  On GREEN-GATE: no artifact advances past CHECK B red. Fix-loop
               or PLAN-B. (First formal doctrine entry for a principle already
               implicit in every prior session report's push gate.)

[D-003 rev A]  On SIGNAL-GAP (PROVISIONAL — 1st occurrence, not yet a doctrine
               clause, tracked here as an environment fact): WIDGETS.md is
               documentation, not a contract enforced by any check. Widget
               authors have twice (QuantumSignWidget, IntentionsWidget)
               shipped a documented signal that was never wired. No action
               beyond recording — will fold into a real clause if this
               recurs a 3rd time.
