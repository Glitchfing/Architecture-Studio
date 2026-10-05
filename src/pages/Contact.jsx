import { Page } from '../components/Common'
import { CONTACT } from '../config'

export default function Contact() {
  return (
    <Page kicker="CONTACT" title="Let’s talk.">
      <div className="contact">
        <a href={'mailto:' + CONTACT.email}><small>EMAIL</small>{CONTACT.email}</a>
        <a href={'tel:+91' + CONTACT.phone}><small>PHONE</small>+91 {CONTACT.phone}</a>
        <a href={'https://wa.me/' + CONTACT.wa} target="_blank" rel="noreferrer"><small>WHATSAPP</small>Message Tanvi</a>
      </div>
      <a className="btn" href="#/book">Book a consultation</a>
    </Page>
  )
}
