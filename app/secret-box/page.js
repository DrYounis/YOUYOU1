'use client';
import { useState } from 'react';

export default function SecretBox() {
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState('');
  const [currentSecret, setCurrentSecret] = useState(0);

  // Secrets that rotate weekly
  const secrets = [
    {
      id: 1,
      type: 'video',
      title: '🎬 الفيديو السري للأسبوع',
      content: 'OGedo-eNsUg', // YouTube ID
      hint: 'شيء مضحك جداً! 😂',
    },
    {
      id: 2,
      type: 'joke',
      title: '😂 نكتة الأسبوع',
      content: 'واحد سأل مدرسته: كيف أكتب كلمة "فراشة"؟\nقالت له: اكتب "فـ" وبعدين "راشة"!\nقال لها: وماذا عن الفراشة الثانية؟ 🦋',
      hint: 'اضحك من قلبك! 😄',
    },
    {
      id: 3,
      type: 'surprise',
      title: '🎁 مفاجأة قادمة!',
      content: 'يونس يجهز لكم مفاجأة كبيرة جداً!\nكلمة السر القادمة ستكون أسهل...\nاستعدوا لشيء رائع! 🎉',
      hint: 'شيء في الطريق... 👀',
    },
  ];

  const correctPasswords = {
    'يونس123': 0,
    'صديق2024': 1,
    'مغامرة': 2,
  };

  const handleUnlock = (e) => {
    e.preventDefault();
    
    if (correctPasswords[password]) {
      setIsUnlocked(true);
      setCurrentSecret(correctPasswords[password]);
      setError('');
    } else {
      setError('❌ كلمة السر غلط! جرب مرة ثانية 🤔');
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      padding: '2rem',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      fontFamily: 'Arial, sans-serif',
    },
    wrapper: {
      maxWidth: '800px',
      margin: '0 auto',
    },
    header: {
      textAlign: 'center',
      color: 'white',
      marginBottom: '2rem',
    },
    title: {
      fontSize: '3rem',
      marginBottom: '0.5rem',
      textShadow: '4px 4px 0px rgba(0,0,0,0.5)',
    },
    subtitle: {
      fontSize: '1.2rem',
      opacity: 0.9,
    },
    card: {
      background: 'white',
      borderRadius: '20px',
      padding: '2rem',
      boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
    },
    lockScreen: {
      textAlign: 'center',
      padding: '3rem 0',
    },
    lockIcon: {
      fontSize: '6rem',
      marginBottom: '1rem',
    },
    input: {
      width: '100%',
      padding: '1rem',
      fontSize: '1.2rem',
      border: '3px solid #667eea',
      borderRadius: '10px',
      marginBottom: '1rem',
      textAlign: 'center',
      direction: 'rtl',
    },
    button: {
      padding: '1rem 2rem',
      borderRadius: '50px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '1.1rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      width: '100%',
    },
    error: {
      background: '#fee',
      color: '#c00',
      padding: '1rem',
      borderRadius: '10px',
      marginTop: '1rem',
      fontSize: '1rem',
    },
    hint: {
      background: '#f0f8ff',
      color: '#667eea',
      padding: '1rem',
      borderRadius: '10px',
      marginTop: '1rem',
      fontSize: '0.95rem',
    },
    secretContent: {
      textAlign: 'center',
      padding: '2rem 0',
    },
    videoContainer: {
      position: 'relative',
      paddingBottom: '56.25%',
      height: 0,
      marginBottom: '1.5rem',
    },
    jokeBox: {
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      padding: '2rem',
      borderRadius: '15px',
      color: 'white',
      fontSize: '1.3rem',
      lineHeight: '2',
      whiteSpace: 'pre-line',
    },
    surpriseBox: {
      background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      padding: '2rem',
      borderRadius: '15px',
      color: 'white',
      fontSize: '1.3rem',
      lineHeight: '2',
      whiteSpace: 'pre-line',
    },
    homeButton: {
      display: 'inline-block',
      padding: '0.75rem 1.5rem',
      background: 'rgba(255,255,255,0.2)',
      color: 'white',
      textDecoration: 'none',
      borderRadius: '50px',
      fontWeight: 'bold',
      marginBottom: '1rem',
      backdropFilter: 'blur(10px)',
      border: '2px solid rgba(255,255,255,0.3)',
    },
    navButtons: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
      marginTop: '2rem',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        {/* Home Button */}
        <div style={{ textAlign: 'center' }}>
          <a href="/" style={styles.homeButton}>🏠 العودة للرئيسية</a>
        </div>

        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>🗝️ صندوق الأسرار 🗝️</h1>
          <p style={styles.subtitle}>
            محتوى سري جداً لأصدقاء يونس المقربين! 🔒
          </p>
        </div>

        {!isUnlocked ? (
          /* Lock Screen */
          <div style={styles.card}>
            <div style={styles.lockScreen}>
              <div style={styles.lockIcon}>🔐</div>
              <h2 style={{ fontSize: '1.8rem', color: '#333', marginBottom: '1rem' }}>
                هذا المحتوى سري!
              </h2>
              <p style={{ color: '#666', marginBottom: '2rem' }}>
                فقط أصدقاء يونس المقربين يعرفون كلمة السر 👀
              </p>

              <form onSubmit={handleUnlock}>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="اكتب كلمة السر هنا..."
                  style={styles.input}
                  dir="rtl"
                />
                <button type="submit" style={styles.button}>
                  🔓 فتح الصندوق
                </button>
              </form>

              {error && (
                <div style={styles.error}>
                  {error}
                </div>
              )}

              <div style={styles.hint}>
                💡 تلميح: اسأل يونس في المدرسة أو النادي!
              </div>
            </div>
          </div>
        ) : (
          /* Unlocked Content */
          <div style={styles.card}>
            <div style={styles.secretContent}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                {secrets[currentSecret].type === 'video' && '🎬'}
                {secrets[currentSecret].type === 'joke' && '😂'}
                {secrets[currentSecret].type === 'surprise' && '🎁'}
              </div>

              <h2 style={{ fontSize: '1.8rem', color: '#667eea', marginBottom: '1.5rem' }}>
                {secrets[currentSecret].title}
              </h2>

              {secrets[currentSecret].type === 'video' && (
                <div>
                  <div style={styles.videoContainer}>
                    <iframe
                      src={`https://www.youtube.com/embed/${secrets[currentSecret].content}`}
                      title="Secret Video"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        border: 0,
                        borderRadius: '10px',
                      }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <p style={{ color: '#666', fontSize: '1.1rem' }}>
                    فيديو حصري لأصدقاء يونس! 🎉
                  </p>
                </div>
              )}

              {secrets[currentSecret].type === 'joke' && (
                <div style={styles.jokeBox}>
                  {secrets[currentSecret].content}
                </div>
              )}

              {secrets[currentSecret].type === 'surprise' && (
                <div style={styles.surpriseBox}>
                  {secrets[currentSecret].content}
                </div>
              )}

              {/* Navigation */}
              <div style={styles.navButtons}>
                <button
                  onClick={() => {
                    setIsUnlocked(false);
                    setPassword('');
                  }}
                  style={{
                    ...styles.button,
                    background: '#e0e0e0',
                    color: '#333',
                    width: 'auto',
                  }}
                >
                  🔒 قفل الصندوق
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Info Card */}
        <div style={{
          ...styles.card,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          marginTop: '2rem',
          textAlign: 'center',
        }}>
          <h3 style={{ color: 'white', fontSize: '1.3rem', marginBottom: '1rem' }}>
            🤫 كيف تحصل على كلمة السر؟
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', lineHeight: '1.8' }}>
            كلمة السر تتغير كل أسبوع!<br/>
            اسأل يونس في المدرسة أو النادي<br/>
            أو راقب إعلاناته الخاصة! 👀
          </p>
        </div>
      </div>
    </div>
  );
}
