# Cloudcast — logo guidelines

## 1. The logo

The C is the sun's path across the day; the dot past its tip is the sun now. It is the same idea as the dashboard's
sundial and its orange "Now" mark, so the logo and the product say one thing.

| File | Use |
| --- | --- |
| `cloudcast-horizontal.svg` | Default: headers, documents, share images |
| `cloudcast-stacked.svg` | Square-ish spaces: covers, stickers, splash |
| `cloudcast-symbol.svg` | The mark alone, 48 px and up |
| `cloudcast-symbol-small.svg` | The mark alone, 16–48 px (heavier C, bigger sun) |
| `cloudcast-wordmark.svg` | Where the mark already appears nearby |
| `*-reversed.svg` | On graphite or any dark background (the C is thinned so it doesn't look heavier) |
| `*-black.svg`, `*-white.svg`, `*-mono-ff6900.svg` | One-colour print, embossing, and on photos or the brand orange |
| `favicon.svg` | Browser tab; switches its ink in dark mode |

Web icons in `public/`: `favicon.ico` (16/32/48), `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`,
`icon-192.png`, `icon-512.png`, `maskable-512.png`, `og-image.png`.

## 2. Clear space

Keep one sun-diameter of space on every side (36 units on the 256 grid; about 14% of the symbol's height).

## 3. Minimum size

- Symbol: 48 px for `cloudcast-symbol.svg`; below that, `cloudcast-symbol-small.svg` down to 16 px.
- Horizontal lockup: 28 px tall (its viewBox height); the app header uses 36 px.

## 4. Colour

| | HEX | RGB | CMYK (approx.) | Pantone (nearest) |
| --- | --- | --- | --- | --- |
| Ink | `#14161A` | 20 22 26 | 23 15 0 90 | Black 6 C |
| Light ink, on dark | `#EDEDF0` | 237 237 240 | 1 1 0 6 | Cool Gray 1 C |
| Sun orange | `#FF6900` | 255 105 0 | 0 65 100 0 | 1505 C |
| Graphite tile | `#131416` | 19 20 22 | 14 9 0 91 | Black 6 C |

The orange belongs to the sun only. Approved backgrounds: white and light greys (full colour), graphite and black
(reversed), photos and the brand orange (one-colour white or black).

## 5. Typography

The wordmark is Figtree SemiBold, outlined, tracked −1%. The interface uses Figtree, with Geist Mono for readouts.
Both are under the SIL Open Font License, which allows logo use.

## 6. Don'ts

- Don't put the full-colour mark on the brand orange: the sun disappears. Use one-colour white.
- Don't colour the C orange, or the sun anything but orange (except in one-colour versions).
- Don't move, resize or detach the sun, or add a cloud, rays or a container to the mark.
- Don't use `cloudcast-symbol.svg` below 48 px; switch to the small cut.
- Don't stretch, rotate, outline or add shadows or gradients.

## 7. Rebuilding

`python3 design/logo/build.py` rewrites every master from exact geometry (needs `fonttools` and `brotli`). The one-colour
variants come from the logo-design skill's `export_variants.py`; `board.html` is the presentation board built from
`board-spec.json`. Not checked: trademark clearance. Run a professional search before registering the mark.
