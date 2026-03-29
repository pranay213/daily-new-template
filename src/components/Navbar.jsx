import { Link } from 'react-router-dom';
import { Moon, Sun, Monitor, Palette } from 'lucide-react';
import { useTheme } from './ThemeContext';

export default function Navbar() {
  const { theme, toggleTheme, preset, setPreset } = useTheme();

  const presets = [
    { id: 'violet', color: '#8b5cf6' },
    { id: 'blue', color: '#3b82f6' },
    { id: 'emerald', color: '#10b981' },
    { id: 'rose', color: '#f43f5e' },
  ];

  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        <Monitor size={24} />
        Daily Templates
      </Link>
      
      <div className="nav-actions">
        {/* Color Presets */}
        <div style={{ display: 'flex', gap: '0.5rem', marginRight: '1rem', alignItems: 'center' }}>
          <Palette size={18} style={{ color: 'var(--text-secondary)' }} />
          {presets.map(p => (
            <button
              key={p.id}
              onClick={() => setPreset(p.id)}
              style={{
                width: '1.5rem',
                height: '1.5rem',
                borderRadius: '50%',
                backgroundColor: p.color,
                border: preset === p.id ? '2px solid var(--text-primary)' : '2px solid transparent',
                padding: 0
              }}
              title={`Switch to ${p.id} theme`}
            />
          ))}
        </div>

        {/* Theme Toggle */}
        <button onClick={toggleTheme} title="Toggle dark mode">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Github Link */}
        <a href="https://github.com/pranay/daily-html-template" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', padding: '0.5rem', color: 'var(--text-secondary)', transition: 'var(--transition)' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
        </a>
      </div>
    </nav>
  );
}
