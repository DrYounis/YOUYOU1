import { useState, useRef } from 'react';
import { dictationWords, playAudio } from './dictionary';

export default function VoicePractice() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const currentItem = dictationWords[currentIndex];

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const audioUrl = URL.createObjectURL(audioBlob);
                setAudioUrl(audioUrl);
                // Stop tracks to release mic
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            setAudioUrl(null);
        } catch (error) {
            console.error("Microphone access denied or not supported.", error);
            alert("Microphone access is required to practice your voice!");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const nextWord = () => {
        setAudioUrl(null);
        setCurrentIndex((prev) => (prev + 1) % dictationWords.length);
    };

    const prevWord = () => {
        setAudioUrl(null);
        setCurrentIndex((prev) => (prev - 1 + dictationWords.length) % dictationWords.length);
    };

    return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Listen & Record 🎙️</h2>
            <p style={{ color: '#666', fontWeight: 'bold', marginBottom: '2rem' }}>
                Listen to the native pronunciation, then try to say it yourself!
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem', marginBottom: '3rem' }}>
                <button onClick={prevWord} style={{ fontSize: '2rem', background: 'none', border: 'none', cursor: 'pointer' }}>⬅️</button>
                
                <div style={{ 
                    border: '4px solid #000', 
                    borderRadius: '24px', 
                    padding: '2rem', 
                    width: '300px',
                    boxShadow: '8px 8px 0 #000',
                    background: 'white'
                }}>
                    <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>{currentItem.emoji}</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
                        {currentItem.word}
                    </div>
                    
                    <button 
                        onClick={() => playAudio(currentItem.word)}
                        style={{
                            background: '#14b8a6', color: 'white', padding: '0.8rem 1.5rem',
                            border: '3px solid #0f766e', borderRadius: '12px',
                            fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer',
                            boxShadow: '0 4px 0 #0f766e', width: '100%'
                        }}
                    >
                        🔊 Listen
                    </button>
                </div>

                <button onClick={nextWord} style={{ fontSize: '2rem', background: 'none', border: 'none', cursor: 'pointer' }}>➡️</button>
            </div>

            <div style={{ background: '#f3f4f6', padding: '2rem', borderRadius: '16px', border: '2px solid #e5e7eb', maxWidth: '500px', margin: '0 auto' }}>
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Your Voice</h3>
                
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    {!isRecording ? (
                        <button 
                            onClick={startRecording}
                            style={{
                                background: '#ef4444', color: 'white', padding: '1rem 2rem', border: 'none',
                                borderRadius: '50px', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer',
                                boxShadow: '0 4px 10px rgba(239, 68, 68, 0.4)', display: 'flex', alignItems: 'center', gap: '0.5rem'
                            }}
                        >
                            🔴 Start Recording
                        </button>
                    ) : (
                        <button 
                            onClick={stopRecording}
                            style={{
                                background: '#374151', color: 'white', padding: '1rem 2rem', border: 'none',
                                borderRadius: '50px', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer',
                                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)', display: 'flex', alignItems: 'center', gap: '0.5rem',
                                animation: 'pulse 1.5s infinite'
                            }}
                        >
                            ⏹️ Stop Recording
                        </button>
                    )}
                </div>

                {audioUrl && (
                    <div style={{ marginTop: '1.5rem' }}>
                        <p style={{ fontWeight: 'bold', color: '#16a34a', marginBottom: '0.5rem' }}>✅ Recorded successfully!</p>
                        <audio src={audioUrl} controls style={{ width: '100%' }} />
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
            `}</style>
        </div>
    );
}
