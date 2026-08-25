import { useMemo, useState } from 'react'
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  Droplets,
  Flame,
  Grid2X2,
  Leaf,
  LineChart,
  UploadCloud,
  Search,
  Star,
  TrendingDown,
  UserCircle,
  XCircle,
} from 'lucide-react'
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router'
import { CartesianGrid, Line, LineChart as ReLineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { UploadDataPage } from './pages/UploadDataPage'
import './App.css'

type ProjectStatus = 'APPROVED' | 'UNREVIEWED' | 'REJECTED'
type Category = 'all' | 'recent' | 'high-performance' | 'featured'
type MetricKey = 'electricity' | 'water' | 'co2e'

type Project = {
  projectId: string
  name: string
  organisation: { id: string; name: string }
  location: string
  projectType: string
  imageUrl: string
  latestReportingPeriod: string
  latestStatus: ProjectStatus
  highlighted: boolean
  certification: string
  completionYear: number
  dataUpdatedAt: string
  addedAt: string
  highPerformance: boolean
  featured: boolean
  distinction: string
  metrics: Record<
    MetricKey,
    {
      label: string
      value: number
      unit: string
      changePercent: number
      previousPeriod: string
      isImprovement: boolean
    }
  >
  history: Array<{ period: string; electricity: number; water: number; co2e: number; status: ProjectStatus }>
  submissions: Array<{
    submissionId: string
    reportingPeriod: string
    uploadedAt: string
    status: ProjectStatus
    auditor: string
    metrics: Record<MetricKey, number>
    downloads: {
      original?: string
      processed?: string
      auditReport?: string
    }
  }>
}

const projects: Project[] = [
  {
    projectId: 'PROJ-001',
    name: 'The Arc Tower',
    organisation: { id: 'ORG-001', name: 'EcoBuild Ltd.' },
    location: 'Singapore',
    projectType: 'Commercial',
    imageUrl:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    latestReportingPeriod: '2024-Q4',
    latestStatus: 'APPROVED',
    highlighted: true,
    certification: 'BREEAM Outstanding',
    completionYear: 2022,
    dataUpdatedAt: '14 Jan 2025',
    addedAt: '14 Jan 2025',
    highPerformance: true,
    featured: true,
    distinction: 'Net-zero operational design with industry-leading energy efficiency.',
    metrics: {
      electricity: { label: 'Electricity', value: 118, unit: 'kWh/m2/year', changePercent: -4.2, previousPeriod: 'Q3 2024', isImprovement: true },
      water: { label: 'Water', value: 0.72, unit: 'm3/m2/year', changePercent: -1.8, previousPeriod: 'Q3 2024', isImprovement: true },
      co2e: { label: 'CO2 Emissions', value: 28, unit: 'kg CO2/m2/year', changePercent: -6.3, previousPeriod: 'Q3 2024', isImprovement: true },
    },
    history: [
      { period: '2023-Q1', electricity: 136, water: 0.91, co2e: 36, status: 'APPROVED' },
      { period: '2023-Q2', electricity: 132, water: 0.86, co2e: 34, status: 'APPROVED' },
      { period: '2023-Q3', electricity: 127, water: 0.83, co2e: 32, status: 'APPROVED' },
      { period: '2023-Q4', electricity: 124, water: 0.8, co2e: 31, status: 'APPROVED' },
      { period: '2024-Q1', electricity: 121, water: 0.77, co2e: 29, status: 'APPROVED' },
      { period: '2024-Q2', electricity: 116, water: 0.74, co2e: 27, status: 'APPROVED' },
      { period: '2024-Q3', electricity: 110, water: 0.73, co2e: 26, status: 'UNREVIEWED' },
      { period: '2024-Q4', electricity: 118, water: 0.72, co2e: 28, status: 'UNREVIEWED' },
    ],
    submissions: [
      { submissionId: 'SUB-104', reportingPeriod: 'Q4 2024', uploadedAt: '14 Jan 2025', status: 'APPROVED', auditor: 'Arup Verification', metrics: { electricity: 118, co2e: 28, water: 0.72 }, downloads: { original: 'Q4_2024_energy.xlsx', processed: 'Q4_2024_cleaned.csv', auditReport: 'Q4_2024_audit_report.pdf' } },
      { submissionId: 'SUB-103', reportingPeriod: 'Q3 2024', uploadedAt: '09 Oct 2024', status: 'UNREVIEWED', auditor: 'Pending review', metrics: { electricity: 110, co2e: 26, water: 0.73 }, downloads: { original: 'Q3_2024_energy.xlsx', processed: 'Q3_2024_cleaned.csv' } },
      { submissionId: 'SUB-102', reportingPeriod: 'Q2 2024', uploadedAt: '12 Jul 2024', status: 'APPROVED', auditor: 'Arup Verification', metrics: { electricity: 116, co2e: 27, water: 0.74 }, downloads: { original: 'Q2_2024_energy.xlsx', processed: 'Q2_2024_cleaned.csv', auditReport: 'Q2_2024_audit_report.pdf' } },
      { submissionId: 'SUB-101', reportingPeriod: 'Q1 2024', uploadedAt: '10 Apr 2024', status: 'APPROVED', auditor: 'Arup Verification', metrics: { electricity: 121, co2e: 29, water: 0.77 }, downloads: { original: 'Q1_2024_energy.xlsx', processed: 'Q1_2024_cleaned.csv', auditReport: 'Q1_2024_audit_report.pdf' } },
    ],
  },
  {
    projectId: 'PROJ-002',
    name: 'Green Square Tower',
    organisation: { id: 'ORG-002', name: 'TerraForm Group' },
    location: 'London',
    projectType: 'Commercial',
    imageUrl:
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
    latestReportingPeriod: '2025-Q1',
    latestStatus: 'APPROVED',
    highlighted: false,
    certification: 'LEED Platinum',
    completionYear: 2023,
    dataUpdatedAt: '03 Feb 2025',
    addedAt: '03 Feb 2025',
    highPerformance: true,
    featured: true,
    distinction: 'Verified water reduction across three consecutive quarters.',
    metrics: {
      electricity: { label: 'Electricity', value: 128, unit: 'kWh/m2/year', changePercent: -2.8, previousPeriod: 'Q4 2024', isImprovement: true },
      water: { label: 'Water', value: 1.8, unit: 'm3/m2/year', changePercent: -0.9, previousPeriod: 'Q4 2024', isImprovement: true },
      co2e: { label: 'CO2 Emissions', value: 42, unit: 'kg CO2/m2/year', changePercent: -3.7, previousPeriod: 'Q4 2024', isImprovement: true },
    },
    history: [
      { period: '2024-Q1', electricity: 143, water: 2.0, co2e: 48, status: 'APPROVED' },
      { period: '2024-Q2', electricity: 137, water: 1.95, co2e: 45, status: 'APPROVED' },
      { period: '2024-Q3', electricity: 132, water: 1.88, co2e: 43, status: 'APPROVED' },
      { period: '2024-Q4', electricity: 130, water: 1.82, co2e: 42, status: 'APPROVED' },
      { period: '2025-Q1', electricity: 128, water: 1.8, co2e: 42, status: 'APPROVED' },
    ],
    submissions: [],
  },
  {
    projectId: 'PROJ-003',
    name: 'Harbourfront Complex',
    organisation: { id: 'ORG-003', name: 'Northline Developments' },
    location: 'Melbourne',
    projectType: 'Mixed Use',
    imageUrl:
      'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80',
    latestReportingPeriod: '2024-Q4',
    latestStatus: 'UNREVIEWED',
    highlighted: true,
    certification: 'Green Star 6',
    completionYear: 2021,
    dataUpdatedAt: '22 Jan 2025',
    addedAt: '21 Jan 2025',
    highPerformance: false,
    featured: false,
    distinction: 'New mixed-use precinct with provisional Q4 data under review.',
    metrics: {
      electricity: { label: 'Electricity', value: 144, unit: 'kWh/m2/year', changePercent: 2.4, previousPeriod: 'Q3 2024', isImprovement: false },
      water: { label: 'Water', value: 1.04, unit: 'm3/m2/year', changePercent: -1.1, previousPeriod: 'Q3 2024', isImprovement: true },
      co2e: { label: 'CO2 Emissions', value: 51, unit: 'kg CO2/m2/year', changePercent: 1.6, previousPeriod: 'Q3 2024', isImprovement: false },
    },
    history: [
      { period: '2024-Q1', electricity: 150, water: 1.12, co2e: 54, status: 'APPROVED' },
      { period: '2024-Q2', electricity: 141, water: 1.08, co2e: 50, status: 'APPROVED' },
      { period: '2024-Q3', electricity: 140, water: 1.05, co2e: 50, status: 'APPROVED' },
      { period: '2024-Q4', electricity: 144, water: 1.04, co2e: 51, status: 'UNREVIEWED' },
    ],
    submissions: [],
  },
  {
    projectId: 'PROJ-004',
    name: 'Vista Corporate Hub',
    organisation: { id: 'ORG-004', name: 'CivicStone' },
    location: 'Kuala Lumpur',
    projectType: 'Commercial',
    imageUrl:
      'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=80',
    latestReportingPeriod: '2024-Q4',
    latestStatus: 'APPROVED',
    highlighted: true,
    certification: 'GreenRE Platinum',
    completionYear: 2020,
    dataUpdatedAt: '18 Jan 2025',
    addedAt: '08 Jan 2025',
    highPerformance: true,
    featured: false,
    distinction: 'Strong verified electricity intensity trend over the last year.',
    metrics: {
      electricity: { label: 'Electricity', value: 109, unit: 'kWh/m2/year', changePercent: -5.6, previousPeriod: 'Q3 2024', isImprovement: true },
      water: { label: 'Water', value: 0.68, unit: 'm3/m2/year', changePercent: -1.2, previousPeriod: 'Q3 2024', isImprovement: true },
      co2e: { label: 'CO2 Emissions', value: 25, unit: 'kg CO2/m2/year', changePercent: -4.9, previousPeriod: 'Q3 2024', isImprovement: true },
    },
    history: [
      { period: '2024-Q1', electricity: 125, water: 0.75, co2e: 31, status: 'APPROVED' },
      { period: '2024-Q2', electricity: 119, water: 0.71, co2e: 28, status: 'APPROVED' },
      { period: '2024-Q3', electricity: 115, water: 0.69, co2e: 26, status: 'APPROVED' },
      { period: '2024-Q4', electricity: 109, water: 0.68, co2e: 25, status: 'APPROVED' },
    ],
    submissions: [],
  },
  {
    projectId: 'PROJ-005',
    name: 'Maplewood Residences',
    organisation: { id: 'ORG-005', name: 'Habitat Works' },
    location: 'Singapore',
    projectType: 'Residential',
    imageUrl:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    latestReportingPeriod: '2024-Q3',
    latestStatus: 'REJECTED',
    highlighted: false,
    certification: 'BCA Green Mark GoldPLUS',
    completionYear: 2019,
    dataUpdatedAt: '11 Jan 2025',
    addedAt: '11 Jan 2025',
    highPerformance: false,
    featured: false,
    distinction: 'Residential estate with rejected Q3 submission awaiting correction.',
    metrics: {
      electricity: { label: 'Electricity', value: 162, unit: 'kWh/m2/year', changePercent: 3.4, previousPeriod: 'Q2 2024', isImprovement: false },
      water: { label: 'Water', value: 1.31, unit: 'm3/m2/year', changePercent: 0.7, previousPeriod: 'Q2 2024', isImprovement: false },
      co2e: { label: 'CO2 Emissions', value: 58, unit: 'kg CO2/m2/year', changePercent: 2.3, previousPeriod: 'Q2 2024', isImprovement: false },
    },
    history: [
      { period: '2024-Q1', electricity: 154, water: 1.26, co2e: 55, status: 'APPROVED' },
      { period: '2024-Q2', electricity: 157, water: 1.3, co2e: 57, status: 'APPROVED' },
      { period: '2024-Q3', electricity: 162, water: 1.31, co2e: 58, status: 'REJECTED' },
    ],
    submissions: [],
  },
  {
    projectId: 'PROJ-006',
    name: 'Rivergate Learning Centre',
    organisation: { id: 'ORG-006', name: 'Public Works Studio' },
    location: 'London',
    projectType: 'Education',
    imageUrl:
      'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80',
    latestReportingPeriod: '2024-Q4',
    latestStatus: 'APPROVED',
    highlighted: false,
    certification: 'LEED Gold',
    completionYear: 2024,
    dataUpdatedAt: '28 Jan 2025',
    addedAt: '28 Jan 2025',
    highPerformance: false,
    featured: true,
    distinction: 'Low-water campus operations verified during first reporting cycle.',
    metrics: {
      electricity: { label: 'Electricity', value: 134, unit: 'kWh/m2/year', changePercent: -1.5, previousPeriod: 'Q3 2024', isImprovement: true },
      water: { label: 'Water', value: 0.64, unit: 'm3/m2/year', changePercent: -4.1, previousPeriod: 'Q3 2024', isImprovement: true },
      co2e: { label: 'CO2 Emissions', value: 39, unit: 'kg CO2/m2/year', changePercent: -2.1, previousPeriod: 'Q3 2024', isImprovement: true },
    },
    history: [
      { period: '2024-Q2', electricity: 139, water: 0.7, co2e: 42, status: 'APPROVED' },
      { period: '2024-Q3', electricity: 136, water: 0.67, co2e: 40, status: 'APPROVED' },
      { period: '2024-Q4', electricity: 134, water: 0.64, co2e: 39, status: 'APPROVED' },
    ],
    submissions: [],
  },
]

const metricConfig: Record<MetricKey, { label: string; short: string; className: string; icon: typeof Leaf }> = {
  electricity: { label: 'Electricity', short: 'kWh', className: 'metric-electricity', icon: Leaf },
  water: { label: 'Water', short: 'm3', className: 'metric-water', icon: Droplets },
  co2e: { label: 'CO2 Emissions', short: 'kg', className: 'metric-co2e', icon: Flame },
}

const visibleMetricKeys: MetricKey[] = ['electricity', 'water', 'co2e']

const categoryLabels: Record<Category, string> = {
  all: 'All Projects',
  recent: 'Recently Added',
  'high-performance': 'High Performance',
  featured: 'Featured',
}

function App() {
  const [highlightedIds, setHighlightedIds] = useState(() => new Set(projects.filter((project) => project.highlighted).map((project) => project.projectId)))
  const [toast, setToast] = useState('')

  const toggleHighlight = (project: Project) => {
    setHighlightedIds((current) => {
      const next = new Set(current)
      const removing = next.has(project.projectId)
      if (removing) next.delete(project.projectId)
      else next.add(project.projectId)
      setToast(removing ? 'Removed from Highlighted' : 'Added to Highlighted')
      window.setTimeout(() => setToast(''), 2200)
      return next
    })
  }

  const enrichedProjects = projects.map((project) => ({
    ...project,
    highlighted: highlightedIds.has(project.projectId),
  }))

  return (
    <BrowserRouter>
      <div className="app">
        <GlobalNavigation projects={enrichedProjects} />
        <Routes>
          <Route path="/" element={<HomePage projects={enrichedProjects} onToggleHighlight={toggleHighlight} />} />
          <Route path="/highlighted" element={<HighlightedPage projects={enrichedProjects} onToggleHighlight={toggleHighlight} />} />
          <Route path="/projects" element={<ProjectsPage projects={enrichedProjects} onToggleHighlight={toggleHighlight} />} />
          <Route path="/projects/:projectId" element={<ProjectDetailPage projects={enrichedProjects} onToggleHighlight={toggleHighlight} />} />
          <Route path="/projects/:projectId/submissions/:submissionId" element={<SubmissionDetailPage projects={enrichedProjects} />} />
          <Route path="/upload" element={<UploadDataPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {toast ? <div className="toast">{toast}</div> : null}
      </div>
    </BrowserRouter>
  )
}

function GlobalNavigation({ projects }: { projects: Project[] }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const matches = query.trim()
    ? projects.filter((project) => `${project.name} ${project.organisation.name} ${project.location}`.toLowerCase().includes(query.toLowerCase())).slice(0, 4)
    : []

  const active = location.pathname.startsWith('/highlighted') ? 'highlighted' : location.pathname.startsWith('/projects') ? 'projects' : 'home'

  return (
    <header className="topbar">
      <Link className="brand" to="/" aria-label="GreenScope home">
        <span className="brand-mark">
          <Leaf size={18} />
        </span>
        GreenScope
      </Link>
      <nav className="primary-nav" aria-label="Primary navigation">
        <Link className={active === 'home' ? 'active' : ''} to="/">Home</Link>
        <Link className={active === 'highlighted' ? 'active' : ''} to="/highlighted">Highlighted</Link>
        <Link className={active === 'projects' ? 'active' : ''} to="/projects">Projects</Link>
      </nav>
      <div className="global-search">
        <Search size={17} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search projects, organisations, or locations..."
          aria-label="Search projects, organisations, or locations"
        />
        {matches.length ? (
          <div className="search-results">
            {matches.map((project) => (
              <button
                key={project.projectId}
                type="button"
                onClick={() => {
                  navigate(`/projects/${project.projectId}`)
                  setQuery('')
                }}
              >
                <strong>{project.name}</strong>
                <span>{project.organisation.name} - {project.location}</span>
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <Link className="upload-data-button" to="/upload">
        <UploadCloud size={18} />
        Upload Data
      </Link>
      <div className="nav-icons">
        <button type="button" aria-label="User profile">
          <UserCircle size={21} />
        </button>
      </div>
    </header>
  )
}

function HomePage({ projects, onToggleHighlight }: { projects: Project[]; onToggleHighlight: (project: Project) => void }) {
  const navigate = useNavigate()
  const latestActivity = sortProjects(projects, 'latest-activity').slice(0, 5)
  const recent = [...projects].sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()).slice(0, 5)
  const featured = projects.filter((project) => project.featured).slice(0, 2)
  const highPerformance = projects.filter((project) => project.highPerformance).slice(0, 5)

  return (
    <main className="page">
      <section className="page-header home-header">
        <div>
          <h1>Discover Sustainable Projects</h1>
          <p>Explore and monitor the sustainability performance of construction projects worldwide.</p>
        </div>
      </section>

      <SectionHeader title="Latest Activity" subtitle="Projects with the most recent sustainability updates." to="/projects?sort=latest-activity" label="View all projects" />
      <div className="trending-row">
        {latestActivity.map((project) => (
          <ProjectCard key={project.projectId} project={project} onToggleHighlight={onToggleHighlight} compact />
        ))}
      </div>

      <CategoryShortcutBar
        onOpen={(category) => navigate(category === 'all' ? '/projects' : `/projects?category=${category}`)}
      />

      <div className="discovery-grid">
        <DiscoveryList
          title="Recently Added"
          to="/projects?category=recent"
          rows={recent}
          render={(project) => (
            <>
              <strong>{project.name}</strong>
              <span>{project.organisation.name}</span>
              <span>{project.addedAt}</span>
            </>
          )}
        />
        <DiscoveryList
          title="High Performance"
          to="/projects?category=high-performance"
          rows={highPerformance}
          render={(project) => (
            <>
              <strong>{project.name}</strong>
              <span>{project.certification}</span>
              <StatusBadge status={project.latestStatus} />
            </>
          )}
        />
        <section className="panel featured-panel">
          <SectionHeader title="Featured Sustainable Buildings" to="/projects?category=featured" label="View all" />
          <div className="featured-list">
            {featured.map((project) => (
              <Link key={project.projectId} to={`/projects/${project.projectId}`} className="featured-card">
                <img src={project.imageUrl} alt={`${project.name} building`} loading="lazy" />
                <div>
                  <strong>{project.name}</strong>
                  <span>{project.organisation.name} - {project.location}</span>
                  <em>{project.certification}</em>
                  <p>{project.distinction}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

function ProjectsPage({ projects, onToggleHighlight }: { projects: Project[]; onToggleHighlight: (project: Project) => void }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const category = parseCategory(searchParams.get('category'))
  const page = Math.max(Number(searchParams.get('page') || '1'), 1)
  const pageSize = Number(searchParams.get('pageSize') || '12')
  const sort = searchParams.get('sort') || 'latest-activity'
  const filters = {
    location: searchParams.get('location') || 'All',
    type: searchParams.get('type') || 'All',
    organisation: searchParams.get('organisation') || 'All',
    status: searchParams.get('status') || 'All',
    period: searchParams.get('period') || 'All',
  }

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams)
    if (value === 'All' || value === 'all' || !value) next.delete(key)
    else next.set(key, value)
    next.set('page', '1')
    setSearchParams(next)
  }

  const filtered = useMemo(() => {
    let result = projects
    if (category === 'recent') result = result.filter((project) => project.addedAt.includes('Jan') || project.addedAt.includes('Feb'))
    if (category === 'high-performance') result = result.filter((project) => project.highPerformance)
    if (category === 'featured') result = result.filter((project) => project.featured)
    if (filters.location !== 'All') result = result.filter((project) => project.location === filters.location)
    if (filters.type !== 'All') result = result.filter((project) => project.projectType === filters.type)
    if (filters.organisation !== 'All') result = result.filter((project) => project.organisation.id === filters.organisation)
    if (filters.status !== 'All') result = result.filter((project) => project.latestStatus === filters.status)
    if (filters.period !== 'All') result = result.filter((project) => project.latestReportingPeriod === filters.period)
    return sortProjects(result, sort)
  }, [category, filters.location, filters.organisation, filters.period, filters.status, filters.type, projects, sort])

  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize)
  const totalPages = Math.max(Math.ceil(filtered.length / pageSize), 1)

  return (
    <main className="page">
      <section className="page-header">
        <h1>Projects</h1>
        <p>Explore and monitor sustainability performance across construction projects worldwide.</p>
      </section>
      <ProjectCategoryBar active={category} onChange={(next) => updateParam('category', next)} />
      <div className="filter-bar">
        <SelectFilter label="Location" value={filters.location} options={unique(projects.map((project) => project.location))} onChange={(value) => updateParam('location', value)} />
        <SelectFilter label="Project Type" value={filters.type} options={unique(projects.map((project) => project.projectType))} onChange={(value) => updateParam('type', value)} />
        <SelectFilter label="Organisation" value={filters.organisation} options={projects.map((project) => ({ value: project.organisation.id, label: project.organisation.name }))} onChange={(value) => updateParam('organisation', value)} />
        <SelectFilter label="Status" value={filters.status} options={['APPROVED', 'UNREVIEWED', 'REJECTED']} onChange={(value) => updateParam('status', value)} />
        <SelectFilter label="Reporting Period" value={filters.period} options={unique(projects.map((project) => project.latestReportingPeriod))} onChange={(value) => updateParam('period', value)} />
        <button className="secondary-button" type="button" onClick={() => setSearchParams(new URLSearchParams())}>Clear All</button>
      </div>
      <div className="results-toolbar">
        <div>
          <strong>{filtered.length.toLocaleString()} projects</strong>
          <span>Sorted by: {sortLabel(sort)}</span>
        </div>
        <div className="toolbar-controls">
          <span className="view-chip"><Grid2X2 size={16} /> Grid View</span>
          <label>
            Sort by
            <select value={sort} onChange={(event) => updateParam('sort', event.target.value)}>
              <option value="latest-activity">Latest Activity</option>
              <option value="recent">Recently Added</option>
              <option value="name-asc">Project Name A-Z</option>
              <option value="name-desc">Project Name Z-A</option>
            </select>
          </label>
        </div>
      </div>
      {pageItems.length ? (
        <div className="project-grid">
          {pageItems.map((project) => (
            <ProjectCard key={project.projectId} project={project} onToggleHighlight={onToggleHighlight} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No projects match these filters.</h2>
          <button className="primary-button" type="button" onClick={() => setSearchParams(new URLSearchParams())}>Clear filters</button>
        </div>
      )}
      <Pagination page={page} totalPages={totalPages} total={filtered.length} pageSize={pageSize} onPage={(nextPage) => updateParam('page', String(nextPage))} />
    </main>
  )
}

function HighlightedPage({ projects, onToggleHighlight }: { projects: Project[]; onToggleHighlight: (project: Project) => void }) {
  const highlighted = projects.filter((project) => project.highlighted)
  const [selectedId, setSelectedId] = useState(highlighted[0]?.projectId)
  const selected = highlighted.find((project) => project.projectId === selectedId) || highlighted[0]

  if (!highlighted.length) {
    return (
      <main className="page">
        <section className="page-header">
          <h1>Highlighted Projects</h1>
          <p>0 projects in your watchlist.</p>
        </section>
        <div className="empty-state">
          <h2>No highlighted projects yet.</h2>
          <p>Star projects from Home or Projects to keep track of them here.</p>
          <Link className="primary-button" to="/projects">Explore Projects</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="page">
      <section className="page-header watchlist-header">
        <div>
          <h1>Highlighted Projects</h1>
          <p>{highlighted.length} projects in your watchlist.</p>
        </div>
        <div className="compact-controls">
          <select aria-label="Sort highlighted projects">
            <option>Last Updated</option>
            <option>Project Name</option>
            <option>Latest Period</option>
            <option>Status</option>
          </select>
          <select aria-label="Filter highlighted projects">
            <option>All</option>
            <option>Approved</option>
            <option>Unreviewed</option>
          </select>
        </div>
      </section>
      <div className="table-wrap">
        <table className="watchlist-table">
          <thead>
            <tr>
              <th>Star</th>
              <th>Project / Organisation</th>
              <th>Status</th>
              <th>Location</th>
              <th>Latest Reporting Period</th>
              <th>Electricity kWh</th>
              <th>Water m3</th>
              <th>CO2 Emissions kg</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {highlighted.map((project) => (
              <tr key={project.projectId} className={selected?.projectId === project.projectId ? 'selected' : ''} onClick={() => setSelectedId(project.projectId)}>
                <td>
                  <button className="star-button active" type="button" aria-label={`Remove ${project.name} from Highlighted`} onClick={(event) => { event.stopPropagation(); onToggleHighlight(project) }}>
                    <Star size={18} fill="currentColor" />
                  </button>
                </td>
                <td><strong>{project.name}</strong><span>{project.organisation.name}</span></td>
                <td><StatusBadge status={project.latestStatus} /></td>
                <td>{project.location}</td>
                <td>{project.latestReportingPeriod}</td>
                <td>{project.metrics.electricity.value}</td>
                <td>{project.metrics.water.value}</td>
                <td>{project.metrics.co2e.value}</td>
                <td><Link to={`/projects/${project.projectId}`}>View Project <ChevronRight size={14} /></Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selected ? <SelectedPreview project={selected} /> : null}
    </main>
  )
}

function ProjectDetailPage({ projects, onToggleHighlight }: { projects: Project[]; onToggleHighlight: (project: Project) => void }) {
  const { projectId } = useParams()
  const project = projects.find((item) => item.projectId === projectId) || projects[0]
  const [metric, setMetric] = useState<MetricKey>('electricity')
  const [range, setRange] = useState('2y')
  const [showProvisional, setShowProvisional] = useState(false)
  const [period, setPeriod] = useState(project.submissions[0]?.reportingPeriod || '')
  const selectedSubmission = project.submissions.find((submission) => submission.reportingPeriod === period)
  const chartRows = chartData(project, metric, range, showProvisional)

  return (
    <main className="page">
      <div className="breadcrumb"><Link to="/projects">Projects</Link><ChevronRight size={14} /><span>{project.name}</span></div>
      <section className="project-header">
        <img src={project.imageUrl} alt={`${project.name} building`} />
        <div>
          <div className="title-row">
            <h1>{project.name}</h1>
            <button className={`highlight-action ${project.highlighted ? 'active' : ''}`} type="button" onClick={() => onToggleHighlight(project)} aria-label={project.highlighted ? `Remove ${project.name} from Highlighted` : `Add ${project.name} to Highlighted`}>
              <Star size={19} fill={project.highlighted ? 'currentColor' : 'none'} />
              {project.highlighted ? 'Highlighted' : 'Highlight'}
            </button>
          </div>
          <div className="badge-row">
            <StatusBadge status={project.latestStatus} verifiedLabel />
            <span className="certification">{project.certification}</span>
          </div>
          <div className="metadata-grid">
            <MetaBlock icon={Building2} label="Year Completed" value={String(project.completionYear)} />
            <MetaBlock icon={CalendarDays} label="Data Updated" value={project.dataUpdatedAt} />
            <MetaBlock icon={LineChart} label="Reporting Period" value={project.latestReportingPeriod} />
          </div>
        </div>
      </section>
      <MetricSummaryGrid project={project} />
      <section className="panel performance-panel">
        <div className="section-heading">
          <div>
            <h2>Performance Trend</h2>
          <p>{metricConfig[metric].label} across recent reporting periods.</p>
          </div>
          <div className="chart-controls">
            <div className="segmented">
              {(['1y', '2y', 'all'] as const).map((option) => (
                <button key={option} className={range === option ? 'active' : ''} type="button" onClick={() => setRange(option)}>{option === 'all' ? 'All' : option.replace('y', ' Year')}</button>
              ))}
            </div>
            <label className="toggle">
              <input type="checkbox" checked={showProvisional} onChange={(event) => setShowProvisional(event.target.checked)} />
              Show provisional data
            </label>
          </div>
        </div>
        <MetricTabs active={metric} onChange={setMetric} />
        <div className="chart-shell">
          <ResponsiveContainer width="100%" height={280}>
            <ReLineChart data={chartRows}>
              <CartesianGrid stroke="#DEE5EB" vertical={false} />
              <XAxis dataKey="period" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={44} />
              <Tooltip />
              <Line type="monotone" dataKey="approved" stroke="#23835E" strokeWidth={3} dot={{ r: 4, fill: '#176B4D' }} connectNulls={false} />
              <Line type="monotone" dataKey="unreviewed" stroke="#D99A2B" strokeWidth={3} strokeDasharray="6 6" dot={{ r: 4, fill: '#D99A2B' }} connectNulls={false} />
            </ReLineChart>
          </ResponsiveContainer>
        </div>
        <div className="legend">
          <span><i className="solid-line" /> Approved</span>
          <span><i className="dashed-line" /> Unreviewed</span>
        </div>
        {showProvisional ? <p className="info-note">Unreviewed data is provisional and subject to change until verified.</p> : null}
      </section>
      <section className="bottom-grid">
        <div className="panel records-panel">
          <SectionHeader title="Submission Records" />
          <SubmissionTable project={project} />
        </div>
        <aside className="panel download-panel">
          <h2>Download Data</h2>
          <p>Select a reporting period to access available files.</p>
          <label>
            Reporting Period
            <select value={period} onChange={(event) => setPeriod(event.target.value)}>
              {project.submissions.map((submission) => <option key={submission.submissionId}>{submission.reportingPeriod}</option>)}
            </select>
          </label>
          {selectedSubmission ? <DownloadList submission={selectedSubmission} /> : <p className="muted">No submissions are available for this project.</p>}
        </aside>
      </section>
    </main>
  )
}

function SubmissionDetailPage({ projects }: { projects: Project[] }) {
  const { projectId, submissionId } = useParams()
  const project = projects.find((item) => item.projectId === projectId) || projects[0]
  const submission = project.submissions.find((item) => item.submissionId === submissionId) || project.submissions[0]

  return (
    <main className="page">
      <div className="breadcrumb"><Link to={`/projects/${project.projectId}`}>{project.name}</Link><ChevronRight size={14} /><span>{submission?.reportingPeriod || 'Submission'}</span></div>
      <section className="panel submission-detail">
        <h1>{submission?.reportingPeriod || 'Submission Record'}</h1>
        {submission ? (
          <>
            <div className="badge-row"><StatusBadge status={submission.status} /><span>{submission.auditor}</span><span>{submission.uploadedAt}</span></div>
            <div className="metric-grid">
              {visibleMetricKeys.map((key) => <MetricMini key={key} metricKey={key} value={submission.metrics[key]} unit={metricConfig[key].short} />)}
            </div>
          </>
        ) : <p>No submission details are available.</p>}
      </section>
    </main>
  )
}

function ProjectCard({ project, onToggleHighlight, compact = false }: { project: Project; onToggleHighlight: (project: Project) => void; compact?: boolean }) {
  return (
    <Link className={`project-card ${compact ? 'compact' : ''}`} to={`/projects/${project.projectId}`}>
      <div className="card-image">
        <img src={project.imageUrl} alt={`${project.name} building`} loading="lazy" />
        <button
          className={`star-button ${project.highlighted ? 'active' : ''}`}
          type="button"
          aria-label={project.highlighted ? `Remove ${project.name} from Highlighted` : `Add ${project.name} to Highlighted`}
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            onToggleHighlight(project)
          }}
        >
          <Star size={18} fill={project.highlighted ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="card-body">
        <h3>{project.name}</h3>
        <p>{project.organisation.name} - {project.location}</p>
        <div className="card-meta">
          <StatusBadge status={project.latestStatus} />
          <span>{project.latestReportingPeriod}</span>
        </div>
        <div className="card-metrics">
          <MetricMini metricKey="electricity" value={project.metrics.electricity.value} unit={project.metrics.electricity.unit} />
          <MetricMini metricKey="co2e" value={project.metrics.co2e.value} unit={project.metrics.co2e.unit} />
          <MetricMini metricKey="water" value={project.metrics.water.value} unit={project.metrics.water.unit} />
        </div>
      </div>
    </Link>
  )
}

function SelectedPreview({ project }: { project: Project }) {
  return (
    <section className="panel selected-preview">
      <img src={project.imageUrl} alt={`${project.name} building`} loading="lazy" />
      <div className="preview-copy">
        <h2>{project.name}</h2>
        <p>{project.organisation.name} - {project.location}</p>
        <div className="badge-row"><StatusBadge status={project.latestStatus} /><span>{project.latestReportingPeriod}</span><span>Updated {project.dataUpdatedAt}</span></div>
        <div className="metric-grid compact-metrics">
          {visibleMetricKeys.map((key) => <MetricBlock key={key} project={project} metricKey={key} />)}
        </div>
      </div>
      <div className="preview-chart">
        <ResponsiveContainer width="100%" height={160}>
          <ReLineChart data={chartData(project, 'co2e', '2y', true)}>
            <Line type="monotone" dataKey="approved" stroke="#23835E" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="unreviewed" stroke="#D99A2B" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            <XAxis dataKey="period" hide />
            <YAxis hide />
            <Tooltip />
          </ReLineChart>
        </ResponsiveContainer>
        <Link className="primary-button" to={`/projects/${project.projectId}`}>View Full Project <ChevronRight size={16} /></Link>
      </div>
    </section>
  )
}

function MetricSummaryGrid({ project }: { project: Project }) {
  return (
    <section className="metric-grid">
      {visibleMetricKeys.map((key) => <MetricBlock key={key} project={project} metricKey={key} />)}
    </section>
  )
}

function MetricBlock({ project, metricKey }: { project: Project; metricKey: MetricKey }) {
  const metric = project.metrics[metricKey]
  const ConfigIcon = metricConfig[metricKey].icon
  return (
    <article className={`metric-card ${metricConfig[metricKey].className}`}>
      <div className="metric-title"><ConfigIcon size={18} /><span>{metric.label}</span></div>
      <strong>{metric.value}</strong>
      <span>{metric.unit}</span>
      <em className={metric.isImprovement ? 'improved' : 'declined'}>
        <TrendingDown size={14} />
        {Math.abs(metric.changePercent)}% vs {metric.previousPeriod}
      </em>
    </article>
  )
}

function MetricMini({ metricKey, value, unit }: { metricKey: MetricKey; value: number; unit: string }) {
  const ConfigIcon = metricConfig[metricKey].icon
  return (
    <span className={`metric-mini ${metricConfig[metricKey].className}`}>
      <ConfigIcon size={14} />
      <strong>{value}</strong>
      <small>{unit}</small>
    </span>
  )
}

function MetricTabs({ active, onChange }: { active: MetricKey; onChange: (metric: MetricKey) => void }) {
  return (
    <div className="metric-tabs">
      {visibleMetricKeys.map((key) => (
        <button className={`${active === key ? 'active' : ''} ${metricConfig[key].className}`} key={key} type="button" onClick={() => onChange(key)}>{metricConfig[key].label}</button>
      ))}
    </div>
  )
}

function SubmissionTable({ project }: { project: Project }) {
  if (!project.submissions.length) return <div className="empty-state small">No submissions are available for this project.</div>
  return (
    <>
      <div className="table-wrap">
        <table className="submission-table">
          <thead>
            <tr><th>Period</th><th>Upload Date</th><th>Status</th><th>Auditor</th><th>Electricity</th><th>CO2 Emissions</th><th>Water</th><th /></tr>
          </thead>
          <tbody>
            {project.submissions.slice(0, 5).map((submission) => (
              <tr key={submission.submissionId}>
                <td>{submission.reportingPeriod}</td>
                <td>{submission.uploadedAt}</td>
                <td><StatusBadge status={submission.status} /></td>
                <td>{submission.auditor}</td>
                <td>{submission.metrics.electricity}</td>
                <td>{submission.metrics.co2e}</td>
                <td>{submission.metrics.water}</td>
                <td><Link aria-label={`Open ${submission.reportingPeriod}`} to={`/projects/${project.projectId}/submissions/${submission.submissionId}`}><ChevronRight size={16} /></Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="table-footer">Showing 1 to {Math.min(project.submissions.length, 5)} of {project.submissions.length} records</div>
    </>
  )
}

function DownloadList({ submission }: { submission: Project['submissions'][number] }) {
  return (
    <div className="download-list">
      {submission.downloads.original ? <DownloadItem title="Original Data (Raw)" helper="As uploaded by the organisation" file={submission.downloads.original} /> : null}
      {submission.downloads.processed ? <DownloadItem title="Processed Data (Cleaned)" helper="Cleaned and standardised by GreenScope" file={submission.downloads.processed} /> : null}
      {submission.downloads.auditReport ? <DownloadItem title="Audit Report" helper="Independent verification report" file={submission.downloads.auditReport} /> : <p className="muted">Audit report not available yet.</p>}
    </div>
  )
}

function DownloadItem({ title, helper, file }: { title: string; helper: string; file: string }) {
  return (
    <div className="download-item">
      <div><strong>{title}</strong><span>{helper}</span><small>{file}</small></div>
      <button type="button" className="secondary-button"><Download size={15} /> Download</button>
    </div>
  )
}

function StatusBadge({ status, verifiedLabel = false }: { status: ProjectStatus; verifiedLabel?: boolean }) {
  const copy = status === 'APPROVED' && verifiedLabel ? 'Verified' : status === 'APPROVED' ? 'Approved' : status === 'UNREVIEWED' ? 'Unreviewed' : 'Rejected'
  const Icon = status === 'APPROVED' ? CheckCircle2 : status === 'UNREVIEWED' ? CalendarDays : XCircle
  return <span className={`status-badge ${status.toLowerCase()}`}><Icon size={14} />{copy}</span>
}

function SectionHeader({ title, subtitle, to, label = 'View all' }: { title: string; subtitle?: string; to?: string; label?: string }) {
  return (
    <div className="section-heading">
      <div>
        <h2>{title}</h2>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {to ? <Link to={to}>{label} <ChevronRight size={15} /></Link> : null}
    </div>
  )
}

function DiscoveryList({ title, to, rows, render }: { title: string; to: string; rows: Project[]; render: (project: Project, index: number) => React.ReactNode }) {
  return (
    <section className="panel discovery-list">
      <SectionHeader title={title} to={to} />
      <div>
        {rows.map((project, index) => (
          <Link className="discovery-row" key={project.projectId} to={`/projects/${project.projectId}`}>{render(project, index)}</Link>
        ))}
      </div>
    </section>
  )
}

function CategoryShortcutBar({ onOpen }: { onOpen: (category: Category) => void }) {
  return (
    <div className="category-shortcuts">
      {(Object.keys(categoryLabels) as Category[]).map((category) => (
        <button key={category} type="button" onClick={() => onOpen(category)}>{categoryLabels[category]}</button>
      ))}
    </div>
  )
}

function ProjectCategoryBar({ active, onChange }: { active: Category; onChange: (category: Category) => void }) {
  return (
    <div className="category-bar">
      {(Object.keys(categoryLabels) as Category[]).map((category) => (
        <button key={category} className={active === category ? 'active' : ''} type="button" onClick={() => onChange(category)}>{categoryLabels[category]}</button>
      ))}
    </div>
  )
}

function SelectFilter({ label, value, options, onChange }: { label: string; value: string; options: Array<string | { value: string; label: string }>; onChange: (value: string) => void }) {
  return (
    <label>
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="All">All</option>
        {options.map((option) => {
          const normalized = typeof option === 'string' ? { value: option, label: option } : option
          return <option key={normalized.value} value={normalized.value}>{normalized.label}</option>
        })}
      </select>
    </label>
  )
}

function MetaBlock({ icon: Icon, label, value }: { icon: typeof Building2; label: string; value: string }) {
  return (
    <div className="meta-block"><Icon size={17} /><span>{label}</span><strong>{value}</strong></div>
  )
}

function Pagination({ page, totalPages, total, pageSize, onPage }: { page: number; totalPages: number; total: number; pageSize: number; onPage: (page: number) => void }) {
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)
  return (
    <div className="pagination">
      <span>Showing {start} to {end} of {total.toLocaleString()} projects</span>
      <div>
        <button type="button" disabled={page <= 1} onClick={() => onPage(page - 1)} aria-label="Previous page"><ChevronLeft size={16} /></button>
        <span>{page} / {totalPages}</span>
        <button type="button" disabled={page >= totalPages} onClick={() => onPage(page + 1)} aria-label="Next page"><ChevronRight size={16} /></button>
      </div>
    </div>
  )
}

function parseCategory(value: string | null): Category {
  return value === 'recent' || value === 'high-performance' || value === 'featured' ? value : 'all'
}

function sortProjects(input: Project[], sort: string) {
  const result = [...input]
  if (sort === 'recent') return result.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
  if (sort === 'name-asc') return result.sort((a, b) => a.name.localeCompare(b.name))
  if (sort === 'name-desc') return result.sort((a, b) => b.name.localeCompare(a.name))
  return result.sort((a, b) => new Date(b.dataUpdatedAt).getTime() - new Date(a.dataUpdatedAt).getTime())
}

function sortLabel(sort: string) {
  if (sort === 'recent') return 'Recently Added'
  if (sort === 'name-asc') return 'Project Name A-Z'
  if (sort === 'name-desc') return 'Project Name Z-A'
  return 'Latest Activity'
}

function unique(values: string[]) {
  return Array.from(new Set(values))
}

function chartData(project: Project, metric: MetricKey, range: string, includeUnreviewed: boolean) {
  const rows = range === '1y' ? project.history.slice(-4) : range === '2y' ? project.history.slice(-8) : project.history
  return rows
    .filter((row) => row.status !== 'REJECTED')
    .map((row) => ({
      period: row.period,
      approved: row.status === 'APPROVED' ? row[metric] : null,
      unreviewed: includeUnreviewed && row.status === 'UNREVIEWED' ? row[metric] : null,
    }))
}

export default App
