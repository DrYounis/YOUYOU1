'use client';

import dynamic from 'next/dynamic';

const MapClient = dynamic(() => import('./MapClient'), {
    ssr: false,
    loading: () => (
        <div style={{
            height: '600px',
            width: '100%',
            background: '#e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--radius-md)',
            border: '4px solid #000'
        }}>
            <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '1.5rem' }}>Loading World Map...</p>
        </div>
    )
});

export default function MapWrapper({ adventures }) {
    return <MapClient adventures={adventures} />;
}
