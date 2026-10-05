import { useState } from 'react'
import { Page, Pic, AddTile, Del, Lightbox } from '../components/Common'
import Uploader from '../components/Uploader'
import { useCollection } from '../store'
import { SKETCH_FIELDS } from '../config'

export default function Sketchbook() {
  const C = useCollection('sketches'), [k, setK] = useState('All'), [up, setUp] = useState(false), [lb, setLb] = useState(null)
  const kinds = ['All', ...SKETCH_FIELDS[1].opts], list = C.items.filter(s => k === 'All' || s.kind === k)
  return (
    <Page kicker="SKETCHBOOK" title="Plans, sections & sketches" onAdd={() => setUp(true)} addLabel="Upload drawing" intro="Floor plans and drawings, each with the thinking behind it.">
      <div className="tabs">{kinds.map(x => <button key={x} className={k === x ? 'on' : ''} onClick={() => setK(x)}>{x}</button>)}</div>
      <div className="grid papers2">
        {(list.length ? list : C.items.length ? [] : Array(3).fill(null)).map((s, i) => (
          <button key={s?.id || i} className={'sheet big s' + (i % 3)} onClick={() => s && setLb(s)}>
            <Pic it={s} r="4/3" tag="Floor plan · upload yours" /><b>{s?.title || 'Sample plan'}</b><small>{s?.kind || 'Appears here once uploaded'}</small>{s && <Del onClick={() => C.remove(s.id)} />}
          </button>
        ))}
        <AddTile label="Add drawing" onClick={() => setUp(true)} />
      </div>
      {up && <Uploader title="New drawing" aspect="4:3" fields={SKETCH_FIELDS} onClose={() => setUp(false)} onSave={d => { C.add(d); setUp(false) }} />}
      {lb && <Lightbox it={lb} onClose={() => setLb(null)} onDelete={C.remove} />}
    </Page>
  )
}
