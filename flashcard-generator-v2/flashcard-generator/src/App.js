import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import CreateFlashcard from './pages/CreateFlashcard';
import MyFlashcard from './pages/MyFlashcard';
import FlashcardDetail from './pages/FlashcardDetail';
import './styles/global.css';

// Shared state wrapper
function AppContent() {
  const [activeTab, setActiveTab] = useState('create');
  const [flashcards, setFlashcards] = useState([
    // Seed data so My Flashcard page isn't empty
    {
      id: 1,
      group: 'Web 3',
      description: 'Take a tour of our Full Stack Data Science Course to learn about curriculum...',
      groupImagePreview: null,
      terms: [
        { term: 'Loream Ipsum', definition: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt...', imagePreview: null },
        { term: 'Card 2', definition: 'Definition for Card 2', imagePreview: null },
        { term: 'Card 3', definition: 'Definition for Card 3', imagePreview: null },
      ],
    },
    {
      id: 2,
      group: 'Group 2',
      description: 'Take a tour of our Full Stack Data Science Course to learn about curriculum...',
      groupImagePreview: null,
      terms: [
        { term: 'Term A', definition: 'Definition A', imagePreview: null },
        { term: 'Term B', definition: 'Definition B', imagePreview: null },
      ],
    },
    {
      id: 3,
      group: 'Group 3',
      description: 'Take a tour of our Full Stack Data Science Course to learn about curriculum...',
      groupImagePreview: null,
      terms: [{ term: 'Term 1', definition: 'Definition 1', imagePreview: null }],
    },
  ]);

  const handleFlashcardCreated = (card) => {
    setFlashcards((prev) => [card, ...prev]);
    setActiveTab('my');
  };

  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <div className="page-container">
              <h1 className="page-title">Create Flashcard</h1>
              <div className="tabs">
                <button className={`tab-btn ${activeTab === 'create' ? 'active' : ''}`} onClick={() => setActiveTab('create')}>
                  Create New
                </button>
                <button className={`tab-btn ${activeTab === 'my' ? 'active' : ''}`} onClick={() => setActiveTab('my')}>
                  My Flashcard
                </button>
              </div>
              {activeTab === 'create' ? (
                <CreateFlashcard onFlashcardCreated={handleFlashcardCreated} />
              ) : (
                <MyFlashcard flashcards={flashcards} />
              )}
            </div>
          }
        />
        <Route
          path="/flashcard/:id"
          element={<FlashcardDetail flashcards={flashcards} />}
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
