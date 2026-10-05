import { useState } from 'react'
import { Page, Tree, useEdit } from '../components/Common'
import Uploader from '../components/Uploader'
import { useKV } from '../store'

const BIO = 'Tanvi is an architecture student who designs with brick, light and leaves. She loves quiet, minimal spaces, courtyards with trees, and rooms where a plant is part of the plan. Her work treats architecture as a process — sketched, modelled, rethought and built.'

export default function About() {
  const { edit, ask } = useEdit(), [photo, setPhoto] = useKV('aboutPhoto', null), [bio, setBio] = useKV('bio', BIO), [up, setUp] = useState(false)
  return (
    <Page kicker="ABOUT" title="Architecture is a process">
      <div className="about">
        <div className="portrait"><div className="frame">{photo ? <img src={photo} alt="Tanvi" /> : <div className="ph tall3"><Tree /><span>Portrait · upload yours</span></div>}</div>
          <button className="btn ghost" onClick={() => ask(() => setUp(true))}>＋ Upload photo</button></div>
        <div>{edit ? <textarea className="bioedit" rows="7" value={bio} onChange={e => setBio(e.target.value)} /> : <p className="long">{bio}</p>}
          <h4>What inspires the studio</h4>
          <div className="insp">{[['Brick', 'brick'], ['Trees', 'stone'], ['Plants', 'stone'], ['Minimalism', 'plaster'], ['Natural light', 'cane']].map(([l, t]) => <span key={l} className={'tx-' + t}>{l}</span>)}</div></div>
      </div>
      {up && <Uploader title="Portrait photo" aspect="3:4" onClose={() => setUp(false)} onSave={d => { setPhoto(d.img); setUp(false) }} />}
    </Page>
  )
}
