'use client';
import Link from 'next/link';

export default function FunZone() {
  const activities = [
    {
      title: '🌟 مواطنو عالم يونس',
      description: 'كن مواطناً مميزاً! احصل على وسام رقمي خاص بك وشارك رسوماتك!',
      href: '/citizens',
      color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      icon: '🏆',
      features: ['وسام رقمي', 'رسوماتك', 'لقب مميز', 'جائزة خاصة']
    },
    {
      title: '🗝️ صندوق الأسرار',
      description: 'محتوى سري لأصدقاء يونس المقربين! احصل على كلمة السر واكتشف المفاجآت!',
      href: '/secret-box',
      color: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      icon: '🔐',
      features: ['محتوى حصري', 'كلمة سر', 'مفاجآت', 'فيديوهات سرية']
    },
    {
      title: '🎨 كتيب التلوين',
      description: 'صمم كتيب تلوين مخصص باسم طفلك! اختر الصفحات وحمله PDF جاهز للطباعة!',
      href: '/coloring-book',
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      icon: '📚',
      features: ['PDF جاهز', 'اسم الطفل', '١٠ صفحات', 'مجاني تماماً']
    },
    {
      title: '🎨 Kids Coloring Tools',
      description: 'Create custom coloring pages! AI draws anything or choose from 28+ templates. Print and color!',
      href: '/kids-tools',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      icon: '🎨',
      features: ['AI Drawing', '28+ Templates', 'A4 Print', 'PDF Download']
    },
    {
      title: '📚 Bedtime Stories',
      description: 'Magical AI-generated bedtime stories! Personalized with your child\'s name and favorite themes.',
      href: '/bedtime-stories',
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      icon: '📚',
      features: ['AI Stories', 'Personalized', 'Arabic Support', 'Save & Share']
    },
    {
      title: '👫 Friends Zone',
      description: 'Leave messages for friends and see what others say! A fun wall of friendship.',
      href: '/friends',
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      icon: '👫',
      features: ['Message Wall', 'Make Friends', 'Share Fun', 'Community']
    },
    {
      title: '📖 Diaries & Blog',
      description: 'Read and write adventure diaries! Share your stories with the world.',
      href: '/blog',
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      icon: '📖',
      features: ['Write Stories', 'Read Adventures', 'Share Experiences', 'Get Inspired']
    },
    {
      title: '🖼️ Photo Gallery',
      description: 'Amazing photos and memories from adventures around the world!',
      href: '/gallery',
      color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      icon: '🖼️',
      features: ['Beautiful Photos', 'Adventures', 'Memories', 'Inspiration']
    },
    {
      title: '🎬 Videos',
      description: 'Watch fun videos and adventures! Entertainment for kids.',
      href: '/videos',
      color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      icon: '🎬',
      features: ['Fun Videos', 'Adventures', 'Entertainment', 'Educational']
    },
    {
      title: '🗺️ Adventure Map',
      description: 'Explore places on the interactive map! See where adventures happen.',
      href: '/map',
      color: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      icon: '🗺️',
      features: ['Interactive Map', 'Explore', 'Locations', 'Adventures']
    },
    {
      title: '🧩 Fun Quiz',
      description: 'Test your knowledge with fun quizzes! Learn while playing.',
      href: '/friends/quiz',
      color: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
      icon: '🧩',
      features: ['Fun Quizzes', 'Learn', 'Play', 'Challenge']
    }
  ];

  const styles = {
    container: {
      minHeight: '100vh',
      padding: '2rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: '"Comic Sans MS", "Chalkboard SE", Arial, sans-serif',
    },
    wrapper: {
      maxWidth: '1400px',
      margin: '0 auto',
    },
    header: {
      textAlign: 'center',
      marginBottom: '3rem',
    },
    title: {
      fontSize: '3.5rem',
      color: 'white',
      textShadow: '4px 4px 0px #4834d4',
      marginBottom: '1rem',
    },
    subtitle: {
      fontSize: '1.5rem',
      color: 'rgba(255, 255, 255, 0.9)',
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
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '2rem',
    },
    card: {
      background: 'white',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    },
    cardHeader: {
      padding: '2rem',
      color: 'white',
      textAlign: 'center',
    },
    cardIcon: {
      fontSize: '4rem',
      marginBottom: '1rem',
    },
    cardTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem',
    },
    cardBody: {
      padding: '1.5rem',
    },
    cardDescription: {
      fontSize: '1rem',
      color: '#666',
      marginBottom: '1rem',
      lineHeight: '1.5',
    },
    featuresList: {
      listStyle: 'none',
      padding: 0,
      margin: '1rem 0',
    },
    featureItem: {
      display: 'inline-block',
      background: '#f0f0f0',
      padding: '0.5rem 1rem',
      borderRadius: '20px',
      fontSize: '0.85rem',
      color: '#666',
      margin: '0.25rem',
    },
    cardButton: {
      display: 'block',
      width: '100%',
      padding: '1rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      textAlign: 'center',
      textDecoration: 'none',
      fontWeight: 'bold',
      fontSize: '1.1rem',
      borderRadius: '10px',
      transition: 'all 0.3s ease',
    },
    footer: {
      textAlign: 'center',
      marginTop: '3rem',
      color: 'white',
      fontSize: '1.2rem',
    },
  };

  return (
    <div style={styles.container}>
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .activity-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        .activity-card:hover .card-button {
          background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
        }
      `}</style>

      <div style={styles.wrapper}>
        {/* Home Button */}
        <div style={{ textAlign: 'center' }}>
          <Link
            href="/"
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
            🏠 Back to Home
          </Link>
        </div>

        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>🎉 Fun Zone 🎉</h1>
          <p style={styles.subtitle}>Pick an activity and start having fun! ✨</p>
        </div>

        {/* Activities Grid */}
        <div style={styles.grid}>
          {activities.map((activity, index) => (
            <div
              key={index}
              className="activity-card"
              style={styles.card}
            >
              <div
                style={{
                  ...styles.cardHeader,
                  background: activity.color,
                }}
              >
                <div style={styles.cardIcon}>{activity.icon}</div>
                <h3 style={styles.cardTitle}>{activity.title}</h3>
              </div>
              <div style={styles.cardBody}>
                <p style={styles.cardDescription}>{activity.description}</p>
                <div style={styles.featuresList}>
                  {activity.features.map((feature, idx) => (
                    <span key={idx} style={styles.featureItem}>
                      {feature}
                    </span>
                  ))}
                </div>
                <Link
                  href={activity.href}
                  className="card-button"
                  style={styles.cardButton}
                >
                  🚀 Start Fun →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <p>🌟 So many fun activities! Which one will you try first? 🌟</p>
        </div>
      </div>
    </div>
  );
}
