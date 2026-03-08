import Link from 'next/link';

export default function Blog() {
    const styles = {
        container: {
            padding: '4rem 0',
            maxWidth: '800px',
            margin: '0 auto',
        },
        post: {
            marginBottom: '4rem',
            paddingBottom: '4rem',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
        },
        date: {
            color: 'var(--color-primary)',
            fontWeight: '600',
            marginBottom: '0.5rem',
            display: 'block',
        },
        title: {
            fontSize: '2rem',
            marginBottom: '1rem',
        },
        excerpt: {
            color: 'var(--color-text-muted)',
            lineHeight: '1.8',
            fontSize: '1.1rem',
            marginBottom: '1.5rem',
        }
    };

    const posts = [
        {
            id: 1,
            title: 'My Journey Begins Here',
            date: 'December 10, 2025',
            excerpt: 'Welcome to my new blog! This is where I will be sharing my daily updates, thoughts, and behind-the-scenes stories from my YouTube channel. Stay tuned for more adventures!'
        },
        {
            id: 2,
            title: 'Why I Started Vlogging',
            date: 'November 28, 2025',
            excerpt: 'It all started with a simple camera and a desire to capture moments. Over time, it became a passion to share these stories with the world. Here is the story behind my channel.'
        }
    ];

    return (
        <div className="container" style={{ padding: '0 1.5rem' }}>
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Updated Diaries</h1>
                <p style={{ color: 'var(--color-text-muted)' }}>My thoughts, stories, and life updates.</p>
            </div>

            <div style={styles.container}>
                {posts.map(post => (
                    <article key={post.id} style={styles.post}>
                        <span style={styles.date}>{post.date}</span>
                        <Link href="#" style={{ textDecoration: 'none' }}>
                            <h2 style={styles.title}>{post.title}</h2>
                        </Link>
                        <p style={styles.excerpt}>{post.excerpt}</p>
                        <button className="btn btn-outline">Read More</button>
                    </article>
                ))}
            </div>
        </div>
    );
}
