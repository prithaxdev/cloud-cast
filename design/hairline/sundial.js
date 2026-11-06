/**
 * Sundial: a garden sundial on a tapered pedestal. Its 24 hour marks sit on
 * the true hour lines of a horizontal dial for the latitude, so they bunch
 * towards noon; the hours between sunrise and sunset are lit, the night hours
 * dim. The pointer circles the dial and the gnomon's shadow swings to that hour
 * on a spring, and is gone outside daylight, as a real one is. At rest the
 * shadow and the one bright mark sit on the hour now. The slider is the
 * detent: how hard the shadow clicks onto whole hours.
 *
 * `sun` is optional: { lat, rise, set, now } in degrees and decimal hours.
 * The host passes the forecast's; the bench gets a November afternoon.
 */
const {
  Cam, circ, clamp, facing, fillet, fit, hull, lerp, open, poly, prism, proj, rad, ringAt, run, seg,
  spring, stepS, unproj, disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const PR = 60, PT = 6, RD = 50, CH = 55, GL = 30, TK = 2.6;
const COL = [-PT, -50, 13, 18], BASE = [-50, -58, 30];
const SUN = { lat: 40, rise: 7.2, set: 17.5, now: 15.6 };
/**
 * The noon line runs away from the eye, a little off straight, so the dial
 * reads like a clock face (noon at the top, morning left, evening right) and
 * the gnomon stands as a fin that hides neither side's shadow. E is afternoon.
 */
const NA = (247 * Math.PI) / 180, N = [Math.cos(NA), Math.sin(NA)], E = [-Math.sin(NA), Math.cos(NA)];

const wrap24 = (h) => ((h % 24) + 24) % 24;
const hh = (h) => String(Math.round(wrap24(h)) % 24).padStart(2, "0") + ":00";

function mount({ stage, svg, read, sun = SUN }, value) {
  const bag = disposer();
  const sinL = Math.sin(rad(clamp(Math.abs(sun.lat), 15, 65)));
  const GH = GL * Math.tan(rad(clamp(Math.abs(sun.lat), 25, 55)));
  const day = (h) => { const w = wrap24(h); return w >= sun.rise && w <= sun.set; };
  let detent = value;

  const C = Cam(45, 0.5, 2.02);
  fit(C, [[-PR, -PR, 0], [PR, PR, 0], [PR, -PR, 0], [-PR, PR, 0], [N[0] * GL, N[1] * GL, GH], [BASE[2], BASE[2], BASE[1]]], 200, 166);
  const P = proj(C), front = facing(C);

  /** An hour's line on a horizontal dial: tan θ = sin φ · tan H, θ measured from the noon line. */
  const theta = (h) => { const H = rad((h - 12) * 15); return Math.atan2(sinL * Math.sin(H), Math.cos(H)); };
  const onRing = (h, r) => { const t = theta(h), c = Math.cos(t) * r, s = Math.sin(t) * r; return [N[0] * c + E[0] * s, N[1] * c + E[1] * s]; };
  const hourAt = (x, y) => {
    const t = Math.atan2(x * E[0] + y * E[1], x * N[0] + y * N[1]);
    return 12 + (Math.atan2(Math.sin(t), Math.cos(t) * sinL) * 180) / Math.PI / 15;
  };

  const g = mk("g", {}, svg);

  // The pedestal, bottom up: a base slab, then a column that tapers into the dial's underside.
  put(solid(g), prism(P, front, circ(BASE[2]), circ(BASE[2] - 1.6), BASE[1], BASE[0]));
  const [cz1, cz0, rTop, rFoot] = COL, colTop = circ(rTop), colIn = circ(rTop - 1.2);
  put(solid(g), {
    sil: poly(hull(ringAt(P, circ(rFoot), cz0).concat(ringAt(P, colTop, cz1)))),
    crease: open(ringAt(P, run(colIn, front), cz1)),
  });
  put(solid(g), prism(P, front, circ(PR), circ(PR - 2), -PT, 0));

  // The chapter ring the hour marks sit inside.
  mk("path", { d: poly(ringAt(P, circ(CH), 0)), class: "nf lo" }, g);

  const dots = [];
  for (let h = 0; h < 24; h++) {
    const el = flatDot(g, C, h % 6 === 0 ? 2.4 : 1.8, "dot off");
    place(el, P(...onRing(h, RD), 0));
    dots.push(el);
  }

  // The shadow belongs to the gnomon, so it is painted before it: the blade's
  // cast wedge, from the style's root to the foot of its tall edge and out to
  // where the tip falls on the hour line, hatched as an engraver would.
  const shade = mk("path", { class: "nf" }, g), hatch = mk("path", { class: "nf lo" }, g);

  // The gnomon: a filleted right triangle standing on the noon line, its style
  // rising from the centre at the latitude, with a round cut-out and a thickness.
  const blade = fillet([[-1.5, 0], [GL, 0], [GL, GH]], [1.2, 1.6, 2.4]);
  const on = (y) => (p) => P(N[0] * p[0] + E[0] * y, N[1] * p[0] + E[1] * y, p[1]);
  mk("path", { d: poly(blade.map(on(-TK / 2))), class: "lo" }, g);
  mk("path", { d: poly(blade.map(on(TK / 2))), class: "sil" }, g);
  const hole = circ(4.2, 32).map((q) => [GL - 11 + q.u, 9.5 + q.v]);
  mk("path", { d: poly(hole.map(on(TK / 2))), class: "nf lo" }, g);

  const sp = spring(sun.now, { eps: 0.002 });
  let over = null, lit = -1, drawn = NaN;

  function drawShadow() {
    if (sp.x === drawn) return;
    drawn = sp.x;
    if (!day(sp.x)) { shade.setAttribute("d", ""); hatch.setAttribute("d", ""); return; }
    // Long at sunrise and sunset, at its shortest, under the blade, at noon.
    const len = lerp(GL * 1.05, RD + 2, Math.min(1, Math.abs(sp.x - 12) / 3));
    const o = P(0, 0, 0), f = P(N[0] * GL, N[1] * GL, 0), t = P(...onRing(sp.x, len), 0);
    const at = (a, k) => [lerp(o[0], a[0], k), lerp(o[1], a[1], k)];
    shade.setAttribute("d", poly([o, f, t]));
    hatch.setAttribute("d", [0.2, 0.32, 0.44, 0.56, 0.68, 0.8, 0.92].map((k) => seg(at(f, k), at(t, k))).join(""));
  }
  function light(h) {
    const k = Math.round(wrap24(h)) % 24;
    if (k === lit) return;
    lit = k;
    dots.forEach((el, i) => el.setAttribute("class", i === k ? "dot" : day(i) ? "dot m" : "dot off"));
  }

  const B = register(stage, (dt) => {
    const m = stepS(sp, dt);
    drawShadow();
    return m;
  });
  bag.add(B.unregister);

  function retarget() {
    let t = sun.now;
    if (over) { const raw = hourAt(over[0], over[1]); t = lerp(raw, Math.round(raw), detent); }
    while (t - sp.x > 12) t -= 24;
    while (sp.x - t > 12) t += 24;
    sp.t = t;
    light(t);
    read.textContent = over ? hh(t) + (day(t) ? "" : " · dark") : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const w = unproj(C, p[0], p[1], 0);
      if (Math.hypot(w[0], w[1]) < 6) return;
      over = w; retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());

  light(sun.now);
  drawShadow();
  return {
    set: (v) => { detent = v; if (over) retarget(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "sundial",
  means: "A sundial whose daylight hours are lit: circle the dial and the gnomon's shadow swings to that hour.",
  rules: [1, 4, 5, 8],
  range: [0, 0.5, 1],
  tour: [[147, 82], [197, 197], [321, 136], null],
  mount,
});
