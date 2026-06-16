import React from 'react';
import { useNavigate } from 'react-router-dom';

// Two card styles as seen in the screenshot: "featured" (image top, centred) and "compact" (image left, text right)
function MyFlashcard({ flashcards }) {
  const navigate = useNavigate();

  if (flashcards.length === 0) {
    return (
      <div className="empty-state">
        <p>No flashcards yet. Create your first one!</p>
      </div>
    );
  }

  // First row: first 3 cards as "featured" style
  const featured = flashcards.slice(0, 3);
  // Remaining cards as "compact" style
  const compact = flashcards.slice(3);

  return (
    <div>
      {/* Featured row */}
      <div className="fc-featured-row">
        {featured.map((card) => (
          <div key={card.id} className="fc-featured-card">
            <div className="fc-featured-avatar">
              {card.groupImagePreview
                ? <img src={card.groupImagePreview} alt={card.group} className="fc-avatar-img" />
                : <div className="fc-avatar-placeholder" />}
            </div>
            <h3 className="fc-featured-title">{card.group}</h3>
            <p className="fc-featured-desc">{card.description || 'No description provided.'}</p>
            <p className="fc-featured-count">{card.terms.length} Card{card.terms.length !== 1 ? 's' : ''}</p>
            <button className="fc-view-btn outlined" onClick={() => navigate(`/flashcard/${card.id}`)}>
              View Cards
            </button>
          </div>
        ))}
      </div>

      {/* Compact row */}
      {compact.length > 0 && (
        <div className="fc-compact-row">
          {compact.map((card) => (
            <div key={card.id} className="fc-compact-card">
              <div className="fc-compact-header">
                <div className="fc-compact-avatar">
                  {card.groupImagePreview
                    ? <img src={card.groupImagePreview} alt={card.group} className="fc-avatar-img" />
                    : <div className="fc-avatar-placeholder compact" />}
                </div>
                <div>
                  <h3 className="fc-compact-title">{card.group}</h3>
                  <p className="fc-compact-count">{card.terms.length} Card{card.terms.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <p className="fc-compact-desc">{card.description || 'No description provided.'}</p>
              <button className="fc-view-btn text" onClick={() => navigate(`/flashcard/${card.id}`)}>
                View Cards →
              </button>
            </div>
          ))}
        </div>
      )}

      {flashcards.length > 3 && (
        <div style={{ textAlign: 'right', marginTop: 12 }}>
          <span className="fc-see-all">See all</span>
        </div>
      )}
    </div>
  );
}

export default MyFlashcard;
