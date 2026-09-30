import { useEffect, useState } from 'react'
import { ArrowLeft, ExternalLink, FileText, FolderKanban, LogOut, Mail, Plus, Save, ShieldCheck, Trash2, Trophy, BriefcaseBusiness } from 'lucide-react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'

const tabs = [
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'experience', label: 'Experience', icon: BriefcaseBusiness },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
  { id: 'messages', label: 'Messages', icon: Mail },
  { id: 'profile', label: 'Profile & resume', icon: FileText },
]

const emptyForms = {
  projects: { title: '', description: '', technologies: '', githubUrl: '', liveUrl: '', image: '', category: '', featured: false },
  experience: { company: '', position: '', duration: '', location: '', description: '', technologies: '', certificateUrl: '' },
  achievements: { title: '', category: '', date: '', description: '', url: '' },
  profile: { name: '', headline: '', intro: '', email: '', phone: '', university: '', degree: '', duration: '', cgpa: '', resumeUrl: '', github: '', linkedin: '', leetcode: '', geeksforgeeks: '' },
}

const collectionTabs = ['projects', 'experience', 'achievements']
const emptyDashboard = { projects: [], experience: [], achievements: [], messages: [], profile: emptyForms.profile }

async function fetchDashboard(token) {
  const [projects, experience, achievements, messages, profile] = await Promise.all([
    api.request('/projects', { token }),
    api.request('/experience', { token }),
    api.request('/achievements', { token }),
    api.request('/contact', { token }),
    api.request('/profile', { token }),
  ])
  return { projects, experience, achievements, messages, profile: { ...emptyForms.profile, ...profile } }
}

