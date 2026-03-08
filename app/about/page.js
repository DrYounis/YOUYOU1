export default function About() {
    const styles = {
        section: {
            padding: '4rem 0',
            display: 'flex',
            alignItems: 'center',
            gap: '4rem',
            flexWrap: 'wrap',
        },
        imageContainer: {
            flex: '1 1 400px',
        },
        image: {
            width: '100%',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
        },
        content: {
            flex: '1 1 400px',
        },
        title: {
            fontSize: '3rem',
            marginBottom: '2rem',
        }
    };

    return (
        <div className="container">
            <div style={styles.section}>
                <div style={styles.imageContainer}>
                    <img
                        src="/younis-about-new.jpg"
                        alt="Younis Portrait"
                        style={styles.image}
                    />
                </div>
                <div style={styles.content}>
                    <h1 style={styles.title}>About Me</h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                        Hello! I'm Younis. I am a passionate blogger and content creator.
                    </p>
                    <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                        My journey is about exploring the unknown and sharing the beauty of the world through my videos and photos.
                        I created "Younis Adventures" to bring you along with me on every trip, every hike, and every new discovery.
                    </p>
                    <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)' }}>
                        Join me as we explore life together. Don't forget to subscribe to my YouTube channel!
                    </p>
                </div>
            </div>
        </div>
    );
}
