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
