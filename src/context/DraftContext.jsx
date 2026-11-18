import { useCallback, useEffect, useMemo, useReducer } from 'react'
import { DraftContext } from './DraftProviderContext'

const STORAGE_KEY = 'pharmainsight-response-drafts'

function readDrafts() {
  try {
    const stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}')
    const drafts = stored && typeof stored === 'object' && !Array.isArray(stored) ? stored : {}
    return { drafts, storageError: '' }
  } catch (error) {
    return { drafts: {}, storageError: `Unable to restore saved responses: ${error.message}` }
  }
}

function reducer(state, action) {
  if (action.type === 'replace') return { ...state, drafts: action.drafts }
  if (action.type === 'storage-error') return { ...state, storageError: action.message }
  if (action.type === 'clear-error') return { ...state, storageError: '' }
  if (action.type === 'clear') {
    const drafts = { ...state.drafts }
    delete drafts[action.slug]
    return { ...state, drafts }
  }
  const previous = state.drafts[action.slug] || { isAnonymous: false, respondent: {}, answers: {} }
  let next
  if (action.type === 'start') {
    next = { isAnonymous: action.isAnonymous, respondent: action.respondent || {}, answers: {} }
  } else if (action.type === 'answer') {
    next = {
      ...previous,
      answers: { ...previous.answers, [action.questionId]: { answer: action.answer, followUp: action.followUp } },
    }
  } else if (action.type === 'respondent') {
    next = { ...previous, isAnonymous: false, respondent: action.respondent }
  } else {
    return state
  }
  return { ...state, drafts: { ...state.drafts, [action.slug]: next } }
}

export function DraftProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, readDrafts)

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state.drafts))
      dispatch({ type: 'clear-error' })
    } catch (error) {
      dispatch({ type: 'storage-error', message: `Unable to save this draft in this browser: ${error.message}` })
    }
  }, [state.drafts])

  const startDraft = useCallback((slug, isAnonymous, respondent = {}) => {
    dispatch({ type: 'start', slug, isAnonymous, respondent })
  }, [])
  const saveAnswer = useCallback((slug, questionId, answer, followUp) => {
    dispatch({ type: 'answer', slug, questionId, answer, followUp })
  }, [])
  const saveRespondent = useCallback((slug, respondent) => {
    dispatch({ type: 'respondent', slug, respondent })
  }, [])
  const clearDraft = useCallback((slug) => {
    dispatch({ type: 'clear', slug })
  }, [])

  const value = useMemo(() => ({
    drafts: state.drafts,
    storageError: state.storageError,
    startDraft,
    saveAnswer,
    saveRespondent,
    clearDraft,
  }), [state, startDraft, saveAnswer, saveRespondent, clearDraft])
  return <DraftContext.Provider value={value}>{children}</DraftContext.Provider>
}
