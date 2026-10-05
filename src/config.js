// Central place for contact details, edit-mode key and form fields.
export const CONTACT = { email: 'tanvibalkate06@gmail.com', phone: '8591840117', wa: '918591840117' }
export const SHOW_UPLOAD = true // false = hide upload buttons from visitors until Edit studio is unlocked
export const PIN = 'tanvi' // key that unlocks "Edit studio" (client-side convenience, not real security)
export const NAV = [['work','WORK'],['sketchbook','SKETCHBOOK'],['materials','MATERIALS'],['thinking','THINKING'],['services','SERVICES'],['about','ABOUT'],['contact','CONTACT']]

const area = (k, label, rows = 3) => ({ k, label, type: 'area', rows })
export const PROJECT_FIELDS = [
  { k: 'title', label: 'Project title' },
  { k: 'type', label: 'Type', type: 'select', opts: ['Residential','Public / Cultural','Interior','Landscape','Academic studio','Competition'] },
  { k: 'location', label: 'Location' }, { k: 'year', label: 'Year' },
  area('description', 'Description — a short write-up of the project', 5),
  { k: 'wind', label: 'Site analysis · prevailing wind from', type: 'select', opts: ['','N','NE','E','SE','S','SW','W','NW'] },
  area('sun', 'Site analysis · sun path & orientation', 2), area('climate', 'Site analysis · climate', 2),
  area('context', 'Site analysis · context & surroundings', 2), area('concept', 'Concept & methodology', 3),
]
export const MODEL_FIELDS = [{ k: 'title', label: 'Model title' }, { k: 'scale', label: 'Scale (e.g. 1:100)' }, { k: 'materials', label: 'Made with' }, area('description', 'Description', 4)]
export const SKETCH_FIELDS = [{ k: 'title', label: 'Title' }, { k: 'kind', label: 'Kind', type: 'select', opts: ['Floor plan','Section','Elevation','Site plan','Concept sketch'] }, area('description', 'Description / notes', 4)]
export const MATERIAL_FIELDS = [{ k: 'title', label: 'Material name' }, area('description', 'What it is, where you used it', 4)]
export const JOURNAL_FIELDS = [{ k: 'title', label: 'Title' }, area('description', 'Your thought', 6)]

export const SERVICES = [
  { id: 'design', title: 'Architectural Design', blurb: 'Homes and small buildings designed from first line to construction drawings.', gets: ['Concept & massing','Floor plans, sections, elevations','Material palette'] },
  { id: 'interior', title: 'Interior Design', blurb: 'Rooms shaped around daylight, texture and the way you actually live.', gets: ['Layout & furniture plan','Material & colour scheme','Lighting ideas'] },
  { id: 'consult', title: 'Design Consultation', blurb: 'One focused conversation about your plot, brief or half-finished plan.', gets: ['Honest feedback','Sketched options','Next-step roadmap'] },
  { id: 'models', title: 'Models & 3D Visualisation', blurb: 'Physical and digital models so you can see the idea before it is built.', gets: ['Study / presentation model','3D views','Walkthrough stills'] },
  { id: 'site', title: 'Site Analysis & Study', blurb: 'Wind, sun, water, context — reading the land before drawing on it.', gets: ['Climate & sun-path study','Context mapping','Zoning notes'] },
  { id: 'drawings', title: 'Drawings & Documentation', blurb: 'Clean, readable floor plans and drawing sets for approvals or builders.', gets: ['Measured drawings','Presentation sheets','Editable files'] },
]
export const STEPS = ['Listen','Read the site','Sketch','Model','Build together']

export const MATERIALS = [
  { id: 'brick', title: 'Fired Brick', tx: 'brick', note: 'Made from earth and fire. Holds the day’s heat, releases it at night, and gets better with every monsoon.', facts: ['Thermal mass','Exposed or plastered','Locally made'] },
  { id: 'terracotta', title: 'Terracotta', tx: 'terra', note: 'Jaalis, tiles and pots — breathable, cooling and quietly handmade.', facts: ['Passive cooling','Screens & tiles','Warm, matte'] },
  { id: 'teak', title: 'Teak & Timber', tx: 'wood', note: 'Grain, warmth and a slow patina. Thick sections feel like furniture that became architecture.', facts: ['Joinery','Doors & beams','Ages gently'] },
  { id: 'lime', title: 'Lime Plaster', tx: 'plaster', note: 'A soft, breathable skin that diffuses light and lets walls dry. Imperfection is the point.', facts: ['Breathable','Natural finish','Low carbon'] },
  { id: 'kota', title: 'Kota Stone', tx: 'stone', note: 'Cool, green-grey flooring that is durable, honest and wonderful underfoot in summer.', facts: ['Flooring','Cool underfoot','Easy upkeep'] },
  { id: 'cane', title: 'Cane & Bamboo', tx: 'cane', note: 'Light, woven, renewable. Filters sun into patterned shadow.', facts: ['Renewable','Screens & furniture','Dappled light'] },
]
