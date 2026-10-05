import { useEffect, useRef, useState } from 'react'
const AR = { '1:1': 1, '4:3': 4 / 3, '3:4': 3 / 4, '16:9': 16 / 9 }
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const VW = 320

// Drop box → crop / zoom / rotate to fit the frame → preview → save
export default function Uploader({ title, aspect = '4:3', fields = [], noImage, onSave, onClose }) {
  const [ar, setAr] = useState(aspect), [img, setImg] = useState(null), [z, setZ] = useState(1), [o, setO] = useState({ x: 0, y: 0 }), [over, setOver] = useState(false)
  const [v, setV] = useState(() => Object.fromEntries(fields.filter(f => f.opts).map(f => [f.k, f.opts[0]])))
  const [prev, setPrev] = useState(null)
  const cv = useRef(), dr = useRef(), VH = Math.round(VW / AR[ar])

  const lim = () => { const s = Math.max(VW / img.width, VH / img.height) * z; return [(img.width * s - VW) / 2, (img.height * s - VH) / 2] }
  const paint = (c, w, h) => {
    const x = c.getContext('2d'); x.fillStyle = '#cfc4aa'; x.fillRect(0, 0, w, h); if (!img) return
    const s = Math.max(w / img.width, h / img.height) * z, dw = img.width * s, dh = img.height * s, k = w / VW, mx = (dw - w) / 2, my = (dh - h) / 2
    x.drawImage(img, (w - dw) / 2 + clamp(o.x * k, -mx, mx), (h - dh) / 2 + clamp(o.y * k, -my, my), dw, dh)
  }
  useEffect(() => { if (cv.current) paint(cv.current, VW, VH) }, [img, z, o, ar, prev])

  const load = f => {
    if (!f || !f.type.startsWith('image/')) return
    const fr = new FileReader()
    fr.onload = () => { const i = new Image(); i.onload = () => { setImg(i); setZ(1); setO({ x: 0, y: 0 }) }; i.src = fr.result }
    fr.readAsDataURL(f)
  }
  const rotate = () => { const c = document.createElement('canvas'); c.width = img.height; c.height = img.width; const x = c.getContext('2d'); x.translate(c.width, 0); x.rotate(Math.PI / 2); x.drawImage(img, 0, 0); setImg(c); setO({ x: 0, y: 0 }) }
  const preview = () => {
    if (noImage) return setPrev('none')
    const c = document.createElement('canvas'); c.width = 1400; c.height = Math.round(1400 / AR[ar]); paint(c, c.width, c.height); setPrev(c.toDataURL('image/jpeg', .82))
  }
  const ok = (noImage || img) && (!fields.some(f => f.k === 'title') || (v.title || '').trim())
  const set = k => e => setV({ ...v, [k]: e.target.value })

  return (
    <div className="lb" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="x" onClick={onClose}>×</button>
        <h3>{title}</h3>
        {prev ? (
          <>
            <div className="kick">PREVIEW · THIS IS HOW IT WILL APPEAR</div>
            <div className="pv">{prev !== 'none' && <div className="frame"><img src={prev} alt="" /></div>}<div><h4>{v.title}</h4><small>{[v.kind, v.type, v.year, v.location].filter(Boolean).join(' · ')}</small><p>{v.description}</p></div></div>
            <div className="row"><button className="btn ghost" onClick={() => setPrev(null)}>← Back to edit</button><button className="btn" onClick={() => onSave({ ...v, ...(noImage ? {} : { img: prev }) })}>Save to website</button></div>
          </>
        ) : (
          <>
            {!noImage && (!img ? (
              <label className={'drop' + (over ? ' over' : '')} onDragOver={e => { e.preventDefault(); setOver(true) }} onDragLeave={() => setOver(false)} onDrop={e => { e.preventDefault(); setOver(false); load(e.dataTransfer.files[0]) }}>
                <input type="file" accept="image/*" hidden onChange={e => load(e.target.files[0])} />
                <span className="dz-ic">⇪</span><b>Drop an image here</b><small>or click to browse · JPG, PNG, WEBP</small>
              </label>
            ) : (
              <div className="crop">
                <canvas ref={cv} width={VW} height={VH}
                  onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); dr.current = { x: e.clientX, y: e.clientY, o } }}
                  onPointerMove={e => { const d = dr.current; if (!d) return; const [mx, my] = lim(); setO({ x: clamp(d.o.x + e.clientX - d.x, -mx, mx), y: clamp(d.o.y + e.clientY - d.y, -my, my) }) }}
                  onPointerUp={() => (dr.current = null)} />
                <div className="ctl">
                  <label>Zoom<input type="range" min="1" max="3" step=".02" value={z} onChange={e => setZ(+e.target.value)} /></label>
                  <div className="pills">{Object.keys(AR).map(a => <button type="button" key={a} className={ar === a ? 'on' : ''} onClick={() => setAr(a)}>{a}</button>)}</div>
                  <button type="button" className="btn ghost" onClick={rotate}>⟳ Rotate</button>
                  <label className="btn ghost">Change image<input type="file" accept="image/*" hidden onChange={e => load(e.target.files[0])} /></label>
                  <small>Drag the picture to position it inside the frame.</small>
                </div>
              </div>
            ))}
            {fields.map(f => (
              <label key={f.k}>{f.label}
                {f.type === 'area' ? <textarea rows={f.rows || 3} value={v[f.k] || ''} onChange={set(f.k)} /> : f.type === 'select' ? <select value={v[f.k]} onChange={set(f.k)}>{f.opts.map(o => <option key={o} value={o}>{o || '—'}</option>)}</select> : <input value={v[f.k] || ''} onChange={set(f.k)} />}
              </label>
            ))}
            <div className="row"><button className="btn ghost" onClick={onClose}>Cancel</button><button className="btn" disabled={!ok} onClick={preview}>Preview →</button></div>
          </>
        )}
      </div>
    </div>
  )
}
