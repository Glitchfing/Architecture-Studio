import { Page, Tree } from '../components/Common'
import { SERVICES, STEPS } from '../config'

export default function Services() {
  return (
    <Page kicker="SERVICES" title="The first rooms of a future firm" intro="Tanvi is an architecture student building her practice one honest project at a time. Fresh eyes, one designer, full attention.">
      <div className="svcgrid">
        {SERVICES.map((s, i) => (
          <article key={s.id} className="svc">
            <span className="num">0{i + 1}</span><h3>{s.title}</h3><p>{s.blurb}</p>
            <ul>{s.gets.map(g => <li key={g}>{g}</li>)}</ul>
            <a className="more" href={'#/book'}>Book this →</a>
          </article>
        ))}
      </div>
      <section className="process"><h2>How we work together</h2>
        <ol>{STEPS.map((s, i) => <li key={s}><span>{i + 1}</span>{s}</li>)}</ol></section>
      <section className="band"><Tree className="tree big" /><div><div className="kick light">WHY A STUDENT STUDIO</div><h2>Curious, careful, and fully yours.</h2>
        <p>Every commission is built around listening: your site, your climate, your budget. Quotes are shared after the first conversation.</p>
        <a className="btn light" href="#/book">Book a consultation</a></div></section>
    </Page>
  )
}
