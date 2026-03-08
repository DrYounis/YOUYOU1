export default function Footer() {
    const styles = {
        footer: {
            background: 'white',
            padding: '4rem 0',
            marginTop: '4rem',
            borderTop: '1px solid rgba(0,0,0,0.05)',
        },
        content: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem',
            textAlign: 'center',
        },
        socials: {
            display: 'flex',
            gap: '1.5rem',
            fontSize: '1.5rem',
            color: 'var(--color-primary)',
        },
        copyright: {
            color: 'var(--color-text-muted)',
            fontSize: '0.9rem',
        }
    };

    return (
        <footer style={styles.footer}>
            <div className="container" style={styles.content}>
                <h3>Younis Adventures</h3>
                <p style={{ maxWidth: '400px', color: 'var(--color-text-muted)' }}>
                    Documenting my journey, one video and photo at a time.
                </p>
                <div style={styles.socials}>
                    <a href="https://youtube.com/@DrYounis" target="_blank" rel="noopener noreferrer"><i className="fab fa-youtube"></i></a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
                </div>
                <div style={styles.copyright}>
                    &copy; {new Date().getFullYear()} Younis Adventures. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
