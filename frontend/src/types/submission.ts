export type CreateSubmissionInput = {
  projectName: string
  organisation: string
  reportingPeriod: string
  uploaderName: string
  file: File
}

export type CreateSubmissionResult = {
  submissionId: string
  projectName: string
  reportingPeriod: string
  status: 'UNREVIEWED'
}
