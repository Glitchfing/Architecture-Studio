import { useState } from 'react'
import { Edit, Nav, Footer, useRoute } from './components/Common'
import { PIN } from './config'
import Home from './pages/Home'
import { Work, ProjectPage } from './pages/Work'
import Sketchbook from './pages/Sketchbook'
import Materials from './pages/Materials'
import Thinking from './pages/Thinking'
import Services from './pages/Services'
import Book from './pages/Book'
import About from './pages/About'
import Contact from './pages/Contact'

export default function App() {
  const [r, id] = useRoute(), [edit, setEdit] = useState(() => localStorage.getItem('bt-edit') === '1')
  const unlock = () => {
    if (edit) return true
    const p = prompt('Enter the studio key to upload (default: tanvi)')
    if (p === PIN) { setEdit(true); localStorage.setItem('bt-edit', '1'); return true }
    if (p !== null) alert('That key is not right.')
    return false
  }
  const lock = () => { setEdit(false); localStorage.removeItem('bt-edit') }
  const ctx = { edit, unlock, lock, ask: fn => { if (unlock()) fn() } }
  const page = { work: <Work />, models: <Work tab="models" />, project: <ProjectPage id={id} />, sketchbook: <Sketchbook />, materials: <Materials />, thinking: <Thinking />, services: <Services />, book: <Book />, about: <About />, contact: <Contact /> }[r] || <Home />
  return (
    <Edit.Provider value={ctx}>
      <Nav active={r} />{page}<Footer />
      {edit && <div className="editbar"><span title="Uploads are saved in this browser">✎ Upload mode</span> <button onClick={lock}>Lock</button></div>}
    </Edit.Provider>
  )
}
