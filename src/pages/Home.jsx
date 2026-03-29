import { Link } from 'react-router-dom';
import { templates } from '../data/templates';
import { Calendar, LayoutTemplate } from 'lucide-react';
import './Home.css';

export default function Home() {
  return (
    <div className="home-container">
      <header className="hero-section">
        <h1>Daily HTML Templates</h1>
        <p>A fresh stunning HTML template generated daily using Ollama AI. Open source, responsive, and ready to use.</p>
        <div className="stats">
          <div className="stat">
            <LayoutTemplate size={20} className="stat-icon" />
            <span>{templates.length} Templates</span>
          </div>
          <div className="stat">
            <Calendar size={20} className="stat-icon" />
            <span>Updated Daily</span>
          </div>
        </div>
      </header>

      <section className="grid-section">
        <h2 className="section-title">Latest Templates</h2>
        <div className="template-grid">
          {templates.map(template => (
            <Link to={`/template/${template.id}`} key={template.id} className="template-card">
              <div className="card-image-wrap">
                <img src={template.thumbnail} alt={template.title} className="card-image" />
                <div className="card-overlay">
                  <span className="btn btn-primary">Preview Template</span>
                </div>
              </div>
              <div className="card-body">
                <div className="card-header">
                  <span className="category-badge">{template.category}</span>
                  <span className="date-badge">{template.dateAdded}</span>
                </div>
                <h3 className="card-title">{template.title}</h3>
                <p className="card-desc">{template.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
