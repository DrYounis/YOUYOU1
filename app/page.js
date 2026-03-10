'use client';
import Hero from './components/Hero';
import Link from 'next/link';

export default function Home() {
    const styles = {
        section: {
            padding: '6rem 0',
        },
        sectionTitle: {
            fontSize: '2.5rem',
            marginBottom: '3rem',
            textAlign: 'center',
            color: 'var(--color-primary)',
        },
        welcomeSection: {
            padding: '4rem 0',
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            margin: '2rem auto',
            position: 'relative',
            overflow: 'hidden',
        },
        welcomeContent: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '4rem',
        },
        welcomeText: {
            flex: '1 1 300px',
            maxWidth: '500px',
        },
        welcomeImage: {
            flex: '0 1 350px',
            borderRadius: '2rem',
            boxShadow: 'var(--shadow-lg)',
            border: '4px solid white',
            transform: 'rotate(2deg)',
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
        },
        card: {
            background: 'white',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            border: '1px solid rgba(0,0,0,0.05)',
            boxShadow: 'var(--shadow-sm)',
        },
        cardContent: {
            padding: '1.5rem',
        },
        cardImage: {
            width: '100%',
            aspectRatio: '16/9',
            objectFit: 'cover',
        },
        cardTitle: {
            marginBottom: '0.5rem',
            fontSize: '1.25rem',
            color: 'var(--color-text-main)',
        }
    };

    return (
        <div>
            {/* ✨ MAGIC: Animated Background with Floating Emojis */}
            <style jsx global>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-30px) rotate(10deg); }
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
                @keyframes wiggle {
                    0%, 100% { transform: rotate(-5deg); }
                    50% { transform: rotate(5deg); }
                }
                @keyframes sparkle {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(1.2); }
                }
                .floating-emoji {
                    position: absolute;
                    font-size: 3rem;
                    opacity: 0.15;
                    animation: float 4s ease infinite;
                    pointer-events: none;
                }
                .magic-card:hover {
                    transform: translateY(-15px) scale(1.05);
                    box-shadow: 0 20px 60px rgba(102, 126, 234, 0.4);
                }
                .magic-card:hover .magic-icon {
                    animation: bounce 0.5s ease infinite;
                }
                .welcome-btn {
                    transition: all 0.3s ease;
                }
                .welcome-btn:hover {
                    transform: translateY(-5px) scale(1.05);
                    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
                }
            `}</style>

            {/* 🎨 Welcome Section - Now with Magic! */}
            <section style={{ ...styles.welcomeSection, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                {/* Floating Background Emojis */}
                <div className="floating-emoji" style={{ top: '10%', left: '5%', animationDelay: '0s' }}>🎈</div>
                <div className="floating-emoji" style={{ top: '20%', right: '10%', animationDelay: '1s' }}>⭐</div>
                <div className="floating-emoji" style={{ bottom: '15%', left: '15%', animationDelay: '2s' }}>🌟</div>
                <div className="floating-emoji" style={{ bottom: '25%', right: '5%', animationDelay: '1.5s' }}>✨</div>
                <div className="floating-emoji" style={{ top: '50%', left: '3%', animationDelay: '2.5s' }}>🎨</div>
                <div className="floating-emoji" style={{ top: '35%', right: '8%', animationDelay: '3s' }}>🚀</div>

                <div className="container" style={{ position: 'relative', zIndex: 1, padding: '3rem 1.5rem' }}>
                    <div style={styles.welcomeContent}>
                        <div style={styles.welcomeText}>
                            <h2 style={{ 
                                fontSize: '3.5rem', 
                                marginBottom: '1rem', 
                                color: 'white',
                                textShadow: '4px 4px 0px rgba(0,0,0,0.3)',
                                animation: 'wiggle 3s ease infinite'
                            }}>
                                Hi! I'm Younis 👋
                            </h2>
                            <h3 style={{ 
                                fontSize: '1.8rem', 
                                marginBottom: '1.5rem', 
                                color: 'rgba(255,255,255,0.95)',
                                fontWeight: '600'
                            }}>
                                Hello to all my friends! 🎉
                            </h3>
                            <p style={{ 
                                fontSize: '1.2rem', 
                                color: 'rgba(255,255,255,0.95)', 
                                marginBottom: '2rem',
                                lineHeight: '1.8'
                            }}>
                                Welcome to my world of adventures. I'm so happy you're here.
                                Look around, watch my videos, and maybe leave me a note on the Friends page!
                            </p>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <Link 
                                    href="/friends" 
                                    className="welcome-btn"
                                    style={{
                                        display: 'inline-block',
                                        padding: '1rem 2rem',
                                        background: 'white',
                                        color: '#667eea',
                                        textDecoration: 'none',
                                        borderRadius: '50px',
                                        fontWeight: 'bold',
                                        fontSize: '1.1rem',
                                        boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
                                    }}
                                >
                                    💌 Leave a Message
                                </Link>
                                <Link 
                                    href="/fun-zone" 
                                    className="welcome-btn"
                                    style={{
                                        display: 'inline-block',
                                        padding: '1rem 2rem',
                                        background: 'rgba(255,255,255,0.2)',
                                        color: 'white',
                                        textDecoration: 'none',
                                        borderRadius: '50px',
                                        fontWeight: 'bold',
                                        fontSize: '1.1rem',
                                        backdropFilter: 'blur(10px)',
                                        border: '2px solid rgba(255,255,255,0.3)',
                                    }}
                                >
                                    🎮 Fun Zone
                                </Link>
                            </div>
                        </div>
                        <div>
                            <img
                                src="/younis-welcome.jpg"
                                alt="Younis saying Hi"
                                style={{
                                    ...styles.welcomeImage,
                                    animation: 'float 4s ease infinite',
                                }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            <Hero />

            {/* 🎉 NEW: Fun Zone for Kids - Creative Cards Design */}
            <section style={{ ...styles.section, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', position: 'relative', overflow: 'hidden' }}>
                {/* Floating Background Shapes */}
                <div style={{ position: 'absolute', top: '10%', left: '5%', fontSize: '4rem', opacity: 0.1, animation: 'float 3s ease infinite' }}>🎈</div>
                <div style={{ position: 'absolute', top: '20%', right: '10%', fontSize: '5rem', opacity: 0.1, animation: 'float 4s ease infinite' }}>⭐</div>
                <div style={{ position: 'absolute', bottom: '15%', left: '15%', fontSize: '3rem', opacity: 0.1, animation: 'float 5s ease infinite' }}>🌟</div>
                <div style={{ position: 'absolute', bottom: '25%', right: '5%', fontSize: '4rem', opacity: 0.1, animation: 'float 3.5s ease infinite' }}>✨</div>

                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <h2 style={{ ...styles.sectionTitle, color: 'white', textShadow: '4px 4px 0px rgba(0,0,0,0.3)', fontSize: '3rem', marginBottom: '1rem' }}>
                        🎈 Fun Zone for Younis's Friends! 🎈
                    </h2>
                    <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.9)', fontSize: '1.3rem', marginBottom: '3rem' }}>
                        🎮 Click for Fun Activities! 🎮
                    </p>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
                        {/* Fun Personality Quiz Card */}
                        <a
                            href="/friends/quiz"
                            className="fun-card"
                            style={{
                                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                borderRadius: '1.5rem',
                                padding: '2rem',
                                textDecoration: 'none',
                                color: 'white',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                                textAlign: 'center',
                            }}
                        >
                            <div className="fun-icon" style={{ fontSize: '5rem', marginBottom: '1rem' }}>🎯</div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                Fun Personality Quiz
                            </h3>
                            <p style={{ fontSize: '1rem', opacity: 0.9, lineHeight: '1.5' }}>
                                Discover your personality type and get fun activity suggestions!
                            </p>
                        </a>

                        {/* Bedtime Stories Library Card */}
                        <a
                            href="/bedtime-stories"
                            className="fun-card"
                            style={{
                                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                borderRadius: '1.5rem',
                                padding: '2rem',
                                textDecoration: 'none',
                                color: 'white',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                                textAlign: 'center',
                            }}
                        >
                            <div className="fun-icon" style={{ fontSize: '5rem', marginBottom: '1rem' }}>📚</div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                Bedtime Stories Library
                            </h3>
                            <p style={{ fontSize: '1rem', opacity: 0.9, lineHeight: '1.5' }}>
                                Read magical stories created for Younis's friends!
                            </p>
                        </a>

                        {/* AI Story Generator Card */}
                        <a
                            href="/bedtime-stories/generate"
                            className="fun-card"
                            style={{
                                background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                                borderRadius: '1.5rem',
                                padding: '2rem',
                                textDecoration: 'none',
                                color: 'white',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                                textAlign: 'center',
                            }}
                        >
                            <div className="fun-icon" style={{ fontSize: '5rem', marginBottom: '1rem' }}>🌙</div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                AI Story Generator
                            </h3>
                            <p style={{ fontSize: '1rem', opacity: 0.9, lineHeight: '1.5' }}>
                                Create a personalized bedtime story powered by AI!
                            </p>
                        </a>
                    </div>

                    {/* More Fun Button */}
                    <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                        <a
                            href="/fun-zone"
                            style={{
                                display: 'inline-block',
                                padding: '1rem 2rem',
                                background: 'white',
                                color: '#667eea',
                                textDecoration: 'none',
                                borderRadius: '50px',
                                fontWeight: 'bold',
                                fontSize: '1.1rem',
                                boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
                                transition: 'all 0.3s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.2)';
                            }}
                        >
                            🎉 See ALL Fun Activities →
                        </a>
                    </div>
                </div>
            </section>

            {/* Latest Videos Preview - LIVE with YouTube Embeds */}
            <section style={styles.section} className="container">
                <h2 style={styles.sectionTitle}>Latest Adventures</h2>
                <div style={{...styles.grid, gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))'}}>
                    {/* Featured Video - Live YouTube */}
                    <div style={{...styles.card, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)', boxShadow: 'var(--shadow-lg)'}}>
                        <div style={{position: 'relative', paddingBottom: '56.25%', height: 0}}>
                            <iframe
                                src="https://www.youtube.com/embed/OGedo-eNsUg"
                                title="Younis Adventures: New Episode"
                                style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0}}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                        <div style={styles.cardContent}>
                            <h3 style={styles.cardTitle}>🎬 Younis Adventures: New Episode</h3>
                            <p style={{color: 'var(--color-text-muted)', marginBottom: '1rem'}}>Watch my latest adventure!</p>
                            <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
                                <span style={{
                                    background: '#667eea',
                                    color: 'white',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '20px',
                                    fontSize: '0.85rem',
                                    fontWeight: '600'
                                }}>
                                    ▶️ New Episode
                                </span>
                                <span style={{
                                    background: '#f0f0f0',
                                    color: '#666',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '20px',
                                    fontSize: '0.85rem'
                                }}>
                                    📅 Dec 2025
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Second Video - Live YouTube */}
                    <div style={{...styles.card, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)', boxShadow: 'var(--shadow-md)'}}>
                        <div style={{position: 'relative', paddingBottom: '56.25%', height: 0}}>
                            <iframe
                                src="https://www.youtube.com/embed/qMOQKoFxQCE"
                                title="Start Your Day Right"
                                style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0}}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                        <div style={styles.cardContent}>
                            <h3 style={styles.cardTitle}>☀️ Start Your Day Right</h3>
                            <p style={{color: 'var(--color-text-muted)', marginBottom: '1rem'}}>Morning motivation with Younis!</p>
                            <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
                                <span style={{
                                    background: '#43e97b',
                                    color: 'white',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '20px',
                                    fontSize: '0.85rem',
                                    fontWeight: '600'
                                }}>
                                    ☀️ Morning
                                </span>
                                <span style={{
                                    background: '#f0f0f0',
                                    color: '#666',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '20px',
                                    fontSize: '0.85rem'
                                }}>
                                    📅 Dec 2025
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{textAlign: 'center', marginTop: '3rem'}}>
                    <Link href="/videos" style={{
                        display: 'inline-block',
                        padding: '1rem 2rem',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '50px',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        boxShadow: '0 5px 20px rgba(102, 126, 234, 0.4)',
                        transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 5px 20px rgba(102, 126, 234, 0.4)';
                    }}>
                        🎬 Watch All Adventures →
                    </Link>
                </div>
            </section>
        </div>
    );
}
