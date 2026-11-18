import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { researchService } from '../services/researchService'

export function useCategories() {
  return useQuery({ queryKey: ['categories'], queryFn: () => researchService.getCategories() })
}

export function useQuestionnaire(slug) {
  return useQuery({
    queryKey: ['questionnaire', slug],
    queryFn: () => researchService.getQuestionnaire(slug),
    enabled: Boolean(slug),
    staleTime: 5 * 60_000,
  })
}

export function useQuestionnaires(slugs) {
  return useQuery({
    queryKey: ['questionnaires', slugs],
    queryFn: () => Promise.all(slugs.map((slug) => researchService.getQuestionnaire(slug))),
    enabled: slugs.length > 0,
    staleTime: 5 * 60_000,
  })
}

export function useSubmissions() {
  return useQuery({ queryKey: ['submissions'], queryFn: () => researchService.getSubmissions() })
}

export function useRespondent(id) {
  return useQuery({
    queryKey: ['submission', id],
    queryFn: () => researchService.getSubmission(id),
    enabled: Boolean(id),
  })
}

export function useAdminStats() {
  return useQuery({ queryKey: ['admin-stats'], queryFn: () => researchService.getAdminStats() })
}

export function useDailySubmissions() {
  return useQuery({ queryKey: ['daily-submissions'], queryFn: () => researchService.getDailySubmissions() })
}

export function useAnswersForQuestion(questionId) {
  return useQuery({
    queryKey: ['question-answers', questionId],
    queryFn: () => researchService.getAnswersForQuestion(questionId),
    enabled: Boolean(questionId),
  })
}

export function useSubmitResponse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: researchService.submitResponse,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['submissions'] }),
  })
}
