import { defaultProjects, education, profile } from '../data/portfolio'

const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || ''

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}/api${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })
  if (response.status === 204) return null
  if (!response.headers.get('content-type')?.includes('application/json')) throw new Error('The API returned an unexpected response. Check VITE_API_URL and the API deployment.')
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.message || 'The request could not be completed.')
  return payload
}

export const api = {
  request,
  async portfolio() {
    const [projects, experience, achievements, remoteProfile] = await Promise.allSettled([
      request('/projects'), request('/experience'), request('/achievements'), request('/profile'),
    ])
    return {
      projects: projects.status === 'fulfilled' && projects.value.length ? projects.value : defaultProjects,
      experience: experience.status === 'fulfilled' ? experience.value : [],
      achievements: achievements.status === 'fulfilled' ? achievements.value : [],
      profile: remoteProfile.status === 'fulfilled' ? { ...profile, ...remoteProfile.value } : profile,
      education,
    }
  },
  contact: (message) => request('/contact', { method: 'POST', body: message }),
  login: (credentials) => request('/auth/login', { method: 'POST', body: credentials }),
}