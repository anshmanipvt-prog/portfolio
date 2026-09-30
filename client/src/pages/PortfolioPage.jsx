import { useEffect, useMemo, useState } from 'react'
import { ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight, Braces, Check, Code2, ExternalLink, Github, Globe2, GraduationCap, Mail, MapPin, Send, Sparkles } from 'lucide-react'
import { api } from '../services/api'
import { defaultProjects, education, interests, profile as initialProfile, skillGroups } from '../data/portfolio'
import SectionHeading from '../components/SectionHeading'
import ProjectCard from '../components/ProjectCard'
import Footer from '../components/Footer'
import HeroScene from '../components/HeroScene'

export default function PortfolioPage() {
  const [content, setContent] = useState({ projects: defaultProjects, experience: [], achievements: [], profile: initialProfile })
  const [filter, setFilter] = useState('All')
  const [contact, setContact] = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const [contactStatus, setContactStatus] = useState(null)
  const [resumeNotice, setResumeNotice] = useState(false)

  useEffect(() => {
    let mounted = true
    api.portfolio().then((data) => { if (mounted) setContent(data) })
    return () => { mounted = false }
  }, [])

  const categories = useMemo(() => ['All', ...new Set(content.projects.map((project) => project.category).filter(Boolean))], [content.projects])
  const visibleProjects = useMemo(() => filter === 'All' ? content.projects : content.projects.filter((project) => project.category === filter), [content.projects, filter])
  const currentProfile = { ...initialProfile, ...content.profile }
  const profileLinks = [
    { label: 'GitHub', href: currentProfile.github, icon: Github },
    { label: 'LinkedIn', href: currentProfile.linkedin, icon: ExternalLink },
    { label: 'LeetCode', href: currentProfile.leetcode, icon: Code2 },
    { label: 'GeeksforGeeks', href: currentProfile.geeksforgeeks, icon: Braces },
    { label: 'Email', href: `mailto:${currentProfile.email}`, icon: Mail },
  ]
  const activeCodingProfiles = [
    { name: 'GitHub', handle: '@anshmanipvt-prog', url: currentProfile.github, mark: 'GH', description: 'Projects, experiments and source code.' },
    { name: 'LeetCode', handle: 'anshmanipvt-prog', url: currentProfile.leetcode, mark: 'LC', description: 'Practice in algorithms and data structures.' },
    { name: 'GeeksforGeeks', handle: 'anshmas4qp', url: currentProfile.geeksforgeeks, mark: 'GFG', description: 'Learning notes and coding practice.' },
  ]

  function updateContact(event) {
    setContact({ ...contact, [event.target.name]: event.target.value })
  }

  async function submitContact(event) {
    event.preventDefault()
    setSending(true)
    setContactStatus(null)
    try {
      await api.contact(contact)
      setContact({ name: '', email: '', subject: '', message: '' })
      setContactStatus({ kind: 'success', text: 'Message sent. Thanks for reaching out.' })
    } catch (error) {
      setContactStatus({ kind: 'error', text: error.message || 'Message could not be sent. Please try again shortly.' })
    } finally {
      setSending(false)
    }
  }

  function showResumeNotice() {
    setResumeNotice(true)
    window.setTimeout(() => setResumeNotice(false), 4200)
  }

  return (
    <>
    <main>
      <section className="hero section-shell" id="home">
        <div className="hero-copy">
          <div className="availability"><span className="availability-dot" /> B.Tech CSE · {currentProfile.duration}</div>
          <p className="hero-kicker">Shobhit University</p>
          <h1>Hi, I’m<br /><span>Ansh Mani<span className="hero-period">.</span></span></h1>
          <p className="hero-role">{currentProfile.headline}</p>
          <p className="hero-intro">{currentProfile.intro}</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#projects">View My Projects <ArrowDownRight size={17} /></a>
            {currentProfile.resumeUrl ? <a className="button button-outline" href={currentProfile.resumeUrl} target="_blank" rel="noreferrer">Download Resume <ArrowDown size={16} /></a> : <button className="button button-outline" onClick={showResumeNotice}>Download Resume <ArrowDown size={16} /></button>}
            <a className="hero-contact-link" href="#contact">Contact Me <ArrowRight size={15} /></a>
          </div>
          {resumeNotice && <p className="inline-note" role="status">The resume file has not been added yet.</p>}
          <div className="hero-socials" aria-label="Social profiles">
            {profileLinks.map(({ label, href, icon: Icon }) => <a key={label} href={href} target={label === 'Email' ? undefined : '_blank'} rel={label === 'Email' ? undefined : 'noreferrer'} aria-label={label} title={label}><Icon size={17} /></a>)}
          </div>
        </div>
        <div className="hero-art" aria-label="Developer workspace illustration">
          <HeroScene />
          <div className="code-window">
            <div className="window-top"><div className="window-dots"><i /><i /><i /></div><span>anshmani.js</span><span className="window-lock">JS</span></div>
            <div className="code-body">
              <div className="code-line"><span className="line-no">01</span><span><b className="code-purple">const</b> <b className="code-white">developer</b> = {'{'}</span></div>
              <div className="code-line"><span className="line-no">02</span><span className="indent"><b className="code-cyan">name</b>: <b className="code-green">'Ansh Mani'</b>,</span></div>
              <div className="code-line"><span className="line-no">03</span><span className="indent"><b className="code-cyan">focus</b>: [</span></div>
              <div className="code-line"><span className="line-no">04</span><span className="indent indent-more"><b className="code-green">'web development'</b>,</span></div>
              <div className="code-line"><span className="line-no">05</span><span className="indent indent-more"><b className="code-green">'problem solving'</b></span></div>
              <div className="code-line"><span className="line-no">06</span><span className="indent">],</span></div>
              <div className="code-line"><span className="line-no">07</span><span className="indent"><b className="code-cyan">currently</b>: <b className="code-green">'building & learning'</b></span></div>
              <div className="code-line"><span className="line-no">08</span><span>{'}'}</span></div>
              <div className="code-line code-cursor"><span className="line-no">09</span><span><span className="cursor-block" /></span></div>
            </div>
            <div className="window-status"><span><span className="availability-dot" /> Ready to build</span><span>UTF-8&nbsp; · &nbsp;JavaScript</span></div>
          </div>
          <div className="float-chip chip-top"><span className="chip-icon"><Code2 size={17} /></span><span><b>Full-stack</b><small>web projects</small></span></div>
          <div className="float-chip chip-bottom"><span className="chip-icon chip-icon--orange"><Braces size={18} /></span><span><b>C++</b><small>DSA practice</small></span></div>
          <span className="hero-spark spark-one"><Sparkles size={17} /></span><span className="hero-spark spark-two">{`{ }`}</span>
        </div>
        <a className="scroll-cue" href="#about"><span>Scroll to explore</span><ArrowDown size={15} /></a>
      </section>

      <section className="intro-strip" aria-label="Portfolio highlights">
        <div><span className="strip-label">01 / About</span><span>Curious by nature.</span></div>
        <div><span className="strip-label">02 / Practice</span><span>Better with every build.</span></div>
        <div><span className="strip-label">03 / Direction</span><span>Software that solves real needs.</span></div>
      </section>

      <section className="section-shell about-section" id="about">
        <SectionHeading eyebrow="A little about me" title="Learning today. Building for tomorrow." />
        <div className="about-grid">
          <div className="about-main"><p className="about-lead">I’m a Computer Science Engineering student at <span>Shobhit University</span>, developing my skills in software development, web development, programming and Data Structures & Algorithms.</p><p>I enjoy turning what I learn into practical projects. Each build gives me a chance to explore a new idea, understand the details, and make something useful along the way.</p><div className="about-meta"><div><span>Currently pursuing</span><strong>B.Tech · Computer Science</strong></div><div><span>University</span><strong>{currentProfile.university}</strong></div></div></div>
          <div className="interest-panel"><div className="panel-heading"><span className="panel-icon"><Sparkles size={16} /></span><div><span className="eyebrow">Outside the editor</span><h3>Things I’m into</h3></div></div><div className="interest-tags">{interests.map((interest) => <span key={interest}>{interest}</span>)}</div><div className="interest-foot"><span className="availability-dot" /> Always learning something new</div></div>
        </div>
      </section>

      <section className="skills-section" id="skills">
        <div className="section-shell"><SectionHeading eyebrow="The toolkit" title="Tools I work with" /><div className="skill-grid">{skillGroups.map((group, index) => <article className="skill-group" key={group.title}><div className="skill-group-top"><span className="skill-number">0{index + 1}</span><span className="skill-line" /></div><h3>{group.title}</h3><div className="skill-tags">{group.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></article>)}</div></div>
      </section>

      <section className="section-shell projects-section" id="projects">
        <SectionHeading eyebrow="Selected work" title="Projects, built with purpose." ><span>Experiments, coursework and real-world ideas. Each one is a chance to learn by doing.</span></SectionHeading>
        <div className="filter-row" role="group" aria-label="Filter projects by category">{categories.map((category) => <button className={filter === category ? 'filter-chip is-active' : 'filter-chip'} key={category} onClick={() => setFilter(category)} aria-pressed={filter === category}>{category}</button>)}</div>
        {visibleProjects.length ? <div className="project-grid">{visibleProjects.map((project, index) => <ProjectCard key={project._id || project.title} project={project} index={index} />)}</div> : <div className="empty-state">No projects in this category yet.</div>}
      </section>

      <section className="coding-section" id="coding">
        <div className="section-shell coding-layout"><div className="coding-copy"><SectionHeading eyebrow="Keep sharpening" title="Practice is part of the process." /><p>Actively practicing Data Structures & Algorithms and problem solving using C++.</p><span className="coding-note"><Code2 size={16} /> Consistency over shortcuts.</span></div><div className="profile-list">{activeCodingProfiles.map((item) => <a href={item.url} key={item.name} target="_blank" rel="noreferrer" className="profile-row"><span className={`profile-mark profile-mark--${item.mark.toLowerCase()}`}>{item.mark}</span><span className="profile-row-text"><b>{item.name}</b><small>{item.description}</small></span><span className="profile-handle">{item.handle}</span><ArrowUpRight size={17} className="profile-arrow" /></a>)}</div></div>
      </section>

      <section className="section-shell education-section" id="education">
        <SectionHeading eyebrow="The foundation" title="Education" />
        <div className="education-timeline"><div className="timeline-rail"><span className="timeline-node"><GraduationCap size={19} /></span></div><article className="education-card"><div className="education-top"><span className="eyebrow">{currentProfile.duration}</span><span className="education-status"><i /> In progress</span></div><h3>{currentProfile.degree}</h3><p className="education-school">{currentProfile.university}</p><div className="education-details"><span>CGPA <b>{currentProfile.cgpa}</b></span><span>Relevant areas</span></div><div className="education-tags">{education.areas.map((area) => <span key={area}>{area}</span>)}</div></article></div>
      </section>

      <section className="experience-section" id="experience">
        <div className="section-shell"><SectionHeading eyebrow="Work & practice" title="Experience" /><div className="dynamic-grid"><div className="dynamic-column">{content.experience.length ? content.experience.map((item) => <article className="dynamic-item" key={item._id}><span className="dynamic-date">{item.duration}{item.location ? ` · ${item.location}` : ''}</span><h4>{item.position} · {item.company}</h4><p>{item.description}</p><div className="education-tags">{item.technologies?.map((technology) => <span key={technology}>{technology}</span>)}</div></article>) : <div className="dynamic-empty"><span>01</span><p>Experience details will be updated soon.</p></div>}</div></div></div>
      </section>

      <section className="experience-section achievements-section" id="achievements">
        <div className="section-shell"><SectionHeading eyebrow="Milestones" title="Achievements" /><div className="dynamic-grid"><div className="dynamic-column">{content.achievements.length ? content.achievements.map((item) => <article className="dynamic-item" key={item._id}><span className="dynamic-date">{item.date || item.category}</span><h4>{item.title}</h4><p>{item.description}</p>{item.url && <a className="text-link" href={item.url} target="_blank" rel="noreferrer">View details <ArrowUpRight size={14} /></a>}</article>) : <div className="dynamic-empty"><span>02</span><p>Achievements will be added here when available.</p></div>}</div></div></div>
      </section>

      <section className="section-shell resume-section" id="resume">
        <div className="resume-card"><div className="resume-icon"><Code2 size={22} /></div><div className="resume-copy"><span className="eyebrow">One page, the essentials</span><h2>Want the quick overview?</h2><p>My resume brings together my education, skills and selected projects.</p>{resumeNotice && <span className="inline-note" role="status">The resume file has not been added yet.</span>}</div><div className="resume-preview">{currentProfile.resumeUrl ? <iframe src={currentProfile.resumeUrl} title="Resume preview" loading="lazy" /> : <div><span className="eyebrow">Resume preview</span><strong>Not uploaded yet</strong><small>Available here when added by admin.</small></div>}</div><div className="resume-actions">{currentProfile.resumeUrl ? <><a className="button button-primary" href={currentProfile.resumeUrl} download>Download Resume <ArrowDown size={16} /></a><a className="text-link" href={currentProfile.resumeUrl} target="_blank" rel="noreferrer">Open resume <ArrowUpRight size={15} /></a></> : <><button className="button button-primary" onClick={showResumeNotice}>Download Resume <ArrowDown size={16} /></button><button className="text-link" onClick={showResumeNotice}>Open resume <ArrowUpRight size={15} /></button></>}</div><div className="resume-decoration" aria-hidden="true">AM</div></div>
      </section>

      <section className="contact-section" id="contact">
        <div className="section-shell contact-layout"><div className="contact-copy"><SectionHeading eyebrow="Say hello" title="Let’s build something meaningful." /><p>Have a project in mind, an opportunity to share, or just want to connect? Send me a note.</p><div className="contact-details"><a href={`mailto:${currentProfile.email}`}><span className="contact-detail-icon"><Mail size={17} /></span><span><small>Email</small><b>{currentProfile.email}</b></span><ArrowUpRight size={16} /></a><a href={`tel:${currentProfile.phone}`}><span className="contact-detail-icon"><Globe2 size={17} /></span><span><small>Phone</small><b>{currentProfile.phone}</b></span><ArrowUpRight size={16} /></a><a href={currentProfile.linkedin} target="_blank" rel="noreferrer"><span className="contact-detail-icon"><MapPin size={17} /></span><span><small>Professional network</small><b>Connect on LinkedIn</b></span><ArrowUpRight size={16} /></a></div></div>
          <form className="contact-form" onSubmit={submitContact}>
            <div className="form-heading"><span>Send a message</span><span className="form-heading-mark"><Send size={15} /></span></div>
            <div className="form-row"><label>Name<input name="name" autoComplete="name" value={contact.name} onChange={updateContact} required minLength={2} maxLength={80} placeholder="Your name" /></label><label>Email<input name="email" type="email" autoComplete="email" value={contact.email} onChange={updateContact} required maxLength={254} placeholder="you@example.com" /></label></div>
            <label>Subject<input name="subject" value={contact.subject} onChange={updateContact} required minLength={2} maxLength={120} placeholder="What’s this about?" /></label>
            <label>Message<textarea name="message" value={contact.message} onChange={updateContact} required minLength={10} maxLength={4000} rows="4" placeholder="Write your message..." /></label>
            <div className="form-footer"><span className="form-privacy">Your message is sent securely.</span><button className="button button-primary" type="submit" disabled={sending}>{sending ? 'Sending…' : 'Send Message'} {sending ? <span className="button-spinner" /> : <ArrowUpRight size={16} />}</button></div>
            {contactStatus && <p className={`form-status form-status--${contactStatus.kind}`} role="status">{contactStatus.kind === 'success' && <Check size={16} />}{contactStatus.text}</p>}
          </form>
        </div>
      </section>
    </main>
    <Footer profile={currentProfile} />
    </>
  )
}