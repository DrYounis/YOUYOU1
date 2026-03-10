'use client';
import { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';

export default function Citizens() {
  const [submissions, setSubmissions] = useState([
    { id: 1, name: 'أحمد', title: '🎨 رسام العالم', category: 'art', approved: true },
    { id: 2, name: 'فاطمة', title: '🔬 المخترع الصغير', category: 'science', approved: true },
    { id: 3, name: 'محمد', title: '🌟 صديق الطبيعة', category: 'nature', approved: true },
  ]);

  const [showBadgeMaker, setShowBadgeMaker] = useState(false);
  const [selectedCitizen, setSelectedCitizen] = useState(null);

  const badges = {
    '🎨 رسام العالم': { color: '#667eea', icon: '🎨' },
    '🔬 المخترع الصغير': { color: '#43e97b', icon: '🔬' },
    '🌟 صديق الطبيعة': { color: '#4facfe', icon: '🌿' },
    '📚 عاشق الكتب': { color: '#f093fb', icon: '📚' },
    '🎮 بطل الألعاب': { color: '#fa709a', icon: '🎮' },
    '🎵 نجم الموسيقى': { color: '#fee140', icon: '🎵' },
    '⚽ لاعب الشهر': { color: '#ff6b6b', icon: '⚽' },
    '🦸 البطل الخارق': { color: '#a8edea', icon: '🦸' },
  };

  const downloadBadge = (citizen) => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');

    const badge = badges[citizen.title] || badges['🎨 رسام العالم'];
    
    // Background gradient
    const gradient = ctx.createRadialGradient(300, 300, 0, 300, 300, 300);
    gradient.addColorStop(0, badge.color);
    gradient.addColorStop(1, '#333');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 600, 600);

    // Border
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(300, 300, 290, 0, Math.PI * 2);
    ctx.stroke();

    // Icon
    ctx.font = '200px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'white';
    ctx.fillText(badge.icon, 300, 250);

    // Title
    ctx.font = 'bold 48px Arial, sans-serif';
    ctx.fillText(citizen.title.replace('🎨 ', '').replace('🔬 ', '').replace('🌟 ', ''), 300, 400);

    // Name
    ctx.font = 'bold 36px Arial, sans-serif';
    ctx.fillText(citizen.name, 300, 480);

    // Signature
    ctx.font = '20px Arial, sans-serif';
    ctx.fillText('younis.world', 300, 550);
    ctx.fillText('مواطن شرفي في عالم يونس', 300, 580);

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      format: 'square',
      unit: 'px',
      compress: true
    });
    pdf.addImage(imgData, 'PNG', 0, 0, 600, 600);
    pdf.save(`${citizen.name}-وسام-${citizen.title.split(' ')[1]}.pdf`);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      padding: '2rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'Arial, sans-serif',
    },
    wrapper: {
      maxWidth: '1200px',
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
      textShadow: '4px 4px 0px rgba(0,0,0,0.3)',
    },
    subtitle: {
      fontSize: '1.3rem',
      opacity: 0.95,
    },
    card: {
      background: 'white',
      borderRadius: '20px',
      padding: '2rem',
      marginBottom: '2rem',
      boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '2rem',
    },
    citizenCard: {
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      borderRadius: '15px',
      padding: '1.5rem',
      textAlign: 'center',
      transition: 'transform 0.3s ease',
      border: '3px solid transparent',
    },
    badge: {
      fontSize: '5rem',
      marginBottom: '1rem',
    },
    citizenName: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '0.5rem',
    },
    citizenTitle: {
      fontSize: '1.1rem',
      color: '#667eea',
      fontWeight: '600',
    },
    button: {
      padding: '1rem 2rem',
      borderRadius: '50px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '1.1rem',
      transition: 'all 0.3s ease',
    },
    primaryBtn: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
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
    badgePreview: {
      maxWidth: '400px',
      margin: '2rem auto',
      borderRadius: '50%',
      border: '10px solid white',
      boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
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
          <h1 style={styles.title}>🌟 مواطنو عالم يونس 🌟</h1>
          <p style={styles.subtitle}>
            هنا نكرم الأصدقاء المميزين! هل أنت واحد منهم؟ 🏆
          </p>
        </div>

        {/* Info Card */}
        <div style={styles.card}>
          <h2 style={{ fontSize: '1.8rem', color: '#667eea', marginBottom: '1rem', textAlign: 'center' }}>
            🎯 كيف تصبح مواطناً في عالم يونس؟
          </h2>
          <ol style={{ fontSize: '1.1rem', lineHeight: '2', color: '#333', maxWidth: '800px', margin: '0 auto' }}>
            <li>أرسل رسمة أو صورة لهوايتك المفضلة</li>
            <li>يونس يختار الأصدقاء المميزين كل أسبوع</li>
            <li>تحصل على وسام رقمي خاص بك!</li>
            <li>ضع الوسام كصورة شخصية في واتساب 📱</li>
          </ol>
        </div>

        {/* Citizens Grid */}
        <div style={styles.card}>
          <h2 style={{ fontSize: '1.8rem', color: '#667eea', marginBottom: '1.5rem', textAlign: 'center' }}>
            🏆 مواطنو الشهر
          </h2>
          <div style={styles.grid}>
            {submissions.map((citizen) => (
              <div
                key={citizen.id}
                style={{
                  ...styles.citizenCard,
                  borderColor: badges[citizen.title]?.color || '#667eea',
                }}
              >
                <div style={styles.badge}>
                  {badges[citizen.title]?.icon || '🌟'}
                </div>
                <h3 style={styles.citizenName}>{citizen.name}</h3>
                <p style={styles.citizenTitle}>{citizen.title}</p>
                <button
                  onClick={() => {
                    setSelectedCitizen(citizen);
                    setShowBadgeMaker(true);
                  }}
                  style={{
                    ...styles.button,
                    ...styles.primaryBtn,
                    marginTop: '1rem',
                    width: '100%',
                  }}
                >
                  📥 تحميل الوسام
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Badge Maker Modal */}
        {showBadgeMaker && selectedCitizen && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '2rem',
          }}>
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '2rem',
              maxWidth: '500px',
              textAlign: 'center',
            }}>
              <h2 style={{ fontSize: '1.5rem', color: '#667eea', marginBottom: '1rem' }}>
                وسام {selectedCitizen.name}
              </h2>
              <div style={{
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                background: badges[selectedCitizen.title]?.color || '#667eea',
                margin: '2rem auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '8rem',
                color: 'white',
                border: '10px solid white',
                boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
              }}>
                {badges[selectedCitizen.title]?.icon || '🌟'}
              </div>
              <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
                {selectedCitizen.title}
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button
                  onClick={() => downloadBadge(selectedCitizen)}
                  style={{
                    ...styles.button,
                    ...styles.primaryBtn,
                  }}
                >
                  📥 تحميل PDF
                </button>
                <button
                  onClick={() => setShowBadgeMaker(false)}
                  style={{
                    ...styles.button,
                    background: '#e0e0e0',
                    color: '#333',
                  }}
                >
                  ✕ إغلاق
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div style={{
          ...styles.card,
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          textAlign: 'center',
        }}>
          <h2 style={{ fontSize: '1.8rem', color: 'white', marginBottom: '1rem' }}>
            🎨 هل تريد أن تكون مواطناً مميزاً؟
          </h2>
          <p style={{ fontSize: '1.2rem', color: 'white', marginBottom: '1.5rem' }}>
            أرسل رسوماتك أو صور هواياتك ليونس!
          </p>
          <a
            href="/friends"
            style={{
              ...styles.button,
              background: 'white',
              color: '#43e97b',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            💌 أرسل رسالتك الآن
          </a>
        </div>
      </div>
    </div>
  );
}
