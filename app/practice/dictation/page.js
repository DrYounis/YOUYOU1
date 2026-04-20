'use client';
import { useState, useRef } from 'react';
import DocumentTracer from '../../../components/dictation/DocumentTracer';
import DictationTest from '../../../components/dictation/DictationTest';
import MatchingGame from '../../../components/dictation/MatchingGame';
import VoicePractice from '../../../components/dictation/VoicePractice';
import PenDictation from '../../../components/dictation/PenDictation';

export default function InteractiveDictation() {
    const [activeTab, setActiveTab] = useState('pen'); // Defaulting to pen as it is the newest requested feature!
    
    // Document Tracer State
    const [isDrawingMode, setIsDrawingMode] = useState(false);
    const tracerRef = useRef(null);

    const handleClear = () => { if (tracerRef.current) tracerRef.current.clear(); };
    const handleUndo = () => { if (tracerRef.current) tracerRef.current.undo(); };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            background: '#F5F5F5',
            fontFamily: 'var(--font-pixel, "Inter", sans-serif)'
        }}>            
            {/* Header & Main Navigation */}
            <div style={{
                padding: '2rem 1.5rem 1rem 1.5rem',
                background: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                borderBottom: '4px solid #000'
            }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <h1 style={{ fontSize: '2.5rem', fontWeight: '900', textTransform: 'uppercase', color: '#1D1D1D', margin: 0 }}>
                                ⭐️ Dictation Hub
                            </h1>
                            <p style={{ color: '#666', fontWeight: 'bold', margin: '0.5rem 0 0 0' }}>Write, spell, and record!</p>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="custom-scrollbar" style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                        <TabButton 
                            active={activeTab === 'pen'} 
                            onClick={() => setActiveTab('pen')}
                            icon="✍️" label="Pen Dictation" color="#ef4444"
                        />
                        <TabButton 
                            active={activeTab === 'spell'} 
                            onClick={() => setActiveTab('spell')}
                            icon="⌨️" label="Listen & Spell" color="#3b82f6"
                        />
                        <TabButton 
                            active={activeTab === 'match'} 
                            onClick={() => setActiveTab('match')}
                            icon="🧩" label="Match Picture" color="#8b5cf6"
                        />
                        <TabButton 
                            active={activeTab === 'voice'} 
                            onClick={() => setActiveTab('voice')}
                            icon="🎙️" label="Voice Practice" color="#10b981"
                        />
                        <TabButton 
                            active={activeTab === 'document'} 
                            onClick={() => setActiveTab('document')}
                            icon="📄" label="Print PDF View" color="#f59e0b"
                        />
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div style={{
                flexGrow: 1,
                padding: '2rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start'
            }}>
                <main style={{
                    width: '100%',
                    maxWidth: '1000px',
                    background: 'white',
                    border: '4px solid black',
                    boxShadow: '8px 8px 0px #000',
                    borderRadius: '16px',
                    overflow: 'hidden'
                }}>
                    
                    {/* Render The Active Game Mode */}
                    {activeTab === 'pen' && <PenDictation />}

                    {activeTab === 'spell' && <DictationTest />}
                    
                    {activeTab === 'match' && <MatchingGame />}
                    
                    {activeTab === 'voice' && <VoicePractice />}

                    {/* Legacy iPad PDF Tracer */}
                    <div style={{ display: activeTab === 'document' ? 'block' : 'none', height: '75vh', position: 'relative' }}>
                        
                        <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 100, display: 'flex', gap: '0.5rem' }}>
                            <div style={{
                                display: 'flex', background: '#e5e7eb', borderRadius: '50px', padding: '4px', border: '2px solid black'
                            }}>
                                <button onClick={() => setIsDrawingMode(false)} style={getModeStyle(!isDrawingMode)}>✋ Scroll</button>
                                <button onClick={() => setIsDrawingMode(true)} style={getModeStyle(isDrawingMode, '#55FFFF')}>✏️ Draw</button>
                            </div>
                            <button onClick={handleUndo} style={getToolStyle('white')}>↩️ Undo</button>
                            <button onClick={handleClear} style={getToolStyle('#FFDDDD')}>🗑️ Clear</button>
                        </div>

                        <DocumentTracer ref={tracerRef} isDrawingMode={isDrawingMode}>
                            <iframe 
                                src="/assets/weekly revision 2nd (2).pdf#toolbar=0" 
                                title="Dictation 21 PDF"
                                style={{ width: '100%', height: '100%', border: 'none', background: 'white' }}
                            />
                        </DocumentTracer>

                        {!isDrawingMode && (
                            <div style={{
                                position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
                                background: 'rgba(0,0,0,0.8)', color: 'white', padding: '0.8rem 1.5rem',
                                borderRadius: '12px', fontWeight: 'bold', pointerEvents: 'none', zIndex: 1000
                            }}>
                                Switch to ✏️ Draw Mode to use your Apple Pencil!
                            </div>
                        )}
                    </div>

                </main>
            </div>
            
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { height: 8px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 4px; }
            `}</style>
        </div>
    );
}

// Helper Components & Styles
function TabButton({ active, onClick, icon, label, color }) {
    return (
        <button onClick={onClick} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '1rem 1.5rem',
            background: active ? color : '#f3f4f6',
            color: active ? 'white' : '#6b7280',
            border: active ? '3px solid #000' : '3px solid transparent',
            borderRadius: '16px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: active ? '0 4px 0 #000' : 'none',
            transform: active ? 'translateY(-2px)' : 'none',
            whiteSpace: 'nowrap'
        }}>
            <span style={{ fontSize: '1.5rem' }}>{icon}</span> {label}
        </button>
    );
}

function getModeStyle(isActive, color = 'white') {
    return {
        padding: '0.5rem 1rem', borderRadius: '50px', fontWeight: 'bold', border: 'none', cursor: 'pointer', transition: 'all 0.2s',
        background: isActive ? color : 'transparent', color: isActive ? 'black' : '#6b7280',
        boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
    };
}

function getToolStyle(background) {
    return {
        padding: '0.5rem 1rem', fontSize: '1.1rem', fontWeight: 'bold', background, color: 'black',
        border: '2px solid black', borderRadius: '8px', cursor: 'pointer', boxShadow: '2px 2px 0px #000'
    };
}
