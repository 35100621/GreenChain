import type { CreateSubmissionInput, CreateSubmissionResult } from '../types/submission'

export async function createSubmission(input: CreateSubmissionInput): Promise<CreateSubmissionResult> {
  await new Promise((resolve) => window.setTimeout(resolve, 850))

  return {
    submissionId: 'SUB-2026-0148',
    projectName: input.projectName,
    reportingPeriod: input.reportingPeriod,
    status: 'UNREVIEWED',
  }
}
