# Charcoal Industrial revision — 20 September 2026

This supersedes the light limestone palette in the first design pass. The user's direction is a slightly darker site, with jcb.com as a visual reference, not a request to copy JCB branding or assets.

## Visual changes

- Near-black header/footer (#15181a), charcoal hero (#1b1e21), slate application section and category strip (#272c30).
- Warm yellow accent (#f0b323) for the second headline line, main hero CTA, navigation CTA and small details.
- Neutral light grey (#f2f3f1) retained for product selection and closing content. This is intentionally not an all-black website.
- Existing selected Pexels photo 20760025 and its credits preserved; subtle CSS-only tonal adjustment. No reference-brand photography or proprietary fonts added.
- Square arrow controls, visible keyboard focus on both surface types, dark mobile navigation and forced-colors support.

## Implementation scope

`src/styles/industrial.css` loads after the original homepage stylesheet through `EarthworksLayout.astro`; the browser theme-color meta tag matches the navigation. The homepage structure, photo URLs, product information and contact destinations are unchanged. Other routes keep their existing layout. `docs/`, CNAME, existing deployment settings and other branches are not edited.

## Checks actually performed

- `node --test tests/*.test.mjs`: 13 passing checks (7 existing, 6 new).
- Palette contrast tests cover 11 text/focus pairs. These are token checks, not a full accessibility certification.
- Standalone HTML/CSS checked in system Chromium at 320, 390, 768, 799, 800, 1024, 1440 and 1920 px: no horizontal document overflow and expected computed theme colors.
- Mobile menu: opening, Escape/focus restoration, outside dismissal and breakpoint closure checked. Native menu also checked with JavaScript disabled.
- Reduced-motion and forced-colors behaviors checked.

The local browser checks used blocked external requests: **remote photo and Google Fonts loading were not validated**, and the local environment could not resolve external dependency hosts. These checks are not an Astro production build. Verify the Vercel deployment for the new commit and review the real loaded photo/font rendering before merging. The previous commit's Ready status is not evidence for this revision.

## Reference and release

Visual reference reviewed: https://www.jcb.com/en-IN/
Photo source/license: see PHOTO-CREDITS.md.
Keep PR #3 in draft. Do not merge or promote a deployment to production until the design and complete customer journey are approved.
