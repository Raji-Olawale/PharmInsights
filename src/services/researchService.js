import { isSupabaseConfigured, supabase } from '../lib/supabase'

const pageSize = 1000
const adminAnswerColumns = 'response_id,submitted_at,category_slug,category,is_anonymous,respondent_name,business_name,location,contact,section,question_no,question,is_core,answer_text,follow_up_answer'

function requireSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('PharmaInsight is not connected to Supabase. Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
  }
  return supabase
}

function throwIfError(error, operation) {
  if (error) throw new Error(`${operation}: ${error.message}`)
}

function groupAnswerRows(rows) {
  const responses = new Map()
  for (const row of rows) {
    let response = responses.get(row.response_id)
    if (!response) {
      response = {
        id: row.response_id,
        category: row.category,
        categorySlug: row.category_slug,
        isAnonymous: row.is_anonymous,
        submittedAt: row.submitted_at,
        respondentName: row.respondent_name,
        businessName: row.business_name,
        location: row.location,
        contact: row.contact,
        answers: [],
      }
      responses.set(row.response_id, response)
    }
    response.answers.push({
      questionNo: row.question_no,
      section: row.section,
      question: row.question,
      isCore: row.is_core,
      answerText: row.answer_text,
      followUpAnswer: row.follow_up_answer,
    })
  }
  return [...responses.values()]
}

export const researchService = {
  async getCategories() {
    const client = requireSupabase()
    const { data, error } = await client
      .from('categories')
      .select('id,slug,name,description,sort_order')
      .order('sort_order')
    throwIfError(error, 'Unable to load stakeholder categories')
    return data
  },

  async getQuestionnaire(slug) {
    const client = requireSupabase()
    const [categoryResult, questionsResult] = await Promise.all([
      client.from('categories').select('id,slug,name,description,sort_order').eq('slug', slug).single(),
      client.from('survey_questions').select('*').eq('category_slug', slug).order('position'),
    ])
    throwIfError(categoryResult.error, 'Unable to load the stakeholder category')
    throwIfError(questionsResult.error, 'Unable to load questionnaire questions')

    const sections = []
    const sectionMap = new Map()
    for (const row of questionsResult.data) {
      let section = sectionMap.get(row.section_position)
      if (!section) {
        section = {
          position: row.section_position,
          title: row.section_title,
          intro: row.section_intro,
          questions: [],
        }
        sectionMap.set(row.section_position, section)
        sections.push(section)
      }
      section.questions.push({
        id: row.question_id,
        position: row.position,
        text: row.text,
        followUp: row.follow_up_text,
      })
    }
    return {
      category: categoryResult.data,
      sections,
      questions: sections.flatMap((section) => section.questions),
    }
  },

  async submitResponse({ categorySlug, isAnonymous, respondent, answers }) {
    const client = requireSupabase()
    const pRespondent = isAnonymous ? {} : respondent
    const pAnswers = answers.slice(0, 50).map((answer) => ({
      question_id: answer.questionId,
      answer_text: answer.answer.slice(0, 5000),
      follow_up_answer: answer.followUp.slice(0, 5000),
    }))
    const { data, error } = await client.rpc('submit_response', {
      p_category_slug: categorySlug,
      p_is_anonymous: isAnonymous,
      p_respondent: pRespondent,
      p_answers: pAnswers,
    })
    throwIfError(error, 'Unable to submit your response')
    if (typeof data !== 'string') throw new Error('The research service returned an invalid response reference.')
    return data
  },

  async getSubmissions() {
    const client = requireSupabase()
    const rows = []
    for (let from = 0; ; from += pageSize) {
      const { data, error } = await client
        .from('admin_answers')
        .select(adminAnswerColumns)
        .order('submitted_at', { ascending: false })
        .order('response_id')
        .order('question_no')
        .range(from, from + pageSize - 1)
      throwIfError(error, 'Unable to load submitted responses')
      rows.push(...data)
      if (data.length < pageSize) break
    }
    return groupAnswerRows(rows)
  },

  async getSubmission(responseId) {
    const client = requireSupabase()
    const { data, error } = await client
      .from('admin_answers')
      .select(adminAnswerColumns)
      .eq('response_id', responseId)
      .order('submitted_at', { ascending: false })
      .order('response_id')
      .order('question_no')
    throwIfError(error, 'Unable to load this response')
    return groupAnswerRows(data)[0] || null
  },

  async getAdminStats() {
    const client = requireSupabase()
    const { data, error } = await client
      .from('admin_stats')
      .select('category_slug,category,total_responses,anonymous_responses,named_responses,last_submitted_at')
      .order('category_slug')
    throwIfError(error, 'Unable to load administrator statistics')
    return data
  },

  async getDailySubmissions() {
    const client = requireSupabase()
    const { data, error } = await client
      .from('admin_daily_submissions')
      .select('day,category_id,submissions')
      .order('day')
    throwIfError(error, 'Unable to load daily submission counts')
    return data
  },

  async getAnswersForQuestion(questionId) {
    const client = requireSupabase()
    const { data, error } = await client.rpc('admin_answers_for_question', { p_question_id: questionId })
    throwIfError(error, 'Unable to load responses for this question')
    return data.map((row) => ({
      id: row.response_id,
      submittedAt: row.submitted_at,
      isAnonymous: row.is_anonymous,
      respondentName: row.respondent_name,
      businessName: row.business_name,
      answerText: row.answer_text,
      followUpAnswer: row.follow_up_answer,
    }))
  },

 async signIn(email, password) {
  if (!isSupabaseConfigured) throw new Error('Admin access requires a configured Supabase project.')
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error(error.message)
  const { data: isAdmin, error: roleError } = await supabase.rpc('is_admin')
  if (roleError) {
    await supabase.auth.signOut()
    throw new Error(`Admin check failed: ${roleError.message}`)
  }
  if (!isAdmin) {
    await supabase.auth.signOut()
    throw new Error('This account is not authorised to access PharmaInsight administration.')
  }
  return data
},

async getAdminSession() {
  if (!isSupabaseConfigured) return null
  const { data, error } = await supabase.auth.getSession()
  if (error) throw new Error(error.message)
  if (!data.session) return null
  const { data: isAdmin, error: roleError } = await supabase.rpc('is_admin')
  if (roleError) throw new Error(roleError.message)
  return isAdmin ? data.session : null
},
  async signOut() {
    const client = requireSupabase()
    const { error } = await client.auth.signOut()
    throwIfError(error, 'Unable to sign out')
  },
}
