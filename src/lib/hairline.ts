// Runs the Hairline kernel and the sundial figure exactly as their files are
// written (design/hairline): the kernel defines a global-style `HL`, and the
// figure ends by handing itself to `hairline({ … })`.
import kernelSource from "../../design/hairline/kernel.js?raw"
import sundialSource from "../../design/hairline/sundial.js?raw"

export type Sun = { lat: number; rise: number; set: number; now: number }

type Handle = { set(value: number): void; sun(next: Omit<Sun, "lat">): void; destroy(): void }
export type SundialHandle = { update(next: Omit<Sun, "lat">): void; destroy(): void }
type Figure = {
  name: string
  means: string
  range: [number, number, number]
  mount(
    ctx: { stage: HTMLElement; svg: SVGSVGElement; read: { textContent: string | null }; sun?: Sun },
    value: number
  ): Handle
}
type Kernel = {
  inject(root: Document): void
  mk(tag: string, attrs: Record<string, string>, parent: Element): SVGSVGElement
}

let loaded: { HL: Kernel; sundial: Figure } | null = null

function load() {
  if (loaded) return loaded
  const HL = new Function(`${kernelSource};return HL;`)() as Kernel
  let sundial: Figure | undefined
  new Function("HL", "hairline", sundialSource)(HL, (f: Figure) => {
    sundial = f
  })
  if (!sundial) throw new Error("hairline: the sundial figure did not declare itself")
  loaded = { HL, sundial }
  return loaded
}

/**
 * Mounts the sundial into `stage` at rest on `sun`. `onRead` gets the figure's
 * read-out: "rest", or the hour under the pointer, like "14:00" or "05:00 · dark".
 */
export function mountSundial(
  stage: HTMLElement,
  sun: Sun,
  onRead: (text: string) => void
): SundialHandle {
  const { HL, sundial } = load()
  HL.inject(document)
  stage.setAttribute("data-hairline", sundial.name)
  const svg = HL.mk("svg", { viewBox: "0 0 400 320", "aria-hidden": "true" }, stage)
  let text = ""
  const read = {
    get textContent() {
      return text
    },
    set textContent(value: string | null) {
      text = value ?? ""
      onRead(text)
    },
  }
  const handle = sundial.mount({ stage, svg, read, sun }, sundial.range[1])
  return {
    update: (next) => handle.sun(next),
    destroy: () => {
      handle.destroy()
      svg.remove()
    },
  }
}
