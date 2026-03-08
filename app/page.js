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
            {/* New Welcome Section with Personal Photo */}
            <section style={{ padding: '0 1.5rem' }}>
                <div className="container" style={styles.welcomeSection}>
                    <div style={styles.welcomeContent}>
                        <div style={styles.welcomeText}>
                            <h2 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--color-primary)', textShadow: '4px 4px 0px #000' }}>
                                Hi! I'm Younis 👋
                            </h2>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--color-secondary)', fontWeight: '500' }}>
                                Hello to all my friends!
                            </h3>
                            <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                                Welcome to my world of adventures. I'm so happy you're here.
                                Look around, watch my videos, and maybe leave me a note on the Friends page!
                            </p>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <Link href="/friends" className="btn btn-primary">Leave a Message</Link>
                                <Link href="/diaries" className="btn btn-outline">Read Diaries</Link>
                                <Link href="/about" className="btn btn-outline">More About Me</Link>
                            </div>
                            <div style={{ marginTop: '1.5rem' }}>
                                <Link href="/login" style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}>
                                    🔐 Younis Login
                                </Link>
                            </div>
                        </div>
                        <div>
                            {/* The new uploaded photo */}
                            <img
                                src="/younis-welcome.jpg"
                                alt="Younis saying Hi"
                                style={styles.welcomeImage}
                            />
                        </div>
                    </div>
                </div>
            </section>

            <Hero />

            {/* Latest Videos Preview */}
            <section style={styles.section} className="container">
                <h2 style={styles.sectionTitle}>Latest Adventures</h2>
                <div style={styles.grid}>
                    <Link href="/videos" style={{ textDecoration: 'none' }}>
                        <div style={styles.card} className="hover-card">
                            <img
                                src="/latest-adventure.jpg"
                                alt="Younis Adventures: New Episode"
                                style={styles.cardImage}
                            />
                            <div style={styles.cardContent}>
                                <h3 style={styles.cardTitle}>Younis Adventures: New Episode</h3>
                                <p style={{ color: 'var(--color-text-muted)' }}>Watch my latest adventure!</p>
                            </div>
                        </div>
                    </Link>
                </div>
                <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                    <Link href="/videos" className="btn btn-outline">View All Videos</Link>
                </div>
            </section>
        </div>
    );
}
