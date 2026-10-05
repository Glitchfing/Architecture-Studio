import { useState } from 'react'
import { Page, Pic, AddTile, Del, Lightbox, useEdit } from '../components/Common'
import Uploader from '../components/Uploader'
import { useCollection } from '../store'
import { PROJECT_FIELDS, MODEL_FIELDS } from '../config'

const DIRS = { N: 0, NE: 45, E: 90, SE: 135, S: 180, SW: 225, W: 270, NW: 315 }

export function Work({ tab = 'projects' }) {
  const { edit } = useEdit(), C = useCollection(tab), [up, setUp] = useState(false), [lb, setLb] = useState(null)
  const isP = tab === 'projects', list = C.items.length ? C.items : Array(3).fill(null)
  return (
    <Page kicker="WORK" title={isP ? 'Projects' : 'Models'} onAdd={() => setUp(true)} addLabel={isP ? 'Upload project' : 'Upload model'} intro={isP ? 'Each project opens into its own page — drawings, description and site analysis.' : 'Physical and study models, photographed on the studio table.'}>
      <div className="tabs"><a className={isP ? 'on' : ''} href="#/work">Projects</a><a className={!isP ? 'on' : ''} href="#/models">Models</a></div>
      <div className="grid">
        {list.map((it, i) => {
          const body = <><div className="frame"><Pic it={it} r={isP ? '4/5' : '1/1'} /></div><b>{it?.title || 'Sample ' + (isP ? 'project' : 'model')}</b><small>{it ? (isP ? [it.type, it.year].filter(Boolean).join(' · ') : it.scale) : 'Appears here once uploaded'}</small></>
          return it ? (isP ? <a key={it.id} className="card" href={'#/project/' + it.id}>{body}<Del onClick={() => C.remove(it.id)} /></a>
            : <button key={it.id} className="card" onClick={() => setLb(it)}>{body}<Del onClick={() => C.remove(it.id)} /></button>) : <div key={i} className="card ghosted">{body}</div>
        })}
        <AddTile label={isP ? 'Add project' : 'Add model'} onClick={() => setUp(true)} />
      </div>
      {up && <Uploader title={isP ? 'New project' : 'New model'} aspect={isP ? '4:3' : '1:1'} fields={isP ? PROJECT_FIELDS : MODEL_FIELDS} onClose={() => setUp(false)} onSave={d => { C.add(d); setUp(false) }} />}
      {lb && <Lightbox it={lb} onClose={() => setLb(null)} onDelete={C.remove} />}
    </Page>
  )
}

export function ProjectPage({ id }) {
  const { edit } = useEdit(), C = useCollection('projects'), [up, setUp] = useState(false), [lb, setLb] = useState(null)
  const p = C.items.find(x => x.id === id)
  if (!p) return <Page kicker="WORK" title="Project not found"><a className="more" href="#/work">← Back to work</a></Page>
  const analysis = [['Sun path & orientation', p.sun], ['Climate', p.climate], ['Site context', p.context]].filter(a => a[1])
  const g = p.gallery || []
  return (
    <Page kicker={[p.type, p.year, p.location].filter(Boolean).join(' · ').toUpperCase()} title={p.title}>
      <div className="proj">
        <div className="frame big"><img src={p.img} alt={p.title} /></div>
        <div><p className="long">{p.description || 'No description yet.'}</p>{p.concept && <><h4>Concept & methodology</h4><p>{p.concept}</p></>}</div>
      </div>
      {(p.wind || analysis.length > 0) && (
        <section className="analysis"><h2>Site analysis</h2>
          <div className="agrid">
            {p.wind && <div className="acard"><svg viewBox="0 0 120 120" className="rose"><circle cx="60" cy="60" r="46" /><text x="60" y="12" textAnchor="middle">N</text>
              <g transform={`rotate(${DIRS[p.wind]} 60 60)`}><path d="M60 16V54M52 46L60 56L68 46" /></g></svg><h4>Wind from {p.wind}</h4><p>Prevailing wind direction.</p></div>}
            {analysis.map(([t, v]) => <div className="acard" key={t}><h4>{t}</h4><p>{v}</p></div>)}
          </div></section>
      )}
      {(g.length > 0 || edit) && <section><h2>More from this project</h2>
        <div className="grid sm">{g.map((u, i) => <button key={i} className="card" onClick={() => setLb({ img: u, title: p.title })}><div className="frame"><Pic it={{ img: u }} r="4/3" /></div><Del onClick={() => C.update(p.id, { gallery: g.filter((_, j) => j !== i) })} /></button>)}
          <AddTile label="Add image" onClick={() => setUp(true)} /></div></section>}
      {up && <Uploader title="Add image to project" onClose={() => setUp(false)} onSave={d => { C.update(p.id, { gallery: [...g, d.img] }); setUp(false) }} />}
      {lb && <Lightbox it={lb} onClose={() => setLb(null)} onDelete={() => {}} />}
      <a className="more" href="#/work">← All projects</a>
    </Page>
  )
}
