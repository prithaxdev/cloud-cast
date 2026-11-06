"""
Builds the Cloudcast logo masters (SVG) from exact geometry.

The mark: a C that is the sun's path across the day, and a dot past its upper
tip that is the sun now. Ink C, brand-orange dot.

Needs fontTools and brotli (to outline Figtree from the woff2 in node_modules):
    python3 -m pip install fonttools brotli
    python3 design/logo/build.py
"""
import math
import os

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
FIGTREE = os.path.join(ROOT, "node_modules/@fontsource-variable/figtree/files/figtree-latin-wght-normal.woff2")

INK, INK_DARK, ORANGE = "#14161A", "#EDEDF0", "#FF6900"
NAME = "Cloudcast"

font = instantiateVariableFont(TTFont(FIGTREE), {"wght": 600})
GLYPHS, CMAP, UPM = font.getGlyphSet(), font.getBestCmap(), font["head"].unitsPerEm
CAP = font["OS/2"].sCapHeight / UPM


def n(v):
    return f"{v:.2f}".rstrip("0").rstrip(".")


def word(size, x0, base, track=-0.01):
    """The name outlined in Figtree SemiBold; returns (path, width)."""
    k, x, out = size / UPM, x0, []
    for i, ch in enumerate(NAME):
        g = CMAP[ord(ch)]
        pen = SVGPathPen(GLYPHS)
        GLYPHS[g].draw(TransformPen(pen, (k, 0, 0, -k, x, base)))
        out.append(pen.getCommands())
        x += GLYPHS[g].width * k + (track * size if i < len(NAME) - 1 else 0)
    return " ".join(out), x - x0


def circle(cx, cy, r):
    return f"M{n(cx - r)} {n(cy)}A{n(r)} {n(r)} 0 1 1 {n(cx + r)} {n(cy)}A{n(r)} {n(r)} 0 1 1 {n(cx - r)} {n(cy)}Z"


def arc(cx, cy, R, ri, a0, a1):
    """A ring segment from a0 to a1 degrees (clockwise, 0 = east) with flat radial cuts."""
    p = lambda r, a: (cx + r * math.cos(math.radians(a)), cy + r * math.sin(math.radians(a)))
    large = 1 if (a1 - a0) % 360 > 180 else 0
    (ox0, oy0), (ox1, oy1), (ix1, iy1), (ix0, iy0) = p(R, a0), p(R, a1), p(ri, a1), p(ri, a0)
    return (f"M{n(ox0)} {n(oy0)}A{n(R)} {n(R)} 0 {large} 1 {n(ox1)} {n(oy1)}L{n(ix1)} {n(iy1)}"
            f"A{n(ri)} {n(ri)} 0 {large} 0 {n(ix0)} {n(iy0)}Z")


def mark(cx, cy, R, ri, cut, sun_at, sun_r):
    """(C path, sun path). The C opens to the right between ±cut degrees."""
    mid = (R + ri) / 2
    sx, sy = cx + mid * math.cos(math.radians(sun_at)), cy + mid * math.sin(math.radians(sun_at))
    return arc(cx, cy, R, ri, cut, 360 - cut), circle(sx, sy, sun_r)


# Master: 256 grid, stroke 34, opening ±45°, the sun at -20° on the stroke's centre line.
# Centred on its own box, then lifted 2 units to sit on the optical centre.
MASTER = mark(130, 126, 96, 62, 45, -20, 18)
# Reversed: light on dark reads heavier, so the C loses 1.5 units and the sun 0.5.
REVERSED = mark(130, 126, 95.25, 62.75, 45, -20, 17.5)
# Small cut for 16–48 px: heavier stroke, bigger sun, nearer horizontal so it doesn't fuse with the tip.
SMALL = mark(128, 128, 112, 66, 45, -12, 26)


def svg(view, title, parts, style=""):
    paths = "".join(f'<path {attr} d="{d}"/>' for attr, d in parts)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{view}" role="img" aria-labelledby="t">'
            f'<title id="t">{title}</title>{style}{paths}</svg>\n')


def write(name, text):
    with open(os.path.join(HERE, name), "w") as f:
        f.write(text)


def colour(m, c=INK):
    return [(f'fill="{c}"', m[0]), (f'fill="{ORANGE}"', m[1])]


# Symbols
write("cloudcast-symbol.svg", svg("0 0 256 256", "Cloudcast", colour(MASTER)))
write("cloudcast-symbol-reversed.svg", svg("0 0 256 256", "Cloudcast", colour(REVERSED, INK_DARK)))
write("cloudcast-symbol-small.svg", svg("0 0 256 256", "Cloudcast", colour(SMALL)))

# Horizontal lockup: cap height centred on the symbol, symbol ≈ 1.75 × cap height.
size = 156
base = 126 + size * CAP / 2
w, ww = word(size, 268, base)
view = f"4 0 {n(268 + ww + 30 - 4)} 256"  # 30 units of clear space each side
write("cloudcast-horizontal.svg", svg(view, "Cloudcast", colour(MASTER) + [(f'fill="{INK}"', w)]))
write("cloudcast-horizontal-reversed.svg", svg(view, "Cloudcast", colour(REVERSED, INK_DARK) + [(f'fill="{INK_DARK}"', w)]))

# Stacked lockup: wordmark under the symbol, centred.
ssize = 104
_, sww = word(ssize, 0, 0)
width = max(256, sww + 64)
dx = (width - 256) / 2
stacked_mark = mark(130 + dx, 126, 96, 62, 45, -20, 18)
sw, _ = word(ssize, (width - sww) / 2, 224 + 44 + ssize * CAP)
write("cloudcast-stacked.svg", svg(f"0 0 {n(width)} {n(224 + 44 + ssize * CAP + 32)}", "Cloudcast", colour(stacked_mark) + [(f'fill="{INK}"', sw)]))

# Wordmark alone
wm, wmw = word(size, 0, size * CAP)
write("cloudcast-wordmark.svg", svg(f"0 0 {n(wmw)} {n(size * CAP)}", "Cloudcast", [(f'fill="{INK}"', wm)]))

# Favicon: the small cut, with a dark-mode ink so the C never disappears on a dark tab strip.
style = f"<style>.c{{fill:{INK}}}@media (prefers-color-scheme:dark){{.c{{fill:{INK_DARK}}}}}</style>"
write("favicon.svg", svg("0 0 256 256", "Cloudcast", [('class="c"', SMALL[0]), (f'fill="{ORANGE}"', SMALL[1])], style))

print("wrote masters to", HERE)
