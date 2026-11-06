// Runs the Hairline kernel and the sundial figure exactly as their files are
// written (design/hairline): the kernel defines a global-style `HL`, and the
// figure ends by handing itself to `hairline({ … })`.
import kernelSource from "../../design/hairline/kernel.js?raw"
import sundialSource from "../../design/hairline/sundial.js?raw"

export type Sun = { lat: number; rise: number; set: number; now: number }

type Handle = { set(value: number): void; destroy(): void }
type Figure = {
  name: string
  means: string
  range: [number, number, number]
  mount(
    ctx: { stage: HTMLElement; svg: SVGSVGElement; read: { textContent: string }; sun?: Sun },
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

/** Mounts the sundial into `stage` at rest on `sun`; returns its tear-down. */
export function mountSundial(stage: HTMLElement, sun: Sun): () => void {
  const { HL, sundial } = load()
  HL.inject(document)
  stage.setAttribute("data-hairline", sundial.name)
  const svg = HL.mk("svg", { viewBox: "0 0 400 320", "aria-hidden": "true" }, stage)
  const handle = sundial.mount({ stage, svg, read: { textContent: "" }, sun }, sundial.range[1])
  return () => {
    handle.destroy()
    svg.remove()
  }
}
