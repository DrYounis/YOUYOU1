import Link from 'next/link';

export default function Hero() {
    const styles = {
        section: {
            position: 'relative',
            height: '70vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            overflow: 'hidden',
        },
        bg: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            // Nature/Adventure background
            backgroundImage: 'url("https://images.unsplash.com/photo-1469474932316-4690a029a997?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: -2,
        },
        overlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            // Lighter overlay for light theme feel, but still need contrast for text
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(2px)',
            zIndex: -1,
        },
        content: {
            maxWidth: '800px',
            padding: '2rem',
            background: 'rgba(255, 255, 255, 0.85)',
            borderRadius: '2rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(10px)',
        },
        title: {
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: '800',
            marginBottom: '1rem',
            lineHeight: 1.1,
            color: 'var(--color-primary)',
        },
        subtitle: {
            fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
            color: 'var(--color-text-muted)',
            marginBottom: '2rem',
            fontWeight: '500',
        },
        buttons: {
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
        }
    };

    return (
        <section style={styles.section}>
            <div style={styles.bg}></div>
            <div style={styles.overlay}></div>
            <div className="container animate-fade-in" style={styles.content}>
                <h1 style={styles.title}>Younis Adventures</h1>
                <p style={styles.subtitle}>
                    Explore the world through my lens. Videos, photos, and stories from my journey.
                </p>
                <div style={styles.buttons}>
                    <Link href="/videos" className="btn btn-primary">
                        Watch Videos
                    </Link>
                    <Link href="/gallery" className="btn btn-outline" style={{ background: 'white' }}>
                        View Gallery
                    </Link>
                </div>
            </div>
        </section>
    );
}
