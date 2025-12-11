"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function PublicDiaries() {
    const [diaries, setDiaries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPublicDiaries();
    }, []);

    const fetchPublicDiaries = async () => {
        // Fetch only PUBLIC diaries
        const { data, error } = await supabase
            .from('diaries')
            .select('*')
            .eq('is_public', true)
            .order('created_at', { ascending: false });

        if (error) console.error('Error fetching diaries:', error);
        if (data) setDiaries(data);
        setLoading(false);
    };

    const styles = {
        header: {
            textAlign: 'center',
            padding: '4rem 0',
        },
        card: {
            background: 'var(--color-surface)',
            padding: '2rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '2rem',
            border: '1px solid rgba(255,255,255,0.05)',
            boxShadow: 'var(--shadow-sm)',
        },
        date: {
            color: 'var(--color-primary)',
            fontSize: '0.9rem',
            marginBottom: '0.5rem',
            display: 'block',
            fontFamily: "'VT323', monospace",
        },
        title: {
            fontSize: '1.8rem',
            marginBottom: '1rem',
            color: 'white',
        },
        content: {
            fontSize: '1.1rem',
            lineHeight: '1.6',
            color: 'var(--color-text-muted)',
            whiteSpace: 'pre-wrap',
        }
    };

    return (
        <div className="container">
            <div style={styles.header}>
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Younis's Diary 📖</h1>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}>Stories I want to share with the world.</p>
                <Link href="/login" style={{ fontSize: '0.9rem', color: 'var(--color-primary)', textDecoration: 'none' }}>
                    Are you Younis? Login here 🔐
                </Link>
            </div>

            {loading ? (
                <p style={{ textAlign: 'center' }}>Loading stories...</p>
            ) : diaries.length === 0 ? (
                <p style={{ textAlign: 'center', fontSize: '1.2rem' }}>No public stories yet! Check back later.</p>
            ) : (
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    {diaries.map(diary => (
                        <div key={diary.id} style={styles.card}>
                            <span style={styles.date}>
                                {new Date(diary.created_at).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                            {diary.title && <h2 style={styles.title}>{diary.title}</h2>}
                            <p style={styles.content}>{diary.content}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
