import { ArrowUpRight, ArrowUp } from 'lucide-react'
import { profile as initialProfile } from '../data/portfolio'

const currentYear = new Date().getFullYear()

export default function Footer({ profile = initialProfile }) {
  return (
    <footer className="site-footer">
      <a className="wordmark footer-wordmark" href="#home"><span className="wordmark-mark">AM</span><span>Ansh Mani<span className="wordmark-dot">.</span></span></a>
      <p>Learning by building. Building with intent.</p>
      <div className="footer-links">
        <a href={profile.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} /></a>
        <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={14} /></a>
        <a href={`mailto:${profile.email}`}>Email <ArrowUpRight size={14} /></a>
        <a href="#home" aria-label="Back to top"><ArrowUp size={16} /></a>
      </div>
      <span className="copyright">© {currentYear} Ansh Mani</span>
    </footer>
  )
}