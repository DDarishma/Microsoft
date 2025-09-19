import React, { useState } from 'react';

function App() {
  const [question, setQuestion] = useState('');
  const [reports, setReports] = useState([
    {
      id: 1,
      question: 'What is Math?',
      answer: 'Mathematics is the study of numbers, quantities, shapes, and patterns. It is used for solving problems and understanding the world logically.'
    },
    {
      id: 2,
      question: 'What is Physics?',
      answer: 'Physics is the natural science that studies matter, energy, and the fundamental forces of nature. It explains how things move and interact in the universe.'
    }
  ]);
  const [creditsUsed, setCreditsUsed] = useState(2); // already used 2 for default reports
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);

    try {
      // ✅ point to port 5000
      const response = await fetch('http://localhost:5000/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      });

      const data = await response.json();

      const newReport = {
        id: reports.length + 1,
        question,
        answer: data.answer || 'No answer received'
      };

      setReports([newReport, ...reports]);
      setCreditsUsed(prev => prev + 1);
      setQuestion('');
    } catch (error) {
      console.error('Fetch error:', error);
      alert('Error fetching answer. Check console.');
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      <h2 style={{ color: '#333' }}>🧠 Smart Research Assistant</h2>
      <p>Get reliable answers with citations. Ask multiple questions and track your usage.</p>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <input
          type="text"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="Type your question here..."
          style={{
            flex: 1,
            padding: '0.75rem',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '1rem'
          }}
          onKeyDown={e => e.key === 'Enter' && handleAsk()}
        />
        <button
          onClick={handleAsk}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#6c63ff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
          disabled={loading}
        >
          {loading ? 'Fetching...' : 'Ask'}
        </button>
      </div>

      <h3 style={{ marginTop: '2rem', color: '#444' }}>📚 My Research Reports</h3>
      {reports.length === 0 ? (
        <p>No questions asked yet.</p>
      ) : (
        reports.map(report => (
          <div
            key={report.id}
            style={{
              backgroundColor: '#fff',
              padding: '1rem',
              marginBottom: '1rem',
              borderRadius: '8px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
            }}
          >
            <strong>Q{report.id}: {report.question}</strong>
            <pre style={{ whiteSpace: 'pre-wrap', marginTop: '0.5rem', fontSize: '0.95rem' }}>
              {report.answer}
            </pre>
          </div>
        ))
      )}

      <p style={{ fontWeight: 'bold', marginTop: '2rem' }}>
        {creditsUsed} reports generated → {creditsUsed} credits used
      </p>
    </div>
  );
}

export default App;
