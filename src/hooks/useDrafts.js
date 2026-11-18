import { useContext } from 'react'
import { DraftContext } from '../context/DraftProviderContext'

export function useDrafts() {
  const context = useContext(DraftContext)
  if (!context) throw new Error('useDrafts must be used within DraftProvider.')
  return context
}
