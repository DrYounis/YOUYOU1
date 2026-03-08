'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function StoryGenerator() {
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [storyConcept, setStoryConcept] = useState('');
  const [generating, setGenerating] = useState(false);
  const [story, setStory] = useState(null);
  const [error, setError] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();

    if (!childName || !childAge || !storyConcept) {
      setError('Please fill in all fields');
      return;
    }

    setError('');
    setGenerating(true);
    setStory(null);

    try {
      console.log('📖 Sending story request...');
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childName,
          childAge: parseInt(childAge),
          storyConcept,
        }),
      });

      console.log('📡 Response status:', response.status);
      const data = await response.json();
      console.log('📦 Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      if (data.error) {
        setError(data.error);
        setGenerating(false);
        return;
      }

      // Save to Supabase (with localStorage fallback)
      await saveStory(childName, parseInt(childAge), storyConcept, data.title, data.content);

      setStory(data);
    } catch (err) {
      console.error('❌ Story generation error:', err);
      setError(err.message || 'Something went wrong. Please try again!');
    } finally {
      setGenerating(false);
    }
  };

  const saveStory = async (childName, childAge, storyConcept, title, content) => {
    // Try Supabase first
    try {
      const { error } = await supabase
        .from('ai_stories')
        .insert([{
          child_name: childName,
          child_age: childAge,
          story_concept: storyConcept,
          story_title: title,
          story_content: content,
          is_public: true,
        }]);

      if (!error) {
        console.log('✅ Story saved to Supabase!');
        return;
      }
    } catch (err) {
      console.log('Supabase not available, using localStorage');
    }

    // Fallback to localStorage
    const savedStories = JSON.parse(localStorage.getItem('bedtimeStories') || '[]');
    const newStory = {
      id: Date.now().toString(),
      childName,
      childAge,
      storyConcept,
      title,
      content,
      createdAt: new Date().toISOString(),
    };
    savedStories.unshift(newStory);
    localStorage.setItem('bedtimeStories', JSON.stringify(savedStories));
    console.log('✅ Story saved to localStorage!');
  };

  const styles = {
    container: {
      minHeight: '100vh',
      padding: '2rem',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    },
    card: {
      maxWidth: '800px',
      margin: '0 auto',
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '2rem',
      padding: '3rem',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
    },
    header: {
      textAlign: 'center',
      marginBottom: '2rem',
    },
    title: {
      fontSize: '2.5rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '0.5rem',
    },
    subtitle: {
      fontSize: '1.2rem',
      color: '#666',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    },
    label: {
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#333',
    },
    input: {
      padding: '1rem',
      borderRadius: '0.75rem',
      border: '2px solid #e0e0e0',
      fontSize: '1rem',
      transition: 'border-color 0.3s ease',
    },
    textarea: {
      padding: '1rem',
      borderRadius: '0.75rem',
      border: '2px solid #e0e0e0',
      fontSize: '1rem',
      minHeight: '120px',
      resize: 'vertical',
      fontFamily: 'inherit',
    },
    button: {
      padding: '1.25rem 2rem',
      fontSize: '1.2rem',
      fontWeight: '700',
      borderRadius: '1rem',
      border: 'none',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 5px 15px rgba(102, 126, 234, 0.4)',
    },
    storyCard: {
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      borderRadius: '1.5rem',
      padding: '2rem',
      marginTop: '2rem',
      animation: 'fadeIn 0.8s ease',
    },
    storyTitle: {
      fontSize: '2rem',
      color: '#667eea',
      marginBottom: '1.5rem',
      textAlign: 'center',
    },
    storyContent: {
      fontSize: '1.2rem',
      lineHeight: '1.8',
      color: '#333',
      whiteSpace: 'pre-wrap',
    },
    error: {
      background: '#fee',
      color: '#c00',
      padding: '1rem',
      borderRadius: '0.75rem',
      marginBottom: '1rem',
    },
    loading: {
      textAlign: 'center',
      padding: '3rem',
    },
    loadingText: {
      fontSize: '1.5rem',
      color: '#667eea',
      marginTop: '1rem',
    },
  };

  return (
    <div style={styles.container}>
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>🌙 AI Bedtime Story Generator</h1>
          <p style={styles.subtitle}>Create a magical personalized story powered by AI! ✨</p>
          <p style={{ fontSize: '0.85rem', color: '#888', marginTop: '0.5rem' }}>
            🤖 Powered by AI • Each story is unique and generated just for you!
          </p>
        </div>

        {!story ? (
          <form onSubmit={handleGenerate} style={styles.form}>
            {error && <div style={styles.error}>⚠️ {error}</div>}

            <div style={styles.inputGroup}>
              <label style={styles.label}>👶 Child's Name</label>
              <input
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="e.g., Younis"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>🎂 Age</label>
              <input
                type="number"
                value={childAge}
                onChange={(e) => setChildAge(e.target.value)}
                placeholder="e.g., 7"
                min="3"
                max="12"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>📖 Story Concept/Theme</label>
              <textarea
                value={storyConcept}
                onChange={(e) => setStoryConcept(e.target.value)}
                placeholder="e.g., A brave astronaut exploring the moon, or A magical forest where animals can talk..."
                style={styles.textarea}
                required
              />
            </div>

            <button
              type="submit"
              disabled={generating}
              style={{
                ...styles.button,
                opacity: generating ? 0.7 : 1,
                cursor: generating ? 'not-allowed' : 'pointer',
              }}
            >
              {generating ? '🪄 Creating Magic...' : '✨ Generate Story'}
            </button>
          </form>
        ) : (
          <div>
            <div style={styles.storyCard}>
              <h2 style={styles.storyTitle}>{story.title}</h2>
              <div style={styles.storyContent}>{story.content}</div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={() => {
                  setStory(null);
                  setChildName('');
                  setChildAge('');
                  setStoryConcept('');
                }}
                style={{
                  ...styles.button,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                📝 Create Another Story
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${story.title}\n\n${story.content}`);
                  alert('Story copied to clipboard! 📋');
                }}
                style={{
                  ...styles.button,
                  background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                }}
              >
                📋 Copy Story
              </button>
            </div>
          </div>
        )}

        {generating && (
          <div style={styles.loading}>
            <div style={{ fontSize: '4rem' }}>🪄✨🌙</div>
            <p style={styles.loadingText}>AI is creating a magical story for {childName}...</p>
            <p style={{ fontSize: '1rem', color: '#888', marginTop: '0.5rem' }}>This takes about 5-10 seconds 🚀</p>
          </div>
        )}
      </div>
    </div>
  );
}
