import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Menu, Moon, Sun, X } from 'lucide-react'

const navItems = ['About', 'Skills', 'Projects', 'Coding', 'Education', 'Experience', 'Achievements', 'Resume', 'Contact']

export default function SiteHeader({ theme, onToggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false)

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <header className="site-header">
      <a className="wordmark" href="#home" onClick={closeMenu} aria-label="Ansh Mani, home">
        <span className="wordmark-mark">AM</span><span>Ansh Mani<span className="wordmark-dot">.</span></span>
      </a>
      <nav className={`nav-links${menuOpen ? ' nav-links--open' : ''}`} aria-label="Main navigation">
        {navItems.map((item) => <a key={item} href={`#${item.toLowerCase()}`} onClick={closeMenu}>{item}</a>)}
        <Link to="/admin" className="nav-admin" onClick={closeMenu}>Admin <ArrowUpRight size={14} /></Link>
      </nav>
      <div className="header-actions">
        <button className="icon-button theme-button" onClick={onToggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} title="Toggle theme">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button className="icon-button menu-button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </header>
  )
}