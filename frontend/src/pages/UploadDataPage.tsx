import { zodResolver } from '@hookform/resolvers/zod'
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  FileSpreadsheet,
  Info,
  Lock,
  ShieldCheck,
  UploadCloud,
} from 'lucide-react'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { z } from 'zod'
import { createSubmission } from '../api/submissions'
import type { CreateSubmissionResult } from '../types/submission'

const organisation = 'EcoBuild Ltd.'
const mockUser = {
  name: 'Alex Chen',
}

const reportingPeriods = ['Q3 2026', 'Q2 2026', 'Q1 2026', 'Q4 2025', 'Q3 2025']
const maxFileSize = 20 * 1024 * 1024

const uploadSchema = z.object({
  projectName: z.string().trim().min(2, 'Enter a project or building name.'),
  reportingPeriod: z.string().min(1, 'Select a reporting period.'),
  confirmation: z.boolean().refine((value) => value, 'Confirm this is the intended source file.'),
})

type UploadFormValues = z.infer<typeof uploadSchema>

type FileValidationResult = {
  file: File | null
  error: string
}

export function UploadDataPage() {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [success, setSuccess] = useState<CreateSubmissionResult | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UploadFormValues>({
    resolver: zodResolver(uploadSchema),
    mode: 'onBlur',
    defaultValues: {
      projectName: 'The Arc Tower',
      reportingPeriod: 'Q2 2026',
      confirmation: false,
    },
  })

  const projectName = watch('projectName')
  const reportingPeriod = watch('reportingPeriod')
  const confirmation = watch('confirmation')
  const displayProjectName = normalizeProjectName(projectName) || 'The Arc Tower'
  const canSubmit = Boolean(normalizeProjectName(projectName).length >= 2 && reportingPeriod && selectedFile && confirmation)

  const openFilePicker = () => inputRef.current?.click()

  const acceptFile = (file?: File) => {
    const result = validateUploadFile(file)
    setSelectedFile(result.file)
    setFileError(result.error)
  }

  const onSubmit = async (values: UploadFormValues) => {
    const normalizedProjectName = normalizeProjectName(values.projectName)
    setValue('projectName', normalizedProjectName)
    setSubmitError('')

    if (!selectedFile) {
      setFileError('Upload a CSV or XLSX file before submitting.')
      return
    }

    try {
      const result = await createSubmission({
        projectName: normalizedProjectName,
        organisation,
        reportingPeriod: values.reportingPeriod,
        uploaderName: mockUser.name,
        file: selectedFile,
      })
      setSuccess(result)
    } catch {
      setSubmitError("We couldn't submit your data. Please try again.")
    }
  }

  if (success) {
    return (
      <main className="page upload-page">
        <UploadBreadcrumb />
        <section className="upload-success panel">
          <div className="success-icon">
            <CheckCircle2 size={26} />
          </div>
          <div>
            <h1>Submission received</h1>
            <p>Your sustainability data has been submitted for review.</p>
          </div>
          <dl className="success-details">
            <SummaryField label="Submission ID" value={success.submissionId} />
            <SummaryField label="Project" value={success.projectName} />
            <SummaryField label="Reporting Period" value={success.reportingPeriod} />
            <div>
              <dt>Status</dt>
              <dd><UnreviewedBadge /></dd>
            </div>
          </dl>
          <div className="success-actions">
            <button className="secondary-button" type="button" disabled title="Future submission detail integration">
              View Submission
            </button>
            <button className="primary-button" type="button" onClick={() => navigate('/projects')}>
              Done
            </button>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="page upload-page">
      <UploadBreadcrumb />
      <section className="upload-header">
        <h1>Upload Sustainability Data</h1>
        <p>Submit sustainability performance data for one of your authorised projects.</p>
        <span>Your original file will be preserved exactly as uploaded and submitted for review.</span>
      </section>

      <form className="upload-layout" onSubmit={handleSubmit(onSubmit)} noValidate>
        <section className="upload-form-panel panel">
          <div className="upload-section">
            <SectionIntro
              number="1"
              title="Submission Details"
              text="Enter where this data belongs and the reporting period it represents."
            />
            <div className="submission-detail-grid">
              <label className="upload-field">
                <span>Project / Building *</span>
                <div className={`input-with-icon ${errors.projectName ? 'has-error' : ''}`}>
                  <Building2 size={17} />
                  <input
                    {...register('projectName')}
                    placeholder="Enter project or building name"
                    aria-invalid={Boolean(errors.projectName)}
                    aria-describedby="project-name-error"
                    onBlur={(event) => setValue('projectName', normalizeProjectName(event.target.value), { shouldValidate: true })}
                  />
                </div>
                {errors.projectName ? <em id="project-name-error">{errors.projectName.message}</em> : null}
              </label>

              <label className="upload-field">
                <span>Organisation</span>
                <div className="input-with-icon readonly">
                  <Lock size={17} />
                  <input value={organisation} readOnly />
                </div>
                <small>Determined from your account</small>
              </label>

              <label className="upload-field">
                <span>Reporting Period *</span>
                <div className={`input-with-icon ${errors.reportingPeriod ? 'has-error' : ''}`}>
                  <CalendarDays size={17} />
                  <select
                    {...register('reportingPeriod')}
                    aria-invalid={Boolean(errors.reportingPeriod)}
                    aria-describedby="reporting-period-error"
                  >
                    {reportingPeriods.map((period) => <option key={period}>{period}</option>)}
                  </select>
                </div>
                {errors.reportingPeriod ? <em id="reporting-period-error">{errors.reportingPeriod.message}</em> : null}
              </label>
            </div>
          </div>

          <div className="upload-section">
            <SectionIntro
              number="2"
              title="Data File"
              text="Upload the source sustainability dataset for this reporting period."
            />
            <div
              className={`upload-dropzone ${isDragging ? 'dragging' : ''} ${fileError ? 'has-error' : ''}`}
              onDragEnter={(event) => {
                event.preventDefault()
                setIsDragging(true)
              }}
              onDragOver={(event) => {
                event.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={(event) => {
                event.preventDefault()
                setIsDragging(false)
              }}
              onDrop={(event) => {
                event.preventDefault()
                setIsDragging(false)
                acceptFile(event.dataTransfer.files[0])
              }}
            >
              <UploadCloud size={30} />
              <strong>Drop your data file here</strong>
              <span>or</span>
              <button className="secondary-button" type="button" onClick={openFilePicker}>
                Browse files
              </button>
              <small>CSV or XLSX - Maximum 20 MB</small>
              <input
                ref={inputRef}
                type="file"
                accept=".csv,.xlsx"
                tabIndex={-1}
                onChange={(event) => acceptFile(event.target.files?.[0])}
              />
            </div>
            {fileError ? <p className="upload-error">{fileError}</p> : null}
            {selectedFile ? (
              <SelectedFileRow
                file={selectedFile}
                onReplace={openFilePicker}
                onRemove={() => {
                  setSelectedFile(null)
                  setFileError('')
                  if (inputRef.current) inputRef.current.value = ''
                }}
              />
            ) : null}
          </div>

          <div className="upload-section">
            <SectionIntro number="3" title="Confirmation" />
            <div className="preservation-notice">
              <Info size={19} />
              <div>
                <strong>Original file preservation</strong>
                <p>After submission, the original file is preserved exactly as uploaded. If corrections are required later, a new submission should be created rather than replacing the historical record.</p>
              </div>
            </div>
            <label className="confirmation-row">
              <input type="checkbox" {...register('confirmation')} aria-describedby="confirmation-error" />
              <span>I confirm that this is the intended source file for {displayProjectName} - {reportingPeriod}.</span>
            </label>
            {errors.confirmation ? <p className="upload-error" id="confirmation-error">{errors.confirmation.message}</p> : null}
          </div>
        </section>

        <aside className="submission-summary panel">
          <h2>Submission Summary</h2>
          <p>Review the details before submitting.</p>
          <dl className="summary-fields">
            <SummaryField label="Project" value={displayProjectName} />
            <SummaryField label="Organisation" value={organisation} />
            <SummaryField label="Reporting Period" value={reportingPeriod} />
            <SummaryField label="Uploader" value={mockUser.name} />
            <div>
              <dt>Submission Status</dt>
              <dd><UnreviewedBadge /></dd>
            </div>
          </dl>
          <p className="status-helper">New submissions remain provisional until reviewed by an authorised auditor.</p>
          <ReviewProcess />
          {submitError ? <p className="upload-error summary-error">{submitError}</p> : null}
          <button className="primary-button submit-review-button" type="submit" disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit for Review'}
          </button>
          <button className="secondary-button cancel-upload-button" type="button" onClick={() => navigate('/projects')}>
            Cancel
          </button>
          <p className="submission-helper">Submitting will create a new immutable submission record.</p>
          <div className="secure-note">
            <ShieldCheck size={16} />
            Secure upload - Source file preserved - Submission traceable
          </div>
        </aside>
      </form>
    </main>
  )
}

function UploadBreadcrumb() {
  return (
    <div className="breadcrumb">
      <Link to="/projects">Projects</Link>
      <ChevronRight size={14} />
      <span>Upload Data</span>
    </div>
  )
}

function SectionIntro({ number, title, text }: { number: string; title: string; text?: string }) {
  return (
    <div className="upload-section-intro">
      <h2>{number}. {title}</h2>
      {text ? <p>{text}</p> : null}
    </div>
  )
}

function SelectedFileRow({ file, onReplace, onRemove }: { file: File; onReplace: () => void; onRemove: () => void }) {
  return (
    <div className="selected-file-row">
      <FileSpreadsheet size={24} />
      <div>
        <strong>{file.name}</strong>
        <span>{fileExtension(file.name)} - {formatFileSize(file.size)}</span>
      </div>
      <span className="ready-state"><CheckCircle2 size={15} />Ready</span>
      <button type="button" onClick={onReplace}>Replace</button>
      <button type="button" onClick={onRemove}>Remove</button>
    </div>
  )
}

function SummaryField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}

function UnreviewedBadge() {
  return (
    <span className="status-badge unreviewed">
      <CalendarDays size={14} />
      Unreviewed
    </span>
  )
}

function ReviewProcess() {
  const steps = [
    { title: 'Submit data', text: 'You are here' },
    { title: 'GreenChain processes file', text: '' },
    { title: 'Auditor review', text: '' },
    { title: 'Approved or Rejected', text: '' },
  ]

  return (
    <section className="review-process">
      <h2>Review Process</h2>
      <ol>
        {steps.map((step, index) => (
          <li key={step.title} className={index === 0 ? 'active' : ''}>
            <span>{index + 1}</span>
            <div>
              <strong>{step.title}</strong>
              {step.text ? <small>{step.text}</small> : null}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

function validateUploadFile(file?: File): FileValidationResult {
  if (!file) return { file: null, error: 'Upload a CSV or XLSX file before submitting.' }

  const extension = fileExtension(file.name)
  if (extension !== 'CSV' && extension !== 'XLSX') {
    return { file: null, error: 'Please upload a CSV or XLSX file.' }
  }

  if (file.size > maxFileSize) {
    return { file: null, error: 'File must be 20 MB or smaller.' }
  }

  return { file, error: '' }
}

function fileExtension(fileName: string) {
  return fileName.split('.').pop()?.toUpperCase() || 'FILE'
}

function formatFileSize(size: number) {
  if (size < 1024 * 1024) return `${Math.max(size / 1024, 1).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

function normalizeProjectName(value: string) {
  const trimmed = value.trim().replace(/\s+/g, ' ')
  if (!trimmed) return ''

  return trimmed
    .split(' ')
    .map((word) => {
      if (word.length <= 3 && word === word.toUpperCase()) return word
      if (/[A-Z]{2,}|\d/.test(word)) return word
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })
    .join(' ')
}
