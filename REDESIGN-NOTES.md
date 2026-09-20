# Premium Earthworks — first homepage pass

## Isolation
Source: peppermint24/digmore-website, test-access at 6ef364058058efa4dbc3be51dcc32937f07912aa.
Work branch: design/premium-earthworks.
This is a BRANCH, not a GitHub fork. The available GitHub connection exposes branch and commit operations but no repository/fork-creation action. The separately named digmore-websitev2 repository was empty. No existing branch was moved and no live deployment was requested.

## Changes
- A home-only layout and stylesheet: warm limestone, charcoal, restrained amber.
- Photo-led desktop split hero; a stacked mobile layout rather than overlaid mobile text.
- New selected Pexels photo, documented in PHOTO-CREDITS.md.
- Visible product categories from the existing catalogue, rather than invented product renders.
- Native, keyboard-accessible mobile navigation, skip link, focus states and reduced-motion handling.
- Existing product, about and contact routes, phone numbers and WhatsApp contact retained.
- Old homepage testimonials and quantitative performance claims are not carried into this design; they need evidence before reuse.
- No new runtime packages; existing Astro/Tailwind configuration is unchanged.

## Scope
This first pass changes the homepage only. Other routes still use the existing design. It does not change catalogue specifications, make OEM-approval claims, or publish factory images as verified Digmore facilities.

## Validation / before merging
Run `node --test tests/earthworks.test.mjs`, `npm ci`, and `npm run build` in a network-enabled checkout. The existing build output is `docs/`; its generated files and CNAME are deliberately NOT updated in this review branch.

A standalone HTML/CSS assembly can test the homepage layout locally, but is not an Astro production build. Full dependency installation/build and remote asset loading remain launch checks. Review real mobile and desktop photo crops with fonts/images loaded, all existing routes, contact forms and asset licensing before any production merge or publish.

## Checks actually completed
- Seven Node source/structure tests passed (`node --test tests/earthworks.test.mjs`).
- Chromium checked a standalone assembly of the source at 320, 390, 768, 1024, 1440 and 1920 px: no horizontal document overflow.
- Mobile native menu opening, Escape dismissal and focus restoration passed at the mobile widths.
- Those browser checks intentionally blocked external requests; they do NOT verify image/font delivery or an Astro production build.
