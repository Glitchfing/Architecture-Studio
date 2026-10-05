import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { NAV, CONTACT, SHOW_UPLOAD } from '../config'

export const Edit = createContext({ edit: false, unlock: () => false, lock() {}, ask: () => {} })
export const useEdit = () => useContext(Edit)
export const go = p => { location.hash = '/' + p }

export function useRoute() {
  const f = () => location.hash.replace(/^#\/?/, '').split('/')
  const [r, setR] = useState(f())
  useEffect(() => { const h = () => { setR(f()); scrollTo(0, 0) }; addEventListener('hashchange', h); return () => removeEventListener('hashchange', h) }, [])
  return r
}

export function Nav({ active }) {
  const [o, setO] = useState(false)
  return (
    <nav>
      <a href="#/" className="logo">BY TANVI</a>
      <button className="burger" aria-label="menu" onClick={() => setO(!o)}>☰</button>
      <ul className={o ? 'open' : ''}>
        {NAV.map(([k, l]) => <li key={k}><a className={active === k || (k === 'work' && ['models', 'project'].includes(active)) ? 'on' : ''} href={'#/' + k} onClick={() => setO(false)}>{l}</a></li>)}
        <li><a className="btn sm" href="#/book" onClick={() => setO(false)}>BOOK</a></li>
      </ul>
    </nav>
  )
}

export function Footer() {
  const { edit, unlock, lock } = useEdit()
  return (
    <footer>
      <Tree />
      <div><b className="logo">BY TANVI</b><p>Architecture · brick · leaf · light</p></div>
      <div><a href={'mailto:' + CONTACT.email}>{CONTACT.email}</a><br /><a href={'tel:+91' + CONTACT.phone}>+91 {CONTACT.phone}</a></div>
      <button className="lock" onClick={edit ? lock : unlock}>{edit ? '✓ Lock studio' : '✎ Edit studio'}</button>
    </footer>
  )
}

export const Page = ({ kicker, title, intro, onAdd, addLabel = 'Upload', children }) => {
  const { edit, ask } = useEdit()
  return (
    <main className="page"><header><div className="kick">{kicker}</div>
      <div className="hrow"><h1>{title}</h1>{onAdd && (edit || SHOW_UPLOAD) && <button className="btn up" onClick={() => ask(onAdd)}>＋ {addLabel}</button>}</div>
      {intro && <p className="intro">{intro}</p>}</header>{children}</main>
  )
}

export const Pic = ({ it, r = '4/3', tag = 'Sample · upload yours' }) => (
  <div className="pic" style={{ aspectRatio: r }}>{it?.img ? <img src={it.img} alt={it.title || ''} /> : <div className="ph"><span>{tag}</span></div>}</div>
)

export const AddTile = ({ label, onClick }) => {
  const { edit, ask } = useEdit()
  return (edit || SHOW_UPLOAD) ? <button className="addtile" onClick={() => ask(onClick)}><span>+</span>{label}<small>click to upload</small></button> : null
}
export const Del = ({ onClick }) => {
  const { edit } = useEdit()
  return edit ? <button className="del" title="Delete" onClick={e => { e.preventDefault(); e.stopPropagation(); if (confirm('Delete this?')) onClick() }}>×</button> : null
}

export function Tilt({ children, className = '' }) {
  const r = useRef()
  const mv = e => { const b = r.current.getBoundingClientRect(), x = (e.clientX - b.left) / b.width - .5, y = (e.clientY - b.top) / b.height - .5; r.current.style.transform = `perspective(800px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateZ(8px)` }
  return <div ref={r} className={'tilt ' + className} onPointerMove={mv} onPointerLeave={() => (r.current.style.transform = '')}>{children}</div>
}

export function Lightbox({ it, onClose, onDelete }) {
  const { edit } = useEdit()
  return (
    <div className="lb" onClick={onClose}>
      <div className="lbi" onClick={e => e.stopPropagation()}>
        {it.img && <img src={it.img} alt={it.title} />}
        <div className="lbt"><small>{[it.kind, it.scale].filter(Boolean).join(' · ')}</small><h3>{it.title}</h3>{it.materials && <p><i>{it.materials}</i></p>}<p>{it.description}</p>
          {edit && <button className="btn ghost" onClick={() => { if (confirm('Delete this?')) { onDelete(it.id); onClose() } }}>Delete</button>}</div>
        <button className="x" onClick={onClose}>×</button>
      </div>
    </div>
  )
}

export const Tree = ({ className = 'tree' }) => (
  <svg className={className} viewBox="0 0 120 140" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
    <path d="M60 138V60M60 100C44 94 34 84 30 70M60 84C74 78 84 68 88 54M60 66C52 58 50 48 52 38" />
    {[[30, 70], [88, 54], [52, 38], [40, 52], [76, 40], [60, 24], [24, 88], [96, 74]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="9" ry="14" transform={`rotate(${(i % 2 ? 1 : -1) * 28} ${x} ${y})`} />)}
  </svg>
)
