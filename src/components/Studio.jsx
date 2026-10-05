import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { go } from './Common'

const CHIPS = [['work', 'Projects'], ['models', 'Models'], ['sketchbook', 'Sketchbook'], ['materials', 'Materials'], ['thinking', 'Thinking'], ['services', 'Services'], ['book', 'Book a consultation']]

// Every object in the room is a doorway: hot groups carry userData.to (route) + label.
export default function Studio({ projects, sketches }) {
  const box = useRef(), tag = useRef(), api = useRef({})

  useEffect(() => {
    const el = box.current, W = () => el.clientWidth, H = () => el.clientHeight
    const r = new THREE.WebGLRenderer({ antialias: true, alpha: true }); r.setPixelRatio(Math.min(devicePixelRatio, 2)); r.setSize(W(), H())
    r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap; el.prepend(r.domElement)
    const s = new THREE.Scene(); s.fog = new THREE.Fog(0x4a4234, 18, 34)
    const cam = new THREE.PerspectiveCamera(38, W() / H(), .1, 60)
    s.add(new THREE.HemisphereLight(0xffe6c0, 0x7a5c3c, .42))
    const sun = new THREE.DirectionalLight(0xffd9a0, .62); sun.position.set(-7, 9, 4); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048)
    Object.assign(sun.shadow.camera, { left: -10, right: 10, top: 10, bottom: -10 }); s.add(sun)

    const M = (c, rg = .8) => new THREE.MeshStandardMaterial({ color: c, roughness: rg }), B = (w, h, d) => new THREE.BoxGeometry(w, h, d)
    const add = (g, m, x, y, z, p = s) => { const o = new THREE.Mesh(g, m); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; p.add(o); return o }
    const grp = (p, x, y, z) => { const g = new THREE.Group(); g.position.set(x, y, z); p.add(g); return g }
    const hot = []; const mk = (g, to, label) => { g.userData = { to, label }; hot.push(g); return g }
    const WOOD = 0x9a6b40, DARK = 0x4a3524

    // room
    add(B(44, .2, 30), M(0x8a6b4a, .75), 0, -1.7, 0); add(B(44, 18, .3), M(0xb8ad92, 1), 0, 7, -6.5)
    const rug = add(new THREE.CylinderGeometry(5.6, 5.6, .03, 48), M(0x8a9a6c, 1), 0, -1.58, 1.4); rug.scale.z = .55
    // window with soft light
    const win = grp(s, -7.2, 5, -6.3); [[0, 1.7, 3.4, .16], [0, -1.7, 3.4, .16], [-1.7, 0, .16, 3.4], [1.7, 0, .16, 3.4], [0, 0, .08, 3.4], [0, 0, 3.4, .08]].forEach(([x, y, w, h]) => add(B(w, h, .3), M(DARK), x, y, 0, win))
    win.add(new THREE.Mesh(new THREE.PlaneGeometry(3.3, 3.3), new THREE.MeshBasicMaterial({ color: 0xf6dfa8, transparent: true, opacity: .75 })))

    // framed project art on the wall (textures come from uploads)
    const art = [], tones = [0xc9a982, 0x8a9a76, 0xb5694a]
    ;[[-3.1, 4.3, 1.7, 2.2, .02], [-.8, 4.6, 1.4, 1.8, -.02], [1.4, 4.1, 2, 1.5, .015]].forEach(([x, y, w, h, rot], i) => {
      const g = grp(s, x, y, -6.25); g.rotation.z = rot
      add(B(w + .3, h + .3, .12), M(0x4a3524), 0, 0, 0, g); add(B(w + .1, h + .1, .04), M(0xf4ecdc), 0, 0, .06, g)
      const m = M(tones[i], .9); const p = add(new THREE.PlaneGeometry(w - .3, h - .3), m, 0, 0, .09, g); p.castShadow = false; art.push(m); mk(g, 'work', 'Projects')
    })
    // pinned floor-plan sheets
    const sheets = []
    ;[[4, 3.9, .04], [5.7, 4.3, -.05]].forEach(([x, y, rot]) => {
      const g = grp(s, x, y, -6.3); g.rotation.z = rot; add(B(1.5, 2, .03), M(0xf8f2e6, 1), 0, 0, 0, g)
      const m = M(0xffffff, 1); const p = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.8), m); p.position.z = .02; g.add(p); sheets.push(m)
      add(new THREE.SphereGeometry(.07), M(0xa4553a), 0, .9, .05, g); mk(g, 'sketchbook', 'Sketchbook')
    })
    // shelf: material samples + journals
    const sh = grp(s, 7.4, 2.4, -6); add(B(2.8, .12, .8), M(WOOD, .6), 0, 0, 0, sh)
    const sm = mk(grp(sh, -.75, .06, 0), 'materials', 'Materials'); [[0xa4553a, 0], [0x8a5a33, .52], [0xe3d8c1, 1.04]].forEach(([c, x]) => add(B(.45, .32, .4), M(c, .95), x - .1, .16, 0, sm))
    const jr = mk(grp(sh, .85, .06, 0), 'thinking', 'Journal'); [[0x4d5a43, .6], [0xa4553a, .75], [0xd9c9a5, .5]].forEach(([c, h], i) => add(B(.14, h + .3, .5), M(c), i * .17, (h + .3) / 2, 0, jr))
    add(new THREE.CylinderGeometry(.18, .13, .3, 12), M(0xc98b63), .2, .27, .1, sh)

    // table
    const T = grp(s, 0, 0, 0); add(B(9.4, .45, 4.4), M(WOOD, .55), 0, 0, 0, T); [[-4.3, -1.9], [4.3, -1.9], [-4.3, 1.9], [4.3, 1.9]].forEach(([x, z]) => add(B(.4, 1.5, .4), M(0x6e4527), x, -.97, z, T))
    // floor plan on the desk
    const plan = mk(grp(T, -2.5, .26, .9), 'sketchbook', 'Sketchbook'); plan.rotation.y = .2; add(B(3.2, .03, 2.2), M(0xf8f2e6, 1), 0, 0, 0, plan)
    const pm = M(0xffffff, 1), pp = new THREE.Mesh(new THREE.PlaneGeometry(3, 2), pm); pp.rotation.x = -Math.PI / 2; pp.position.y = .02; plan.add(pp); sheets.push(pm)
    const ln = new THREE.LineSegments(new THREE.EdgesGeometry(B(2.2, .01, 1.4)), new THREE.LineBasicMaterial({ color: 0x4a3a2a })); ln.position.y = .03; plan.add(ln)
    // architectural model — layers lift when hovered
    const model = mk(grp(T, 1.2, .24, -.2), 'models', 'Models'); add(B(3.4, .1, 2.6), M(0xcbb48a), 0, 0, 0, model)
    const lay = [], home = []; const lv = (w, h, d, x, y, c) => { const g = grp(model, x, y, 0); add(B(w, h, d), M(c, .9), 0, 0, 0, g); for (let i = 0; i < 3; i++) add(B(.34, h * .5, .04), M(DARK), -w / 3 + i * w / 3, 0, d / 2 + .01, g); lay.push(g); home.push(y) }
    lv(2.4, .6, 1.6, 0, .35, 0xe7d6b6); lv(1.8, .55, 1.4, -.3, .95, 0xd9b88f); lv(1.2, .5, 1, .2, 1.45, 0xc5764b)
    const roof = add(new THREE.CylinderGeometry(.75, .75, 1.1, 3), M(0x8f4a2c), .2, 2, 0, model); roof.rotation.set(Math.PI / 2, Math.PI / 2, 0); lay.push(roof); home.push(2)
    // bricks — separate objects
    const br = mk(grp(T, -3.6, .22, -1.1), 'materials', 'Materials')
    for (let i = 0; i < 7; i++) { const b = add(B(.62, .2, .3), M(i % 2 ? 0xa8452a : 0xb9552f, .95), (i % 3) * .66 + (i > 4 ? .3 : 0), (i > 2 && i < 6 ? .2 : 0) + (i === 6 ? .4 : 0) + .1, 0, br); b.rotation.y = (Math.sin(i * 7) * .12) }
    // calendar (book) + phone (contact) + mug
    const cal = mk(grp(T, 3.9, .22, 1.2), 'book', 'Book a consultation'); add(B(.95, .06, .6), M(0xd9c9a5), 0, 0, 0, cal); const pg = add(B(.85, .62, .05), M(0xf8f2e6, 1), 0, .34, 0, cal); pg.rotation.x = -.25; add(B(.85, .14, .06), M(0xa4553a), 0, .56, .02, cal).rotation.x = -.25
    const ph = mk(grp(T, 3.7, .24, -.6), 'contact', 'Contact'); add(B(.36, .04, .72), M(0x3a3028, .3), 0, 0, 0, ph).rotation.y = .3
    add(new THREE.CylinderGeometry(.17, .15, .3, 16), M(0xf3e6c8), -.4, .38, 1.75, T)

    // plant in the corner
    const P = mk(grp(s, -6.4, -1.6, -3), 'about', 'About Tanvi'); add(new THREE.CylinderGeometry(.55, .4, .9, 24), M(0xb5553a), 0, .45, 0, P); add(new THREE.CylinderGeometry(.5, .5, .06, 24), M(0x3b2a1a), 0, .9, 0, P)
    const leaves = []; for (let i = 0; i < 9; i++) { const st = grp(P, 0, .9, 0); st.rotation.set(0, i / 9 * Math.PI * 2, .25 + (i % 3) * .13); const L = 1.4 + (i % 4) * .3
      add(new THREE.CylinderGeometry(.02, .03, L, 6), M(0x4c6138), 0, L / 2, 0, st); add(new THREE.SphereGeometry(.38, 12, 8), M(0x6f8a4e, .6), 0, L + .15, 0, st).scale.set(.5, 1.1, .12); leaves.push(st) }
    // stool
    const st = grp(s, 6.2, -1.6, -1.8); add(new THREE.CylinderGeometry(.45, .45, .1, 20), M(WOOD), 0, 1.3, 0, st); [0, 2.1, 4.2].forEach(a => add(new THREE.CylinderGeometry(.04, .05, 1.3, 6), M(0x6e4527), Math.cos(a) * .3, .65, Math.sin(a) * .3, st))

    // standing floor lamp (opens Services)
    const lamp = mk(grp(s, -5.5, -1.6, -0.2), 'services', 'Services')
    add(new THREE.CylinderGeometry(.5, .55, .08, 24), M(0x5c4630, .5), 0, .04, 0, lamp)
    add(new THREE.CylinderGeometry(.045, .045, 4.4, 10), M(0xb08d57, .4), 0, 2.28, 0, lamp)
    const shade = add(new THREE.CylinderGeometry(.55, .82, .95, 28, 1, true), new THREE.MeshStandardMaterial({ color: 0xf3e6c8, emissive: 0x7a5a2a, side: 2, roughness: .7 }), 0, 4.6, 0, lamp)
    add(new THREE.SphereGeometry(.2, 12, 10), new THREE.MeshBasicMaterial({ color: 0xfff2d0 }), 0, 4.4, 0, lamp)
    const pl = new THREE.PointLight(0xffc880, 1.5, 20); pl.position.set(0, 4.2, 0.6); lamp.add(pl)

    // uploads → textures
    const tl = new THREE.TextureLoader(), tone = i => [0xc9a982, 0x8a9a76, 0xb5694a][i]
    const apply = (m, url, fallback) => { if (!url) { m.map = null; m.color.setHex(fallback); m.needsUpdate = true; return } tl.load(url, t => { m.map = t; m.color.setHex(0xffffff); m.needsUpdate = true }) }
    api.current.art = (i, url) => apply(art[i], url, tone(i)); api.current.sheet = (i, url) => apply(sheets[i], url, 0xf1e9d8)

    // interaction
    const ray = new THREE.Raycaster(), mp = new THREE.Vector2(9, 9); let mx = 0, my = 0, hov = null, target = 0, ex = 0
    const pick = () => { ray.setFromCamera(mp, cam); const h = ray.intersectObjects(hot, true)[0]; let o = h && h.object; while (o && !o.userData.to) o = o.parent; return o || null }
    const glow = (g, on) => g && g.traverse(o => { const m = o.material; if (m && m.emissive) { if (m.userData.e0 === undefined) m.userData.e0 = m.emissive.getHex(); m.emissive.setHex(on ? 0x4a3a18 : m.userData.e0) } })
    const aim = e => { const b = el.getBoundingClientRect(); mx = (e.clientX - b.left) / b.width - .5; my = (e.clientY - b.top) / b.height - .5; mp.set(mx * 2, -my * 2) }
    const move = e => {
      // Hover labels are useful with a mouse, but touch devices should not
      // constantly trigger hover state while scrolling/tapping.
      if (e.pointerType && e.pointerType !== 'mouse') return
      aim(e); const h = pick()
      if (h !== hov) { glow(hov, false); glow(h, true); hov = h; target = h && h.userData.to === 'models' ? 1 : 0; el.style.cursor = h ? 'pointer' : 'default' }
      const t = tag.current; if (t) { const b = el.getBoundingClientRect(); t.textContent = h ? h.userData.label + ' →' : ''; t.style.opacity = h ? 1 : 0; t.style.left = e.clientX - b.left + 'px'; t.style.top = e.clientY - b.top + 'px' }
    }
    const click = e => { aim(e); const h = pick(); if (h) go(h.userData.to) }
    el.addEventListener('pointermove', move); el.addEventListener('click', click)
    // Keep the original desktop composition. Only tablet/phone aspect ratios
    // receive a wider field of view and a farther camera distance.
    const fitCamera = () => {
      const aspect = W() / Math.max(H(), 1)
      const mobile = aspect < .82
      const tablet = !mobile && aspect < 1.15
      cam.aspect = aspect
      cam.fov = mobile ? 52 : tablet ? 45 : 38
      cam.updateProjectionMatrix()
      return { mobile, tablet }
    }
    const rs = () => { r.setSize(W(), H()); fitCamera() }; addEventListener('resize', rs)
    let raf, t0 = 0, cx = 0, cy = 4.2
    const loop = () => {
      raf = requestAnimationFrame(loop); t0 += .01
      const { mobile, tablet } = fitCamera()
      const d = mobile ? 24.5 : tablet ? 18 : 13.5
      const side = mobile ? .25 : tablet ? -.25 : -1
      const lookX = mobile ? .15 : tablet ? -.55 : -1.2
      const lookY = mobile ? 1.35 : 1.5
      cx += (mx * (mobile ? 1.8 : 4) + side - cx) * .05
      cy += ((mobile ? 4.0 : 4.2) - my * (mobile ? 1.0 : 1.6) - cy) * .05
      cam.position.set(cx, cy, cam.position.z + (d - cam.position.z) * .05)
      cam.lookAt(lookX, lookY, -1.2)
      ex += (target - ex) * .08; lay.forEach((l, i) => (l.position.y = home[i] + ex * i * .55))
      leaves.forEach((l, i) => (l.rotation.x = Math.sin(t0 + i) * .03)); shade.rotation.y += .002
      r.render(s, cam)
    }
    fitCamera(); cam.position.z = 15; loop()
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', rs); el.removeEventListener('pointermove', move); el.removeEventListener('click', click); r.dispose(); r.domElement.remove() }
  }, [])

  const key = [...projects.slice(0, 3), ...sketches.slice(0, 2)].map(x => x.id).join()
  useEffect(() => { [0, 1, 2].forEach(i => api.current.art?.(i, projects[i]?.img)); [0, 1, 2].forEach(i => api.current.sheet?.(i, sketches[i]?.img)) }, [key])

  return (
    <div id="studio" ref={box}>
      <div className="tag" ref={tag} />
      <div className="hero"><div className="kick">ARCHITECTURE STUDIO</div><h1>Step into<br />Tanvi’s studio.</h1><p>Every object is a door — tap the frames, model, plans or the lamp.</p></div>
      <div className="chips">{CHIPS.map(([k, l]) => <a key={k} href={'#/' + k}>{l}</a>)}</div>
    </div>
  )
}
