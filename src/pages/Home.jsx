import Studio from '../components/Studio'
import { Pic, Tilt, Tree } from '../components/Common'
import { useCollection } from '../store'
import { MATERIALS, SERVICES } from '../config'

const pad = (a, n) => [...a.slice(0, n), ...Array(Math.max(0, n - a.length)).fill(null)]

export default function Home() {
  const P = useCollection('projects').items, S = useCollection('sketches').items, M = useCollection('models').items
  return (
    <>
      <Studio projects={P} sketches={S} />
      <section className="wallsec">
        <div className="kick">ON THE WALL</div><h2>Recent work, framed</h2>
        <div className="frames">
          {pad(P, 3).map((p, i) => (
            <a key={i} className={'fr f' + i} href={p ? '#/project/' + p.id : '#/work'}>
              <div className="frame"><Pic it={p} r={i === 1 ? '3/4' : '4/5'} /></div>
              <b>{p?.title || 'Your project here'}</b><small>{p ? [p.type, p.year].filter(Boolean).join(' · ') : 'Upload in edit mode'}</small>
            </a>
          ))}
        </div>
        <a className="more" href="#/work">All projects →</a>
      </section>

      <section className="desksec">
        <div className="papers">
          {pad(S, 3).map((s, i) => <a key={i} href="#/sketchbook" className={'sheet s' + i}><Pic it={s} r="4/3" tag="Floor plan · upload yours" /><small>{s?.title || 'Plan'}</small></a>)}
        </div>
        <div>
          <div className="kick">ON THE DESK</div><h2>Plans, sections &amp; a model in progress</h2>
          <p className="intro">Floor plans and sketches live in the sketchbook; physical models sit on the table. Pick anything up.</p>
          <a className="more" href="#/sketchbook">Open the sketchbook →</a> <a className="more" href="#/models">See the models →</a>
          {M[0] && <p className="ph-note">Latest model: {M[0].title}</p>}
        </div>
      </section>

      <section className="shelfsec">
        <div className="kick">ON THE SHELF</div><h2>Materials, up close</h2>
        <div className="tiles">{MATERIALS.slice(0, 4).map(m => <Tilt key={m.id} className="tile"><div className={'tx tx-' + m.tx} /><b>{m.title}</b></Tilt>)}</div>
        <a className="more" href="#/materials">Feel the materials →</a>
      </section>

      <section className="band">
        <Tree className="tree big" />
        <div><div className="kick light">A STUDIO IN THE MAKING</div><h2>Design that starts small, and grows into a firm.</h2>
          <p>{SERVICES.length} services for homes, interiors, models and site studies — designed with full attention by one architect.</p>
          <div className="row"><a className="btn light" href="#/services">See services</a><a className="btn ghost light" href="#/book">Book a consultation</a></div></div>
      </section>
    </>
  )
}
