'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon missing in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const styles = {
    map: {
        height: '600px',
        width: '100%',
        borderRadius: 'var(--radius-md)',
        border: '4px solid #000',
        boxShadow: 'var(--shadow-pixel)',
        zIndex: 1, // Ensure map stays below standard overlays but above background
    },
    popupImage: {
        width: '100%',
        borderRadius: '4px',
        marginTop: '0.5rem',
        marginBottom: '0.5rem',
    },
    popupTitle: {
        fontFamily: 'var(--font-pixel)',
        fontSize: '1.25rem',
        marginBottom: '0',
        fontWeight: 'bold',
    },
    popupDesc: {
        fontSize: '0.9rem',
        margin: '0',
    }
};

export default function MapClient({ adventures }) {
    // Default center (Riyadh approx) or center on first adventure
    const center = adventures.length > 0
        ? [adventures[0].latitude, adventures[0].longitude]
        : [24.7136, 46.6753];

    return (
        <MapContainer center={center} zoom={13} style={styles.map} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {adventures.map((adv) => (
                <Marker key={adv.id} position={[adv.latitude, adv.longitude]}>
                    <Popup>
                        <div style={{ minWidth: '200px' }}>
                            <h3 style={styles.popupTitle}>{adv.title}</h3>
                            {adv.media_url && (
                                <img
                                    src={adv.media_url}
                                    alt={adv.title}
                                    style={styles.popupImage}
                                />
                            )}
                            <p style={styles.popupDesc}>{adv.description}</p>
                            <small style={{ color: '#666' }}>
                                {new Date(adv.created_at).toLocaleDateString()}
                            </small>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
