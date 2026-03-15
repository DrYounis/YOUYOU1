'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function EidSongGenerator() {
  const [childName, setChildName] = useState('');
  const [language, setLanguage] = useState('ar');
  const [isLoading, setIsLoading] = useState(false);
  const [song, setSong] = useState(null);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const audioRef = useRef(null);
  const synthRef = useRef(null);
  
  // Save feature states
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [parentName, setParentName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);
  const [savedSongs, setSavedSongs] = useState([]);
  const [showSavedSongs, setShowSavedSongs] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const generateSong = async (e) => {
    e.preventDefault();
    if (!childName.trim()) {
      setError('الرجاء إدخال اسم الطفل');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSong(null);

    try {
      const response = await fetch('/api/generate-eid-song', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ childName: childName.trim(), language }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'فشل في إنشاء الأغنية');
      }

      setSong(data);
    } catch (err) {
      console.error('Error generating song:', err);
      setError('حدث خطأ أثناء إنشاء الأغنية. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    if (song) {
      const text = `${song.title}\n\n${song.lyrics}`;
      navigator.clipboard.writeText(text);
    }
  };

  const generateAudio = async () => {
    if (!song) return;
    
    setIsGeneratingAudio(true);
    
    try {
      // Clean lyrics for TTS (remove emojis)
      const cleanLyrics = song.lyrics
        .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]/gu, '')
        .replace(/🎵/g, '')
        .replace(/✨/g, '')
        .replace(/🌙/g, '')
        .replace(/🍬/g, '')
        .replace(/🏠/g, '')
        .replace(/💰/g, '')
        .replace(/🎉/g, '');
      
      // Split into lines and filter empty ones
      const lines = cleanLyrics.split('\n').filter(line => line.trim().length > 0 && line.trim().length < 200);
      
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      
      // Play lines sequentially for better quality
      for (const line of lines) {
        if (!audioRef.current) break;
        
        const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ar&client=tw-ob&q=${encodeURIComponent(line.trim())}`;
        audioRef.current = new Audio(ttsUrl);
        
        await new Promise((resolve) => {
          audioRef.current.onended = resolve;
          audioRef.current.onerror = resolve;
          audioRef.current.play().catch(resolve);
        });
        
        // Small pause between lines
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      setIsPlaying(false);
    } catch (err) {
      console.error('Audio generation error:', err);
      // Fallback to browser TTS
      if ('speechSynthesis' in window) {
        synthRef.current = window.speechSynthesis;
        synthRef.current.cancel();
        const cleanLyrics = song.lyrics.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]/gu, '');
        const utterance = new SpeechSynthesisUtterance(cleanLyrics.substring(0, 500));
        utterance.lang = 'ar-SA';
        utterance.rate = 0.85;
        const voices = synthRef.current.getVoices();
        const arabicVoice = voices.find(v => v.lang.includes('ar'));
        if (arabicVoice) utterance.voice = arabicVoice;
        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        synthRef.current.speak(utterance);
      }
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsPlaying(false);
  };

  // Save song function
  const saveSong = async (e) => {
    e.preventDefault();
    
    if (!parentName || !parentEmail || !childName || !song) {
      setSaveMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const response = await fetch('/api/save-eid-song', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentName,
          parentEmail,
          parentPhone,
          childName,
          songTitle: song.title,
          songLyrics: song.lyrics,
          language
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save song');
      }

      setSaveMessage({ type: 'success', text: '✅ Song saved successfully! You can access it anytime.' });
      
      // Clear form after successful save
      setTimeout(() => {
        setShowSaveModal(false);
        setSaveMessage(null);
      }, 2000);
    } catch (err) {
      console.error('Save error:', err);
      setSaveMessage({ type: 'error', text: 'Failed to save. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  // Load user's saved songs
  const loadSavedSongs = async () => {
    if (!userEmail) {
      setError('Please enter your email');
      return;
    }

    try {
      const response = await fetch(`/api/save-eid-song?email=${encodeURIComponent(userEmail)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load songs');
      }

      setSavedSongs(data.songs || []);
      setShowSavedSongs(true);
    } catch (err) {
      console.error('Load error:', err);
      setError('Failed to load saved songs');
    }
  };

  // Delete a saved song
  const deleteSong = async (songId) => {
    if (!confirm('Are you sure you want to delete this song?')) return;

    try {
      // Note: You may want to add a DELETE endpoint to the API
      // For now, we'll just remove it from the local state
      setSavedSongs(savedSongs.filter(s => s.id !== songId));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const styles = {
    container: {
      minHeight: '100vh',
      padding: '2rem',
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      fontFamily: '"Comic Sans MS", "Chalkboard SE", Arial, sans-serif',
    },
    wrapper: {
      maxWidth: '900px',
      margin: '0 auto',
    },
    header: {
      textAlign: 'center',
      marginBottom: '2rem',
    },
    title: {
      fontSize: '3rem',
      color: 'white',
      textShadow: '3px 3px 0px #c0392b',
      marginBottom: '0.5rem',
    },
    subtitle: {
      fontSize: '1.3rem',
      color: 'rgba(255, 255, 255, 0.95)',
    },
    homeButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      padding: '12px 24px',
      background: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '50px',
      color: 'white',
      textDecoration: 'none',
      fontWeight: 'bold',
      fontSize: '16px',
      backdropFilter: 'blur(10px)',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      transition: 'all 0.3s ease',
      marginBottom: '2rem',
    },
    card: {
      background: 'white',
      borderRadius: '25px',
      padding: '2.5rem',
      boxShadow: '0 15px 50px rgba(0,0,0,0.25)',
      marginBottom: '2rem',
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
      fontSize: '1.2rem',
      fontWeight: 'bold',
      color: '#333',
    },
    input: {
      padding: '15px 20px',
      fontSize: '1.1rem',
      border: '3px solid #f093fb',
      borderRadius: '15px',
      outline: 'none',
      transition: 'border-color 0.3s ease',
    },
    select: {
      padding: '15px 20px',
      fontSize: '1.1rem',
      border: '3px solid #f093fb',
      borderRadius: '15px',
      outline: 'none',
      background: 'white',
      cursor: 'pointer',
    },
    button: {
      padding: '18px 30px',
      fontSize: '1.3rem',
      fontWeight: 'bold',
      color: 'white',
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      border: 'none',
      borderRadius: '50px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 5px 20px rgba(240, 147, 251, 0.4)',
    },
    error: {
      background: '#ffe6e6',
      color: '#d63031',
      padding: '15px 20px',
      borderRadius: '15px',
      fontSize: '1.1rem',
      border: '2px solid #ff7675',
    },
    songCard: {
      background: 'white',
      borderRadius: '25px',
      padding: '2.5rem',
      boxShadow: '0 15px 50px rgba(0,0,0,0.25)',
      marginBottom: '2rem',
      border: '4px solid #f5576c',
    },
    songTitle: {
      fontSize: '2.2rem',
      color: '#f5576c',
      textAlign: 'center',
      marginBottom: '1.5rem',
      fontWeight: 'bold',
    },
    songLyrics: {
      fontSize: '1.3rem',
      lineHeight: '2',
      color: '#333',
      whiteSpace: 'pre-wrap',
      background: 'linear-gradient(135deg, #fff5f5 0%, #ffe6e6 100%)',
      padding: '2rem',
      borderRadius: '20px',
      border: '2px dashed #f093fb',
      fontFamily: '"Comic Sans MS", "Chalkboard SE", Arial, sans-serif',
    },
    actionButtons: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
      marginTop: '1.5rem',
      flexWrap: 'wrap',
    },
    actionButton: {
      padding: '12px 24px',
      fontSize: '1.1rem',
      fontWeight: 'bold',
      border: 'none',
      borderRadius: '50px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    printButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
    },
    copyButton: {
      background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      color: 'white',
    },
    newSongButton: {
      background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      color: 'white',
    },
    loading: {
      textAlign: 'center',
      padding: '3rem',
    },
    loadingText: {
      fontSize: '1.5rem',
      color: 'white',
      marginTop: '1rem',
    },
    moonDecoration: {
      fontSize: '4rem',
      marginBottom: '1rem',
    },
    infoBox: {
      background: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '15px',
      padding: '1.5rem',
      marginBottom: '2rem',
      textAlign: 'center',
    },
    infoText: {
      color: 'white',
      fontSize: '1.1rem',
      lineHeight: '1.6',
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '1rem',
    },
    modal: {
      background: 'white',
      borderRadius: '25px',
      padding: '2.5rem',
      maxWidth: '500px',
      width: '100%',
      maxHeight: '90vh',
      overflow: 'auto',
      position: 'relative',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    },
    closeButton: {
      position: 'absolute',
      top: '15px',
      right: '15px',
      background: 'rgba(240, 147, 251, 0.2)',
      border: 'none',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      fontSize: '1.5rem',
      cursor: 'pointer',
      color: '#f5576c',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease',
    },
    modalTitle: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#333',
      textAlign: 'center',
      marginBottom: '0.5rem',
    },
    modalSubtitle: {
      fontSize: '1rem',
      color: '#666',
      textAlign: 'center',
      marginBottom: '2rem',
    },
    saveMessage: {
      padding: '15px 20px',
      borderRadius: '15px',
      fontSize: '1rem',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    savedSongsEmpty: {
      textAlign: 'center',
      padding: '2rem',
    },
    savedSongsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      maxHeight: '500px',
      overflow: 'auto',
    },
    savedSongCard: {
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      borderRadius: '15px',
      padding: '1.5rem',
      border: '2px solid #667eea',
    },
    savedSongTitle: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '0.5rem',
    },
    savedSongInfo: {
      fontSize: '0.95rem',
      color: '#666',
      marginBottom: '1rem',
    },
    savedSongActions: {
      display: 'flex',
      gap: '0.5rem',
    },
    smallButton: {
      padding: '8px 16px',
      fontSize: '0.95rem',
      fontWeight: 'bold',
      color: 'white',
      border: 'none',
      borderRadius: '20px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
  };

  return (
    <div style={styles.container}>
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        .loading-dots span {
          animation: pulse 1.5s infinite;
        }
        .loading-dots span:nth-child(2) {
          animation-delay: 0.2s;
        }
        .loading-dots span:nth-child(3) {
          animation-delay: 0.4s;
        }
        @media print {
          body * {
            visibility: hidden;
          }
          #song-content, #song-content * {
            visibility: visible;
          }
          #song-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white;
            padding: 2rem;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div style={styles.wrapper}>
        {/* Home Button */}
        <div style={{ textAlign: 'center' }} className="no-print">
          <Link
            href="/fun-zone"
            style={styles.homeButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            🏠 Back to Fun Zone
          </Link>
        </div>

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.moonDecoration}>🌙 ✨ 🎵</div>
          <h1 style={styles.title}>🎉 مولد أغاني العيد 🎉</h1>
          <p style={styles.subtitle}>أنشئ أغنية خليجية احتفالية لعيد الفطر باسم طفلك! ✨</p>
        </div>

        {/* Info Box */}
        <div style={styles.infoBox} className="no-print">
          <p style={styles.infoText}>
            🎵 أدخل اسم طفلك وسنقوم بإنشاء أغنية عيد فطر خليجية احتفالية خاصة به!<br/>
            🌙 الأغنية ستكون باللهجة الخليجية ومرحة ومناسبة للأطفال<br/>
            ✨ يمكنك طباعة الأغنية أو نسخها لمشاركتها<br/>
            🔊 <strong>جديد!</strong> استمع للأغنية بصوت آلي مجاني!
          </p>
        </div>

        {/* Form */}
        {!song && (
          <div style={styles.card} className="no-print">
            <form onSubmit={generateSong} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>👦 اسم الطفل:</label>
                <input
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder="مثال: سند، محمد، فاطمة..."
                  style={styles.input}
                  dir="rtl"
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>🌐 اللغة:</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  style={styles.select}
                >
                  <option value="ar">🇸🇦 العربية (خليجي)</option>
                  <option value="en">🇬🇧 English</option>
                </select>
              </div>

              {error && <div style={styles.error}>{error}</div>}

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  ...styles.button,
                  opacity: isLoading ? 0.7 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                }}
              >
                {isLoading ? (
                  <span className="loading-dots">
                    جاري الإنشاء<span>.</span><span>.</span><span>.</span>
                  </span>
                ) : (
                  '🎵 أنشئ أغنية العيد'
                )}
              </button>
            </form>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div style={styles.loading}>
            <div style={styles.moonDecoration}>🌙</div>
            <p style={styles.loadingText}>جاري إنشاء الأغنية الاحتفالية...</p>
            <p style={{...styles.loadingText, fontSize: '1.2rem', opacity: 0.8}}>
              ✨ جاري كتابة كلمات العيد باسم طفلك...
            </p>
          </div>
        )}

        {/* Song Display */}
        {song && (
          <div id="song-content">
            <div style={styles.songCard}>
              <h2 style={styles.songTitle}>{song.title}</h2>
              <div style={styles.songLyrics}>{song.lyrics}</div>
              
              <div style={styles.actionButtons} className="no-print">
                <button
                  onClick={isPlaying ? stopAudio : generateAudio}
                  disabled={isGeneratingAudio}
                  style={{
                    ...styles.actionButton,
                    background: isPlaying
                      ? 'linear-gradient(135deg, #f5576c 0%, #d63031 100%)'
                      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    opacity: isGeneratingAudio ? 0.7 : 1,
                    cursor: isGeneratingAudio ? 'not-allowed' : 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    if (!isGeneratingAudio) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 5px 15px rgba(102, 126, 234, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {isGeneratingAudio ? '⏳ جاري...' : isPlaying ? '⏹️ إيقاف' : '🔊 تشغيل الأغنية'}
                </button>
                <button
                  onClick={() => setShowSaveModal(true)}
                  style={{
                    ...styles.actionButton,
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    color: 'white',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 5px 15px rgba(240, 147, 251, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  💾 حفظ الأغنية
                </button>
                <button
                  onClick={() => setShowSavedSongs(true)}
                  style={{
                    ...styles.actionButton,
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    color: 'white',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 5px 15px rgba(79, 172, 254, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  📚 أغاني المحفوظة
                </button>
                <button
                  onClick={handlePrint}
                  style={{...styles.actionButton, ...styles.printButton}}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 5px 15px rgba(102, 126, 234, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  🖨️ طباعة
                </button>
                <button
                  onClick={handleCopy}
                  style={{...styles.actionButton, ...styles.copyButton}}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 5px 15px rgba(67, 233, 123, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  📋 نسخ
                </button>
                <button
                  onClick={() => {
                    setSong(null);
                    setChildName('');
                    stopAudio();
                  }}
                  style={{...styles.actionButton, ...styles.newSongButton}}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 5px 15px rgba(250, 112, 154, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  🎵 أغنية جديدة
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Save Modal */}
        {showSaveModal && (
          <div style={styles.modalOverlay} className="no-print">
            <div style={styles.modal}>
              <button
                onClick={() => setShowSaveModal(false)}
                style={styles.closeButton}
              >
                ✕
              </button>
              <h3 style={styles.modalTitle}>💾 حفظ الأغنية</h3>
              <p style={styles.modalSubtitle}>أدخل معلوماتك لحفظ الأغنية والوصول إليها لاحقاً</p>
              
              <form onSubmit={saveSong} style={styles.form}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>👤 اسم الوالد/الوالدة *</label>
                  <input
                    type="text"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder="مثال: أحمد محمد"
                    style={styles.input}
                    dir="rtl"
                    required
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>📧 البريد الإلكتروني *</label>
                  <input
                    type="email"
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.target.value)}
                    placeholder="example@email.com"
                    style={styles.input}
                    dir="ltr"
                    required
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>📱 رقم الهاتف (اختياري)</label>
                  <input
                    type="tel"
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    placeholder="+966 5X XXX XXXX"
                    style={styles.input}
                    dir="ltr"
                  />
                </div>

                {saveMessage && (
                  <div style={{
                    ...styles.saveMessage,
                    background: saveMessage.type === 'success' ? '#d4edda' : '#f8d7da',
                    color: saveMessage.type === 'success' ? '#155724' : '#721c24',
                  }}>
                    {saveMessage.text}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSaving}
                  style={{
                    ...styles.button,
                    opacity: isSaving ? 0.7 : 1,
                    cursor: isSaving ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isSaving ? '⏳ جاري الحفظ...' : '💾 حفظ الأغنية'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Saved Songs Modal */}
        {showSavedSongs && (
          <div style={styles.modalOverlay} className="no-print">
            <div style={{...styles.modal, maxWidth: '700px'}}>
              <button
                onClick={() => setShowSavedSongs(false)}
                style={styles.closeButton}
              >
                ✕
              </button>
              <h3 style={styles.modalTitle}>📚 أغاني المحفوظة</h3>
              
              {!savedSongs.length ? (
                <div style={styles.savedSongsEmpty}>
                  <p>أدخل بريدك الإلكتروني لعرض أغانيك المحفوظة</p>
                  <div style={styles.inputGroup}>
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="example@email.com"
                      style={{...styles.input, textAlign: 'left'}}
                      dir="ltr"
                    />
                  </div>
                  <button onClick={loadSavedSongs} style={styles.button}>
                    🔍 عرض الأغاني
                  </button>
                </div>
              ) : (
                <div style={styles.savedSongsList}>
                  {savedSongs.map((savedSong) => (
                    <div key={savedSong.id} style={styles.savedSongCard}>
                      <h4 style={styles.savedSongTitle}>{savedSong.song_title}</h4>
                      <p style={styles.savedSongInfo}>
                        👦 {savedSong.child_name} | 📅 {new Date(savedSong.created_at).toLocaleDateString('ar-SA')}
                      </p>
                      <div style={styles.savedSongActions}>
                        <button
                          onClick={() => {
                            setSong({ title: savedSong.song_title, lyrics: savedSong.song_lyrics });
                            setChildName(savedSong.child_name);
                            setShowSavedSongs(false);
                          }}
                          style={{...styles.smallButton, background: '#667eea'}}
                        >
                          👁️ عرض
                        </button>
                        <button
                          onClick={() => deleteSong(savedSong.id)}
                          style={{...styles.smallButton, background: '#f5576c'}}
                        >
                          🗑️ حذف
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{...styles.header, marginTop: '2rem'}}>
          <p style={styles.subtitle}>
            🌟 كل عام وأطفالكم بخير! أعيادكم مباركة وسعيدة! 🌟
          </p>
        </div>
      </div>
    </div>
  );
}
