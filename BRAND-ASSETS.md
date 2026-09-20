# Digmore supplied logo

The user supplied the full Digmore excavator/mountain badge on 20 September 2026, including the wording "DIGMORE" and "Dig more, build more!".

## Web asset

- `public/images/brand/digmore-logo.webp`: 384 x 384, 21,706 bytes.
- SHA-256: `fa75cf797d4f786f9aaf14b18bd75bb6cd4e023a7c85556f37a1d1df11afdafa`.
- Web derivative of the user-provided 1024 x 1024 image: resized and re-encoded, not redrawn, cropped, recolored or replaced with generated artwork.
- The original has an opaque white background. That background is retained; the asset is deliberately displayed on a white badge rather than using blend modes or destructive background removal.
- The original full-resolution upload remains in the conversation; this repository asset is the optimized derivative, not the archival original.

## Placement

`src/components/BrandLogo.astro` replaces the placeholder lettering in the homepage header and footer.

- Desktop header: 96 x 96, with a 112px header content area.
- Mobile header: 80 x 80, with a 96px header content area.
- Footer: 192 x 192, using the 384px asset at 2x resolution.
- Accessible home link, explicit image dimensions and `object-fit: contain` preserve the full emblem and avoid stretching.
- Both placements use the same locally served asset. No external image host is required for the logo.

The existing charcoal palette, yellow controls, typefaces, homepage copy and stock hero photo are unchanged. The logo's original yellow is not recolored to the UI yellow.

This is still the homepage design branch, not a production publication. Other routes, the existing favicon, generated `docs/`, CNAME and hosting settings are untouched. A dedicated transparent/vector master and simplified small-size mark can be considered separately; neither is fabricated by this revision.

## Checks

Four source/integrity checks are added in `tests/brand-logo.test.mjs`. The built-site browser review also requires both real logo instances to load and checks their dimensions, containment and lack of color filters at eight viewport widths. Consult the current workflow result for actual pass/fail status.
