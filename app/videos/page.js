export default function Videos() {
    const styles = {
        header: {
            textAlign: 'center',
            padding: '4rem 0',
            background: 'linear-gradient(to bottom, var(--color-bg), var(--color-surface))',
        },
        title: {
            fontSize: '3rem',
            marginBottom: '1rem',
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '2rem',
            padding: '4rem 0',
        },
        videoCard: {
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.05)',
        },
        iframeContainer: {
            position: 'relative',
            paddingBottom: '56.25%', /* 16:9 Aspect Ratio */
            height: 0,
            width: '100%',
        },
        iframe: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 0,
        },
        info: {
            padding: '1.5rem',
        }
    };

    const videos = [
        { id: 'OGedo-eNsUg', title: 'Younis Adventures: New Episode', date: 'Dec 11, 2025' },
        { id: 'qMOQKoFxQCE', title: 'Start Your Day Right ☀️', date: 'Dec 11, 2025' },
    ];

    return (
        <div>
            <div style={styles.header}>
                <div className="container">
                    <h1 style={styles.title}>Video Gallery</h1>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '1.2rem' }}>
                        Watch my latest vlogs and updates on YouTube.
                    </p>
                </div>
            </div>

            <div className="container" style={styles.grid}>
                {videos.map((video) => (
                    <div key={video.id} style={styles.videoCard}>
                        <div style={styles.iframeContainer}>
                            <iframe
                                src={`https://www.youtube.com/embed/${video.id}`}
                                title={video.title}
                                style={styles.iframe}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                        <div style={styles.info}>
                            <h3>{video.title}</h3>
                            <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                                Published on {video.date}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
