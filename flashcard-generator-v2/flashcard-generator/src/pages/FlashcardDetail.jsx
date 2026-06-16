import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// ── Icons ────────────────────────────────────────────────────────────────────
const ShareIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" />
  </svg>
);
const DownloadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);
const PrintIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" /><rect x="6" y="14" width="12" height="8" />
  </svg>
);
const CopyIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </svg>
);
const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ── Share Modal ──────────────────────────────────────────────────────────────
function ShareModal({ onClose, cardId }) {
  const shareUrl = `${window.location.origin}/flashcard/${cardId}`;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const socials = [
    { name: 'Facebook', color: '#1877F2', icon: 'f', href: `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
    { name: 'LinkedIn', color: '#0A66C2', icon: 'in', href: `https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}` },
    { name: 'WhatsApp', color: '#25D366', icon: 'W', href: `https://wa.me/?text=${encodeURIComponent(shareUrl)}` },
    { name: 'Twitter', color: '#1DA1F2', icon: 't', href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}` },
    { name: 'Email', color: '#888', icon: '✉', href: `mailto:?body=${encodeURIComponent(shareUrl)}` },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Share</span>
          <button className="modal-close" onClick={onClose}><CloseIcon /></button>
        </div>

        <div className="modal-link-row">
          <span className="modal-link-label">Link:</span>
          <span className="modal-link-url">{shareUrl}</span>
          <button className="modal-copy-btn" onClick={handleCopy} title="Copy link">
            <CopyIcon />
          </button>
          {copied && <span className="modal-copied">Copied!</span>}
        </div>

        <div className="modal-socials">
          {socials.map((s) => (
            <a key={s.name} href={s.href} target="_blank" rel="noreferrer" className="social-circle" style={{ background: s.color }} title={s.name}>
              {s.icon}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
function FlashcardDetail({ flashcards }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const card = flashcards.find((c) => String(c.id) === id);

  const [activeIndex, setActiveIndex] = useState(0);
  const [showShare, setShowShare] = useState(false);
  const printRef = useRef(null);

  if (!card) {
    return (
      <div className="page-container">
        <p>Flashcard not found. <button className="fc-back-link" onClick={() => navigate('/')}>Go back</button></p>
      </div>
    );
  }

  const total = card.terms.length;
  const activeTerm = card.terms[activeIndex];

  const goTo = (idx) => {
    if (idx >= 0 && idx < total) setActiveIndex(idx);
  };

  // ── Print / Download as HTML page ──
  const handlePrint = () => {
    const printContent = `
      <html>
        <head>
          <title>${card.group} Flashcards</title>
          <style>
            body { font-family: sans-serif; padding: 32px; color: #1a1a1a; }
            h1 { font-size: 24px; margin-bottom: 4px; }
            .desc { color: #666; margin-bottom: 24px; font-size: 14px; }
            .term-card { border: 1px solid #ddd; border-radius: 8px; padding: 16px; margin-bottom: 16px; display: flex; gap: 16px; align-items: flex-start; }
            .term-num { font-weight: 700; color: #c0392b; min-width: 24px; }
            .term-title { font-weight: 700; margin-bottom: 6px; font-size: 15px; }
            .term-def { font-size: 14px; color: #444; line-height: 1.6; }
            img { width: 100px; height: 80px; object-fit: cover; border-radius: 6px; }
          </style>
        </head>
        <body>
          <h1>${card.group}</h1>
          <p class="desc">${card.description || ''}</p>
          ${card.terms.map((t, i) => `
            <div class="term-card">
              <div class="term-num">${i + 1}</div>
              <div style="flex:1">
                <div class="term-title">${t.term}</div>
                <div class="term-def">${t.definition}</div>
              </div>
              ${t.imagePreview ? `<img src="${t.imagePreview}" alt="${t.term}" />` : ''}
            </div>
          `).join('')}
        </body>
      </html>
    `;
    const w = window.open('', '_blank');
    w.document.write(printContent);
    w.document.close();
    w.focus();
    w.print();
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="detail-header">
        <div className="detail-tabs tabs" style={{ marginBottom: 0 }}>
          <button className="tab-btn active">Create New</button>
          <button className="tab-btn" onClick={() => navigate('/')}>My Flashcard</button>
        </div>
      </div>

      {/* Title row */}
      <div className="detail-title-row">
        <button className="fc-back-link" onClick={() => navigate('/')} aria-label="Back">
          ← 
        </button>
        <h2 className="detail-group-title">{card.group}</h2>
      </div>
      {card.description && <p className="detail-group-desc">{card.description}</p>}

      {/* 3-column layout */}
      <div className="detail-layout">
        {/* Left: Term list */}
        <aside className="detail-sidebar">
          <p className="sidebar-label">Flashcards</p>
          {card.terms.map((t, i) => (
            <button
              key={i}
              className={`sidebar-term-btn ${i === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(i)}
            >
              {t.term}
            </button>
          ))}
        </aside>

        {/* Centre: Term detail card */}
        <div className="detail-centre">
          <div className="term-detail-card">
            {activeTerm.imagePreview && (
              <img src={activeTerm.imagePreview} alt={activeTerm.term} className="term-detail-img" />
            )}
            <p className="term-detail-def">{activeTerm.definition}</p>
          </div>

          {/* Carousel navigation */}
          <div className="carousel-nav">
            <button className="carousel-btn" onClick={() => goTo(activeIndex - 1)} disabled={activeIndex === 0}>‹</button>
            <span className="carousel-counter">{activeIndex + 1}/{total}</span>
            <button className="carousel-btn" onClick={() => goTo(activeIndex + 1)} disabled={activeIndex === total - 1}>›</button>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="detail-actions">
          <button className="action-btn" onClick={() => setShowShare(true)}>
            <ShareIcon /> Share
          </button>
          <button className="action-btn" onClick={handlePrint}>
            <DownloadIcon /> Download
          </button>
          <button className="action-btn" onClick={handlePrint}>
            <PrintIcon /> Print
          </button>
        </div>
      </div>

      {/* Share Modal */}
      {showShare && <ShareModal onClose={() => setShowShare(false)} cardId={card.id} />}
    </div>
  );
}

export default FlashcardDetail;