export default function AdminPage() {
  const [token, setToken] = useState(() => sessionStorage.getItem('portfolio_admin_token') || '')
  const [activeTab, setActiveTab] = useState('projects')
  const [data, setData] = useState({ projects: [], experience: [], achievements: [], messages: [], profile: emptyForms.profile })
  const [form, setForm] = useState(emptyForms.projects)
  const [selectedId, setSelectedId] = useState('')
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState(null)

  useEffect(() => {
    if (!token) return undefined
    let cancelled = false
    fetchDashboard(token).then((dashboard) => {
      if (!cancelled) {
        setData(dashboard)
        setNotice(null)
      }
    }).catch((error) => {
      if (cancelled) return
      setNotice({ kind: 'error', text: error.message || 'Could not load dashboard data.' })
      if (/token|authoriz|expired/i.test(error.message)) {
        sessionStorage.removeItem('portfolio_admin_token')
        setToken('')
        setData(emptyDashboard)
      }
    })
    return () => { cancelled = true }
  }, [token])

  async function loadData(currentToken) {
    try {
      setData(await fetchDashboard(currentToken))
      setNotice(null)
    } catch (error) {
      setNotice({ kind: 'error', text: error.message || 'Could not load dashboard data.' })
      if (/token|authoriz|expired/i.test(error.message)) {
        sessionStorage.removeItem('portfolio_admin_token')
        setToken('')
        setData(emptyDashboard)
      }
    }
  }

  function logout() {
    sessionStorage.removeItem('portfolio_admin_token')
    setToken('')
    setData({ projects: [], experience: [], achievements: [], messages: [], profile: emptyForms.profile })
  }

  async function submitLogin(event) {
    event.preventDefault()
    setBusy(true)
    setNotice(null)
    try {
      const result = await api.login(credentials)
      sessionStorage.setItem('portfolio_admin_token', result.token)
      setToken(result.token)
    } catch (error) {
      setNotice({ kind: 'error', text: error.message || 'Sign in failed.' })
    } finally {
      setBusy(false)
    }
  }

  function startNew() {
    setSelectedId('')
    setForm(emptyForms[activeTab])
    setNotice(null)
  }

  function selectTab(tabId) {
    setActiveTab(tabId)
    setSelectedId('')
    setForm(tabId === 'profile' ? { ...emptyForms.profile, ...data.profile } : emptyForms[tabId] || emptyForms.projects)
  }

  function startEdit(item) {
    setSelectedId(item._id)
    setForm({ ...emptyForms[activeTab], ...item, technologies: Array.isArray(item.technologies) ? item.technologies.join(', ') : item.technologies || '' })
    setNotice(null)
  }

  function updateForm(event) {
    const { name, value, type, checked } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  async function saveRecord(event) {
    event.preventDefault()
    setBusy(true)
    setNotice(null)
    const isProfile = activeTab === 'profile'
    const path = isProfile ? '/profile' : `/${activeTab}${selectedId ? `/${selectedId}` : ''}`
    const method = isProfile || selectedId ? 'PUT' : 'POST'
    const payload = { ...form }
    if (typeof payload.technologies === 'string') payload.technologies = payload.technologies.split(',').map((item) => item.trim()).filter(Boolean)
    try {
      const saved = await api.request(path, { method, token, body: payload })
      await loadData(token)
      if (isProfile) setForm({ ...emptyForms.profile, ...saved })
      else startNew()
      setNotice({ kind: 'success', text: isProfile ? 'Profile saved.' : `${activeTab.slice(0, -1)} saved.` })
    } catch (error) {
      setNotice({ kind: 'error', text: error.message || 'Could not save changes.' })
    } finally {
      setBusy(false)
    }
  }

  async function deleteRecord(path, id) {
    if (!window.confirm('Delete this item? This cannot be undone.')) return
    setBusy(true)
    setNotice(null)
    try {
      await api.request(`/${path}/${id}`, { method: 'DELETE', token })
      await loadData(token)
      if (selectedId === id) startNew()
      setNotice({ kind: 'success', text: 'Item deleted.' })
    } catch (error) {
      setNotice({ kind: 'error', text: error.message || 'Could not delete this item.' })
    } finally {
      setBusy(false)
    }
  }

  if (!token) {
    return (
      <main className="admin-login-page">
        <Link to="/" className="admin-back"><ArrowLeft size={16} /> Back to portfolio</Link>
        <section className="login-card">
          <div className="login-icon"><ShieldCheck size={24} /></div>
          <span className="eyebrow">Portfolio management</span><h1>Admin sign in</h1><p>Sign in with the administrator account configured on the server.</p>
          <form onSubmit={submitLogin} className="admin-form">
            <label>Email<input type="email" autoComplete="username" value={credentials.email} onChange={(event) => setCredentials({ ...credentials, email: event.target.value })} required /></label>
            <label>Password<input type="password" autoComplete="current-password" value={credentials.password} onChange={(event) => setCredentials({ ...credentials, password: event.target.value })} required /></label>
            {notice && <p className="admin-notice admin-notice--error" role="alert">{notice.text}</p>}
            <button className="button button-primary admin-submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'} <ArrowLeft className="login-arrow" size={16} /></button>
          </form>
          <span className="login-foot"><ShieldCheck size={14} /> Protected by server-side authentication</span>
        </section>
      </main>
    )
  }

  const records = data[activeTab] || []
  const isCollection = collectionTabs.includes(activeTab)

  return (
    <main className="admin-page">
      <aside className="admin-sidebar">
        <Link className="wordmark admin-wordmark" to="/"><span className="wordmark-mark">AM</span><span>Ansh Mani<span className="wordmark-dot">.</span></span></Link>
        <div className="admin-sidebar-label">Workspace</div>
        <nav className="admin-nav" aria-label="Admin sections">{tabs.map(({ id, label, icon: Icon }) => <button key={id} className={activeTab === id ? 'admin-nav-item is-active' : 'admin-nav-item'} onClick={() => selectTab(id)}><Icon size={17} />{label}{id === 'messages' && data.messages.length > 0 && <span className="admin-count">{data.messages.length}</span>}</button>)}</nav>
        <div className="admin-sidebar-bottom"><span className="admin-user-badge">AM</span><span><b>Ansh Mani</b><small>Portfolio admin</small></span><button className="icon-button" aria-label="Sign out" title="Sign out" onClick={logout}><LogOut size={17} /></button></div>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar"><div><span className="eyebrow">Workspace / {tabs.find((tab) => tab.id === activeTab)?.label}</span><h1>{activeTab === 'profile' ? 'Profile & resume' : activeTab[0].toUpperCase() + activeTab.slice(1)}</h1></div><Link to="/" className="admin-view-site">View portfolio <ExternalLink size={15} /></Link></header>
        {notice && <p className={`admin-notice admin-notice--${notice.kind}`} role="status">{notice.text}</p>}
        {isCollection && <div className="admin-workspace">
          <section className="admin-records"><div className="admin-section-head"><div><h2>Published items</h2><span>{records.length} total</span></div><button className="button button-primary" onClick={startNew}><Plus size={16} /> Add new</button></div>
            {records.length ? <div className="admin-record-list">{records.map((item) => <article className={`admin-record${selectedId === item._id ? ' is-selected' : ''}`} key={item._id}><button className="admin-record-main" onClick={() => startEdit(item)}><span className="admin-record-title">{item.title || item.position || item.company}</span><span className="admin-record-meta">{item.category || item.duration || item.company || 'Portfolio item'}</span></button><div className="admin-record-actions"><button className="icon-button" onClick={() => startEdit(item)} aria-label="Edit item" title="Edit"><FileText size={16} /></button><button className="icon-button danger-icon" onClick={() => deleteRecord(activeTab, item._id)} aria-label="Delete item" title="Delete"><Trash2 size={16} /></button></div></article>)}</div> : <div className="admin-empty">Nothing here yet. Add the first item when you’re ready.</div>}
          </section>
          <form className="admin-editor" onSubmit={saveRecord}><div className="admin-editor-head"><div><span className="eyebrow">{selectedId ? 'Edit item' : 'New item'}</span><h2>{selectedId ? 'Update details' : `Add ${activeTab.slice(0, -1)}`}</h2></div>{selectedId && <button type="button" className="text-link" onClick={startNew}>Clear</button>}</div>
            {activeTab === 'projects' && <><label>Project title<input name="title" value={form.title} onChange={updateForm} required maxLength={120} /></label><label>Description<textarea name="description" value={form.description} onChange={updateForm} required rows="3" maxLength={1500} /></label><label>Technologies <span className="field-hint">Comma separated</span><input name="technologies" value={form.technologies} onChange={updateForm} placeholder="React, Node.js, MongoDB" /></label><div className="admin-form-grid"><label>Category<input name="category" value={form.category} onChange={updateForm} required maxLength={60} /></label><label>Image URL<input name="image" type="url" value={form.image} onChange={updateForm} /></label></div><label>GitHub URL<input name="githubUrl" type="url" value={form.githubUrl} onChange={updateForm} /></label><label>Live URL<input name="liveUrl" type="url" value={form.liveUrl} onChange={updateForm} /></label><label className="checkbox-field"><input name="featured" type="checkbox" checked={Boolean(form.featured)} onChange={updateForm} /> Mark as featured</label></>}
            {activeTab === 'experience' && <><div className="admin-form-grid"><label>Company<input name="company" value={form.company} onChange={updateForm} required maxLength={120} /></label><label>Position<input name="position" value={form.position} onChange={updateForm} required maxLength={120} /></label></div><div className="admin-form-grid"><label>Duration<input name="duration" value={form.duration} onChange={updateForm} required maxLength={80} /></label><label>Location<input name="location" value={form.location} onChange={updateForm} maxLength={120} /></label></div><label>Description<textarea name="description" value={form.description} onChange={updateForm} required rows="4" maxLength={1500} /></label><label>Technologies <span className="field-hint">Comma separated</span><input name="technologies" value={form.technologies} onChange={updateForm} /></label><label>Certificate URL<input name="certificateUrl" type="url" value={form.certificateUrl} onChange={updateForm} /></label></>}
            {activeTab === 'achievements' && <><label>Title<input name="title" value={form.title} onChange={updateForm} required maxLength={140} /></label><div className="admin-form-grid"><label>Category<input name="category" value={form.category} onChange={updateForm} required maxLength={80} placeholder="Certification, competition…" /></label><label>Date<input name="date" value={form.date} onChange={updateForm} maxLength={80} placeholder="Optional" /></label></div><label>Description<textarea name="description" value={form.description} onChange={updateForm} required rows="4" maxLength={1500} /></label><label>Reference URL<input name="url" type="url" value={form.url} onChange={updateForm} /></label></>}
            <button className="button button-primary admin-save" disabled={busy}><Save size={16} /> {busy ? 'Saving…' : selectedId ? 'Save changes' : 'Create item'}</button>
          </form>
        </div>}
        {activeTab === 'messages' && <section className="admin-messages"><div className="admin-section-head"><div><h2>Inbox</h2><span>{data.messages.length} messages</span></div></div>{data.messages.length ? data.messages.map((message) => <article className="message-card" key={message._id}><div className="message-card-top"><div><h3>{message.subject}</h3><span>{message.name} · <a href={`mailto:${message.email}`}>{message.email}</a></span></div><button className="icon-button danger-icon" aria-label="Delete message" onClick={() => deleteRecord('contact', message._id)} title="Delete message"><Trash2 size={17} /></button></div><p>{message.message}</p><time>{new Date(message.createdAt).toLocaleString()}</time></article>) : <div className="admin-empty">Your inbox is clear.</div>}</section>}
        {activeTab === 'profile' && <form className="admin-profile-form" onSubmit={saveRecord}><div className="admin-editor-head"><div><span className="eyebrow">Public details</span><h2>Profile information</h2></div></div><div className="admin-form-grid"><label>Name<input name="name" value={form.name || ''} onChange={updateForm} required /></label><label>Headline<input name="headline" value={form.headline || ''} onChange={updateForm} /></label></div><label>Introduction<textarea name="intro" value={form.intro || ''} onChange={updateForm} rows="3" maxLength={700} /></label><div className="admin-form-grid"><label>Email<input name="email" type="email" value={form.email || ''} onChange={updateForm} /></label><label>Phone<input name="phone" value={form.phone || ''} onChange={updateForm} /></label></div><div className="admin-form-grid"><label>Degree<input name="degree" value={form.degree || ''} onChange={updateForm} /></label><label>University<input name="university" value={form.university || ''} onChange={updateForm} /></label></div><div className="admin-form-grid"><label>Duration<input name="duration" value={form.duration || ''} onChange={updateForm} /></label><label>CGPA<input name="cgpa" value={form.cgpa || ''} onChange={updateForm} /></label></div><label>Resume URL or file path<input name="resumeUrl" type="url" value={form.resumeUrl || ''} onChange={updateForm} placeholder="https://…" /></label><div className="admin-form-grid"><label>GitHub URL<input name="github" type="url" value={form.github || ''} onChange={updateForm} /></label><label>LinkedIn URL<input name="linkedin" type="url" value={form.linkedin || ''} onChange={updateForm} /></label><label>LeetCode URL<input name="leetcode" type="url" value={form.leetcode || ''} onChange={updateForm} /></label><label>GeeksforGeeks URL<input name="geeksforgeeks" type="url" value={form.geeksforgeeks || ''} onChange={updateForm} /></label></div><button className="button button-primary admin-save" disabled={busy}><Save size={16} /> Save profile</button></form>}
      </div>
    </main>
  )
}