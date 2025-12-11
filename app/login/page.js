"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            alert(error.message);
        } else {
            router.push('/admin/diary');
        }
        setLoading(false);
    };

    const styles = {
        container: {
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        form: {
            background: 'var(--color-surface)',
            padding: '3rem',
            borderRadius: 'var(--radius-lg)',
            width: '100%',
            maxWidth: '400px',
            border: '1px solid rgba(255,255,255,0.1)',
        },
        input: {
            width: '100%',
            padding: '1rem',
            marginBottom: '1rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(0,0,0,0.2)',
            color: 'white',
        }
    };

    return (
        <div className="container" style={styles.container}>
            <form onSubmit={handleLogin} style={styles.form}>
                <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>Private Access</h1>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                    required
                />
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
}
