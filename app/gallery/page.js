"use client";

export default function Gallery() {
    const styles = {
        header: {
            padding: '4rem 0',
            textAlign: 'center',
        },
        masonry: {
            columnCount: 3,
            columnGap: '1.5rem',
        },
        item: {
            breakInside: 'avoid',
            marginBottom: '1.5rem',
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            border: '2px solid var(--color-border)',
            position: 'relative',
        },
        image: {
            width: '100%',
            display: 'block',
            transition: 'transform 0.4s ease',
        },
        caption: {
            padding: '0.75rem',
            textAlign: 'center',
            fontSize: '1rem',
            fontFamily: "'VT323', monospace",
            color: 'var(--color-primary)',
            background: 'rgba(0,0,0,0.5)',
        }
    };

    const photos = [
        { src: 'https://images.unsplash.com/photo-1587573089734-09cb69c0f2b4?auto=format&fit=crop&w=800&q=80', caption: 'Happy Miner: Found Diamonds! 💎' },
        { src: 'https://images.unsplash.com/photo-1627856014759-085296122d13?auto=format&fit=crop&w=800&q=80', caption: 'Crafting Success! 👍' },
        { src: 'https://images.unsplash.com/photo-1544733422-251e532ca20d?auto=format&fit=crop&w=800&q=80', caption: 'Minecart Adventure 🎢' },
        { src: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80', caption: 'Multiplayer Mode 🎮' },
        { src: 'https://images.unsplash.com/photo-1478720568477-152d9b164e63?auto=format&fit=crop&w=800&q=80', caption: 'Exploring the Overworld 🌲' },
    ];

    return (
        <div className="container">
            <div style={styles.header}>
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Photo Gallery</h1>
                <p style={{ color: 'var(--color-text-muted)' }}>Snapshots from my life.</p>
            </div>

            <div style={styles.masonry}>
                {photos.map((photo, index) => (
                    <div key={index} style={styles.item} className="gallery-item">
                        <img
                            src={photo.src}
                            alt={photo.caption}
                            style={styles.image}
                            loading="lazy"
                        />
                        <div style={styles.caption}>{photo.caption}</div>
                    </div>
                ))}
            </div>

            <style jsx>{`
        .gallery-item:hover img {
          transform: scale(1.05);
        }
        @media (max-width: 768px) {
          .masonry { column-count: 2 !important; }
        }
        @media (max-width: 480px) {
          .masonry { column-count: 1 !important; }
        }
      `}</style>
        </div>
    );
}
