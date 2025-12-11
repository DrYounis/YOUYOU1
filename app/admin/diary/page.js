"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function PrivateDiary() {
    const [session, setSession] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [diaries, setDiaries] = useState([]);
    const router = useRouter();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (!session) router.push('/login');
            else fetchDiaries(session.user.id);
        });
    }, [router]);

    const fetchDiaries = async (userId) => {
        const { data } = await supabase
            .from('diaries')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (data) setDiaries(data);
    };

    const handleSave = async () => {
        if (!content) return;

        const { error } = await supabase
            .from('diaries')
            .insert([{
                title,
                content,
                is_public: isPublic,
                user_id: session.user.id
            }]);

        if (!error) {
            setTitle('');
            setContent('');
            setIsPublic(false);
            fetchDiaries(session.user.id);
            alert('Diary saved successfully!');
        } else {
            console.error(error);
            alert(`Error saving diary: ${error.message}`);
        }
    };

    if (!session) return null;

    const styles = {
        container: {
            padding: '4rem 0',
            maxWidth: '800px',
            margin: '0 auto',
        },
        input: {
            width: '100%',
            padding: '1rem',
            marginBottom: '1rem',
            background: 'var(--color-surface)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 'var(--radius-md)',
            color: 'white',
            fontSize: '1.2rem',
            fontFamily: "'VT323', monospace",
        },
        editor: {
            width: '100%',
            minHeight: '200px',
            padding: '1.5rem',
            background: 'var(--color-surface)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 'var(--radius-md)',
            color: 'white',
            fontSize: '1.1rem',
            marginBottom: '1rem',
            fontFamily: 'inherit',
        },
        toggleLabel: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.5rem',
            cursor: 'pointer',
            fontSize: '1.1rem',
            color: isPublic ? 'var(--color-primary)' : 'var(--color-text-muted)',
            fontWeight: 'bold',
        },
        card: {
            background: 'rgba(255,255,255,0.03)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1rem',
            borderLeft: '4px solid transparent',
        },
        publicTag: {
            display: 'inline-block',
            padding: '0.2rem 0.5rem',
            background: 'var(--color-primary)',
            color: 'white',
            fontSize: '0.8rem',
            borderRadius: '4px',
            marginLeft: '0.5rem',
        }
    };

    return (
        <div className="container" style={styles.container}>
            <h1 style={{ marginBottom: '2rem' }}>My Secret Diary 🔒</h1>

            <div style={{ marginBottom: '4rem' }}>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                    Date: {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>

                <input
                    type="text"
                    placeholder="Diary Title (Optional)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={styles.input}
                />

                <textarea
                    style={styles.editor}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What happened today, Younis? (Only you can see this unless you allow Public)"
                />

                <label style={styles.toggleLabel}>
                    <input
                        type="checkbox"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                        style={{ width: '20px', height: '20px' }}
                    />
                    {isPublic ? '📢 Public (Everyone can see)' : '🔒 Private (Only me)'}
                </label>

                <button onClick={handleSave} className="btn btn-primary">Save Entry</button>
            </div>

            <h2>Past Entries</h2>
            {diaries.map(diary => (
                <div key={diary.id} style={{
                    ...styles.card,
                    borderColor: diary.is_public ? 'var(--color-primary)' : 'transparent'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <small style={{ color: 'var(--color-text-muted)' }}>
                            {new Date(diary.created_at).toLocaleString()}
                        </small>
                        {diary.is_public && <span style={styles.publicTag}>PUBLIC</span>}
                    </div>
                    {diary.title && <h3 style={{ marginBottom: '0.5rem', color: 'var(--color-secondary)' }}>{diary.title}</h3>}
                    <p style={{ whiteSpace: 'pre-wrap' }}>{diary.content}</p>
                </div>
            ))}
        </div>
    );
}
