'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import MapWrapper from '../components/MapWrapper';

export default function MapPage() {
    const [adventures, setAdventures] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdventures = async () => {
            const { data, error } = await supabase
                .from('adventures')
                .select('*')
                .order('created_at', { ascending: false });

            if (data) setAdventures(data);
            if (error) console.error('Error loading map data:', error);
            setLoading(false);
        };

        fetchAdventures();
    }, []);

    const styles = {
        container: {
            padding: '4rem 0',
            maxWidth: '1000px',
            margin: '0 auto',
        },
        header: {
            textAlign: 'center',
            marginBottom: '3rem',
        }
    };

    return (
        <div className="container" style={styles.container}>
            <div style={styles.header}>
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Adventure Map 🗺️</h1>
                <p style={{ color: 'var(--color-text-muted)' }}>
                    Explore the places I've visited! Click the markers to see photos.
                </p>
            </div>

            <MapWrapper adventures={adventures} />
        </div>
    );
}
