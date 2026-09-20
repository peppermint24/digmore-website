# Reference-aligned typography and dark palette

## Source measured, not inferred from brand colors
On 20 September 2026 the reference was inspected at https://www.jcb.com/en-IN/ and https://www.jcb.com/assets/css/main.css.
Read-only reference browser: Chrome, viewport 1440 × 1000, dark color scheme. Body selected `dark-mode`.
Reference audit logs: https://github.com/peppermint24/digmore-website/actions/runs/35488833721 (job 106020051687).
The earlier stylesheet audit is in run 35488756172.

## Actual reference measurements
- Body: JCBEuro, 16px / 24px, normal letter spacing; dark background #262626 and text #F2F2F2.
- Hero heading: JCBEuro BoldCondensed, 64px / 76px, normal spacing and no forced uppercase.
- Section heading: JCBEuro BoldCondensed, 37px / 44px.
- Navigation and medium buttons: JCBEuro Bold, 18px / 27px.
- Primary yellow #FCB026; hover #E19D22; button text #262626.
- Primary button radius 4px, reference padding 20px 16px (69px computed height).
- Dark secondary surface #181818; raised surfaces #3E3E3E; muted text #BCBCBC.
- Reference header approximately 88px tall at 1440px.
- Source spacing tokens: 8, 16, 20, 28, 32, 48, 64, 96 and 128px.

## Implementation and limits
- Replaced the previous layered warm/blue-charcoal CSS with a single neutral-charcoal stylesheet.
- Changed the actual font requests, not just fallback names: Saira for body/navigation and Saira Semi Condensed Bold for headings, served through Google Fonts.
- These are substitutes for JCBEuro, NOT the identical typefaces. No JCB font binaries, logo, photographs or site copy are bundled or hotlinked. A closer exact-font reproduction requires an appropriately licensed font supplied/authorized for the project.
- Matched the measured desktop type sizes, normal tracking, authored sentence case, color values, button geometry and header height.
- Replaced small editorial labels, all-caps slogans and vague copy with readable product/enquiry language.
- The selected Pexels application image stays. The split image composition is tailored to its portrait framing, not claimed to duplicate JCB's complete homepage.
- Categories use existing catalogue references; no fabricated product photos or new material/performance claims.
- Only the homepage layout is updated. Product, About and Contact routes still have their existing design.
- This document supersedes the aesthetic guidance in REDESIGN-NOTES.md and DARK-THEME-NOTES.md.

## Verification
Local source/palette checks: 14 passing tests before commit. These are not full accessibility certification.
The Design review workflow runs npm ci, the source tests, a real Astro build and Chrome review of the built output.
The browser review requires actual image and webfont loading, checks 8 viewport widths and menu operation (including no JavaScript), checks route availability, and saves desktop/mobile screenshots plus a JSON report. Check the workflow result for the exact latest commit; do not assume tests have passed from this description alone.
The original 13-test suite and full Astro build were already successfully verified in the reference-audit runs.

## Pre-launch issues remain
npm ci on the existing lockfile reported 20 dependency advisories: 2 low, 2 moderate, 15 high and 1 critical. These are package-audit findings, not proof of an exploited site; dependency triage/remediation remains a separate pre-launch task. No unsafe blanket npm audit fix --force was applied during a visual revision.
Generated docs, CNAME, production configuration and base branch are not modified or published. No customer form submission or WhatsApp message is made during tests.
