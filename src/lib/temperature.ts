// One fixed cold-to-warm scale for every temperature on screen, so 2° and 17°
// always read differently. Stops are in °C; Fahrenheit is converted first.
const STOPS: [number, [number, number, number]][] = [
  [-15, [124, 140, 214]],
  [0, [96, 165, 214]],
  [8, [94, 186, 176]],
  [15, [168, 196, 104]],
  [21, [232, 190, 82]],
  [27, [240, 140, 64]],
  [35, [222, 84, 72]],
]

export function tempColor(value: number, isCelsius: boolean): string {
  const c = isCelsius ? value : ((value - 32) * 5) / 9
  if (c <= STOPS[0][0]) return rgb(STOPS[0][1])
  for (let i = 1; i < STOPS.length; i++) {
    const [t1, c1] = STOPS[i]
    if (c <= t1) {
      const [t0, c0] = STOPS[i - 1]
      const k = (c - t0) / (t1 - t0)
      return rgb([0, 1, 2].map((j) => c0[j] + (c1[j] - c0[j]) * k) as [number, number, number])
    }
  }
  return rgb(STOPS[STOPS.length - 1][1])
}

function rgb([r, g, b]: [number, number, number]) {
  return `rgb(${Math.round(r)} ${Math.round(g)} ${Math.round(b)})`
}
