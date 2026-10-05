// Tiny IndexedDB key-value store so uploaded images + text persist in the browser.
import { useEffect, useState } from 'react'
let dbp; const cache = {}, subs = new Set()
const open = () => dbp || (dbp = new Promise((res, rej) => { const r = indexedDB.open('bytanvi', 1); r.onupgradeneeded = () => r.result.createObjectStore('kv'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error) }))
const tx = async (mode, fn) => { const db = await open(); return new Promise((res, rej) => { const t = db.transaction('kv', mode), q = fn(t.objectStore('kv')); t.oncomplete = () => res(q && q.result); t.onerror = () => rej(t.error) }) }
export const get = async k => (k in cache ? cache[k] : (cache[k] = await tx('readonly', s => s.get(k))))
export const set = async (k, v) => { cache[k] = v; await tx('readwrite', s => s.put(v, k)); subs.forEach(f => f(k)) }
export function useKV(k, def) {
  const [v, setV] = useState(k in cache && cache[k] !== undefined ? cache[k] : def)
  useEffect(() => { let on = true; get(k).then(x => on && x !== undefined && setV(x)); const f = kk => kk === k && setV(cache[k]); subs.add(f); return () => { on = false; subs.delete(f) } }, [k])
  return [v, x => set(k, x)]
}
export function useCollection(name) {
  const [items] = useKV(name, [])
  const cur = async () => (await get(name)) || []
  return {
    items,
    add: async it => set(name, [{ id: Date.now().toString(36), date: Date.now(), ...it }, ...(await cur())]),
    update: async (id, p) => set(name, (await cur()).map(x => (x.id === id ? { ...x, ...p } : x))),
    remove: async id => set(name, (await cur()).filter(x => x.id !== id)),
  }
}
