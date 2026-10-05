import { useState } from 'react'
import { Page } from '../components/Common'
import { SERVICES, CONTACT } from '../config'

const SLOTS = ['10:00 AM', '11:30 AM', '2:00 PM', '4:00 PM', '6:00 PM'], MODES = ['Video call', 'In person', 'Site visit']
const LABELS = ['Service', 'Date', 'Time', 'Details']

function Cal({ value, onPick }) {
  const [m, setM] = useState(() => { const d = new Date(); d.setDate(1); return d })
  const first = m.getDay(), n = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate(), today = new Date().setHours(0, 0, 0, 0)
  const iso = d => `${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
  const cells = [...Array(first).fill(null), ...Array.from({ length: n }, (_, i) => i + 1)]
  return (
    <div className="cal">
      <div className="calh"><button type="button" onClick={() => setM(new Date(m.getFullYear(), m.getMonth() - 1, 1))}>‹</button><b>{m.toLocaleString('en', { month: 'long', year: 'numeric' })}</b><button type="button" onClick={() => setM(new Date(m.getFullYear(), m.getMonth() + 1, 1))}>›</button></div>
      <div className="calg">{'SMTWTFS'.split('').map((d, i) => <i key={i}>{d}</i>)}
        {cells.map((d, i) => d ? <button type="button" key={i} disabled={new Date(m.getFullYear(), m.getMonth(), d) < today} className={value === iso(d) ? 'on' : ''} onClick={() => onPick(iso(d))}>{d}</button> : <span key={i} />)}</div>
    </div>
  )
}

export default function Book() {
  const [step, setStep] = useState(0), [sent, setSent] = useState(false)
  const [f, setF] = useState({ svc: '', mode: MODES[0], date: '', slot: '', name: '', phone: '', email: '', note: '' })
  const set = k => e => setF({ ...f, [k]: e.target.value })
  const ok = [f.svc, f.date, f.slot, f.name && (f.phone || f.email)][step]
  const svc = SERVICES.find(s => s.id === f.svc)
  const msg = `Hello Tanvi,%0AI'd like to book: ${svc?.title}%0AMode: ${f.mode}%0ADate: ${f.date}, ${f.slot}%0AName: ${f.name}%0APhone: ${f.phone}%0AEmail: ${f.email}%0ANotes: ${f.note}`
  return (
    <Page kicker="BOOK" title="Book a consultation" intro="Pick a service, a day and a time. Your request goes straight to Tanvi — she confirms personally.">
      <div className="book">
        <div className="bform">
          <ol className="stepper">{LABELS.map((l, i) => <li key={l} className={i === step ? 'on' : i < step ? 'done' : ''}><span>{i + 1}</span>{l}</li>)}</ol>
          {step === 0 && <div className="pick">{SERVICES.map(s => <button key={s.id} className={f.svc === s.id ? 'on' : ''} onClick={() => setF({ ...f, svc: s.id })}><b>{s.title}</b><small>{s.blurb}</small></button>)}</div>}
          {step === 1 && <Cal value={f.date} onPick={d => setF({ ...f, date: d })} />}
          {step === 2 && <><div className="chips2">{MODES.map(m => <button key={m} className={f.mode === m ? 'on' : ''} onClick={() => setF({ ...f, mode: m })}>{m}</button>)}</div>
            <div className="chips2">{SLOTS.map(s => <button key={s} className={f.slot === s ? 'on' : ''} onClick={() => setF({ ...f, slot: s })}>{s}</button>)}</div></>}
          {step === 3 && <div className="fields"><label>Your name<input value={f.name} onChange={set('name')} /></label><label>Phone / WhatsApp<input value={f.phone} onChange={set('phone')} /></label><label>Email<input type="email" value={f.email} onChange={set('email')} /></label><label>Tell Tanvi about your plot or idea<textarea rows="4" value={f.note} onChange={set('note')} /></label></div>}
          <div className="row">{step > 0 && <button className="btn ghost" onClick={() => setStep(step - 1)}>← Back</button>}
            {step < 3 ? <button className="btn" disabled={!ok} onClick={() => setStep(step + 1)}>Continue →</button> : <button className="btn" disabled={!ok} onClick={() => setSent(true)}>Review request</button>}</div>
        </div>
        <aside className="summary"><div className="kick">YOUR REQUEST</div><h3>{svc?.title || 'Choose a service'}</h3>
          <p>{f.date ? new Date(f.date).toDateString() : 'Date —'}<br />{f.slot || 'Time —'} · {f.mode}</p>
          {sent && <><p>Send your request with the app you prefer:</p>
            <a className="btn" href={`mailto:${CONTACT.email}?subject=${encodeURIComponent('Consultation: ' + svc?.title)}&body=${msg.replace(/'/g, '%27')}`}>Send by email</a>
            <a className="btn ghost" href={`https://wa.me/${CONTACT.wa}?text=${msg.replace(/'/g, '%27')}`} target="_blank" rel="noreferrer">Send on WhatsApp</a></>}
        </aside>
      </div>
    </Page>
  )
}
