import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { templates } from '../data/templates';
import { ArrowLeft, Check, Copy, Code, Layout, ExternalLink } from 'lucide-react';
import { useTheme } from '../components/ThemeContext';
import './TemplateView.css';

export default function TemplateView() {
  const { id } = useParams();
  const { theme, preset } = useTheme();
  const [template, setTemplate] = useState(null);
  const [htmlContent, setHtmlContent] = useState('');
  const [viewMode, setViewMode] = useState('preview'); // 'preview' | 'code'
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const found = templates.find(t => t.id === id);
    setTemplate(found);
    
    if (found) {
      // Fetch the actual HTML content
      fetch(found.fileUrl)
        .then(res => {
          if (!res.ok) throw new Error('Failed to load template');
          return res.text();
        })
        .then(html => {
          setHtmlContent(html);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setHtmlContent('<!-- Template not found or still generating -->\n<div style="padding:2rem;text-align:center;font-family:sans-serif;">\n  <h2>Template Generating...</h2>\n  <p>Check back later once Ollama completes the daily generation.</p>\n</div>');
          setLoading(false);
        });
    }
  }, [id]);

  const handleCopy = () => {
    navigator.clipboard.writeText(htmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!template) {
    return (
      <div className="not-found">
        <h2>Template not found</h2>
        <Link to="/" className="btn btn-primary">Go Home</Link>
      </div>
    );
  }

  // Inject current theme and preset into iframe content for live previewing
  const previewHtml = htmlContent.replace(
    '</head>',
    `  <script>
        document.documentElement.setAttribute('data-theme', '${theme}');
        document.documentElement.setAttribute('data-preset', '${preset}');
      </script>
    </head>`
  );

  return (
    <div className="template-view-container">
      <header className="view-header">
        <div className="header-left">
          <Link to="/" className="btn btn-outline btn-icon" title="Back to Templates">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="view-title">{template.title}</h1>
            <span className="view-meta">{template.category} • {template.dateAdded}</span>
          </div>
        </div>
        <div className="header-actions">
          <div className="view-toggles">
            <button 
              className={`toggle-btn ${viewMode === 'preview' ? 'active' : ''}`}
              onClick={() => setViewMode('preview')}
            >
              <Layout size={16} /> Preview
            </button>
            <button 
              className={`toggle-btn ${viewMode === 'code' ? 'active' : ''}`}
              onClick={() => setViewMode('code')}
            >
              <Code size={16} /> Code
            </button>
          </div>
          <button className="btn btn-primary btn-copy" onClick={handleCopy}>
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>
      </header>

      <main className="view-content">
        {loading ? (
          <div className="loading-state">Loading template...</div>
        ) : viewMode === 'preview' ? (
          <div className="preview-container">
            <iframe 
              srcDoc={previewHtml} 
              title={template.title}
              className="preview-iframe"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        ) : (
          <div className="code-container">
            <pre className="code-block">
              <code>{htmlContent}</code>
            </pre>
          </div>
        )}
      </main>
    </div>
  );
}
