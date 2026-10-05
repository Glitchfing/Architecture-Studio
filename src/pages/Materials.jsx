import { useState } from 'react'
import { Page, Pic, Tilt, AddTile, Del } from '../components/Common'
import Uploader from '../components/Uploader'
import { useCollection } from '../store'
import { MATERIALS, MATERIAL_FIELDS } from '../config'

export default function Materials() {
  const C = useCollection('materials'), [up, setUp] = useState(false)
  return (
    <Page kicker="MATERIALS" title="Made of earth, wood & light" onAdd={() => setUp(true)} addLabel="Add material" intro="Brick first. Then everything that feels like it grew there — clay, lime, timber, stone, cane.">
      <div className="mgrid">
        {MATERIALS.map(m => (
          <Tilt key={m.id} className="mcard">
            <div className={'tx tall tx-' + m.tx} />
            <div className="mbody"><h3>{m.title}</h3><p>{m.note}</p><div className="facts">{m.facts.map(f => <span key={f}>{f}</span>)}</div></div>
          </Tilt>
        ))}
        {C.items.map(m => <Tilt key={m.id} className="mcard"><div className="tx tall"><Pic it={m} r="1/1" /></div><div className="mbody"><h3>{m.title}</h3><p>{m.description}</p></div><Del onClick={() => C.remove(m.id)} /></Tilt>)}
        <AddTile label="Add your own material" onClick={() => setUp(true)} />
      </div>
      {up && <Uploader title="New material" aspect="1:1" fields={MATERIAL_FIELDS} onClose={() => setUp(false)} onSave={d => { C.add(d); setUp(false) }} />}
    </Page>
  )
}
