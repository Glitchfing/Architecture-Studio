import { useState } from 'react'
import { Page, AddTile, Del } from '../components/Common'
import Uploader from '../components/Uploader'
import { useCollection } from '../store'
import { JOURNAL_FIELDS } from '../config'

const METHODS = [
  ['01', 'Wind', 'Where does the breeze come from, and how can rooms catch it?'],
  ['02', 'Sun', 'Trace the sun across the plot — shade where needed, light where it is wanted.'],
  ['03', 'Water', 'Rain, drainage and monsoon behaviour before any wall is drawn.'],
  ['04', 'Context', 'Neighbours, streets, trees, noise — what the site already says.'],
  ['05', 'People', 'How the family or users move through a day.'],
  ['06', 'Material', 'What is local, honest and kind to the climate.'],
]

export default function Thinking() {
  const C = useCollection('journal'), [up, setUp] = useState(false)
  return (
    <Page kicker="THINKING" title="How a site is read" onAdd={() => setUp(true)} addLabel="Add note" intro="Before drawing, the studio reads the land. These are the questions behind every project.">
      <div className="methods">{METHODS.map(m => <div key={m[0]} className="method"><span>{m[0]}</span><h3>{m[1]}</h3><p>{m[2]}</p></div>)}</div>
      <h2>Margin notes</h2>
      <div className="notes">
        {C.items.length === 0 && <div className="note ghosted">Your thoughts, written like margin notes, appear here.</div>}
        {C.items.map(n => <div className="note" key={n.id}><b>{n.title}</b><p>{n.description}</p><Del onClick={() => C.remove(n.id)} /></div>)}
        <AddTile label="Add a note" onClick={() => setUp(true)} />
      </div>
      {up && <Uploader noImage title="New note" fields={JOURNAL_FIELDS} onClose={() => setUp(false)} onSave={d => { C.add(d); setUp(false) }} />}
    </Page>
  )
}
