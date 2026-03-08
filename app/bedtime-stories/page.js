'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function StoriesLibrary() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState(null);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    setLoading(true);
    
    // Try Supabase first
    try {
      const { data, error } = await supabase
        .from('ai_stories')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (data && !error) {
        // Transform Supabase data to match our format
        const formattedStories = data.map(story => ({
          id: story.id,
          childName: story.child_name,
          childAge: story.child_age,
          storyConcept: story.story_concept,
          title: story.story_title,
          content: story.story_content,
          createdAt: story.created_at,
        }));
        setStories(formattedStories);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.log('Supabase not available, using localStorage');
    }

    // Fallback to localStorage
    const savedStories = JSON.parse(localStorage.getItem('bedtimeStories') || '[]');
    setStories(savedStories);
    setLoading(false);
  };

  const deleteStory = async (id) => {
    if (confirm('Delete this story?')) {
      // Try to delete from Supabase
      try {
        await supabase.from('ai_stories').delete().eq('id', id);
      } catch (err) {
        console.log('Could not delete from Supabase');
      }

      // Always delete from localStorage
      const updated = stories.filter(s => s.id !== id);
      localStorage.setItem('bedtimeStories', JSON.stringify(updated));
      setStories(updated);
      if (selectedStory?.id === id) setSelectedStory(null);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      padding: '2rem',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    },
    card: {
      maxWidth: '1000px',
      margin: '0 auto',
    },
    header: {
      textAlign: 'center',
      marginBottom: '3rem',
      color: 'white',
    },
    title: {
      fontSize: '3rem',
      marginBottom: '0.5rem',
    },
    subtitle: {
      fontSize: '1.2rem',
      opacity: 0.9,
    },
    generateButton: {
      display: 'inline-block',
      marginTop: '1.5rem',
      padding: '1rem 2rem',
      fontSize: '1.1rem',
      fontWeight: '600',
      borderRadius: '1rem',
      border: 'none',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      cursor: 'pointer',
      boxShadow: '0 5px 15px rgba(102, 126, 234, 0.4)',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '1.5rem',
    },
    storyCard: {
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '1.5rem',
      padding: '1.5rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
    },
    storyCardTitle: {
      fontSize: '1.3rem',
      color: '#667eea',
      marginBottom: '0.75rem',
    },
    storyMeta: {
      fontSize: '0.9rem',
      color: '#666',
      marginBottom: '0.75rem',
    },
    storyPreview: {
      fontSize: '1rem',
      color: '#333',
      lineHeight: '1.6',
      display: '-webkit-box',
      WebkitLineClamp: 3,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      zIndex: 1000,
    },
    modalContent: {
      background: 'white',
      borderRadius: '2rem',
      padding: '3rem',
      maxWidth: '700px',
      maxHeight: '80vh',
      overflow: 'auto',
      position: 'relative',
    },
    closeButton: {
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      background: 'none',
      border: 'none',
      fontSize: '2rem',
      cursor: 'pointer',
      color: '#666',
    },
    modalTitle: {
      fontSize: '2rem',
      color: '#667eea',
      marginBottom: '1.5rem',
      textAlign: 'center',
    },
    modalMeta: {
      textAlign: 'center',
      color: '#666',
      marginBottom: '2rem',
      fontSize: '1rem',
    },
    modalStory: {
      fontSize: '1.2rem',
      lineHeight: '1.8',
      color: '#333',
      whiteSpace: 'pre-wrap',
    },
    loading: {
      textAlign: 'center',
      color: 'white',
      fontSize: '1.5rem',
      padding: '3rem',
    },
    empty: {
      textAlign: 'center',
      color: 'white',
      fontSize: '1.2rem',
      padding: '3rem',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '1rem',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>📚 Bedtime Stories Library</h1>
          <p style={styles.subtitle}>Magical stories created for Younis's friends! ✨</p>
          <a href="/bedtime-stories/generate">
            <button style={styles.generateButton}>
              🪄 Create Your Own Story
            </button>
          </a>
        </div>

        {loading ? (
          <div style={styles.loading}>Loading stories... 📖</div>
        ) : stories.length === 0 ? (
          <div style={styles.empty}>
            <p>No stories yet! Be the first to create one! 🌟</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {stories.map((story) => (
              <div
                key={story.id}
                style={styles.storyCard}
                onClick={() => setSelectedStory(story)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(102, 126, 234, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
                }}
              >
                <h3 style={styles.storyCardTitle}>{story.title || 'Untitled Story'}</h3>
                <div style={styles.storyMeta}>
                  <span>👶 {story.childName}</span>
                  <span style={{ margin: '0 0.5rem' }}>•</span>
                  <span>🎂 Age {story.childAge}</span>
                </div>
                <div style={styles.storyPreview}>{story.content}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedStory && (
        <div style={styles.modal} onClick={() => setSelectedStory(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button style={styles.closeButton} onClick={() => setSelectedStory(null)}>×</button>
            <h2 style={styles.modalTitle}>{selectedStory.title || 'Magical Story'}</h2>
            <div style={styles.modalMeta}>
              <span>✨ A story for {selectedStory.childName}</span>
              <span style={{ margin: '0 0.5rem' }}>•</span>
              <span>🎂 Age {selectedStory.childAge}</span>
              <span style={{ margin: '0 0.5rem' }}>•</span>
              <span>📅 {new Date(selectedStory.createdAt).toLocaleDateString()}</span>
            </div>
            <div style={styles.modalStory}>{selectedStory.content}</div>
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${selectedStory.title}\n\n${selectedStory.content}`);
                  alert('Story copied to clipboard! 📋');
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.75rem',
                  border: 'none',
                  background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                📋 Copy Story
              </button>
              <button
                onClick={() => deleteStory(selectedStory.id)}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.75rem',
                  border: 'none',
                  background: 'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
