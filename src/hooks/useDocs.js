import { useState, useEffect } from 'react'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase'

export function useDocs() {
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const q = query(collection(db, 'documents'), orderBy('date', 'desc'))
    const unsub = onSnapshot(
      q,
      (snap) => {
        setDocs(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      }
    )
    return unsub
  }, [])

  return { docs, loading, error }
}

export function useCategories() {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const q = query(collection(db, 'categories'), orderBy('createdAt', 'asc'))
    const unsub = onSnapshot(q, (snap) => {
      setCategories(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    })
    return unsub
  }, [])

  return categories
}

export function useSubSettings() {
  const [subSettings, setSubSettings] = useState({})

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'subSettings'), (snap) => {
      const result = {}
      snap.docs.forEach((d) => {
        result[d.id] = d.data().subs || []
      })
      setSubSettings(result)
    })
    return unsub
  }, [])

  return subSettings
}
