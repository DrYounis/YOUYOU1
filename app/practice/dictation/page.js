'use client';
import { useState, useRef, useEffect } from 'react';
import DocumentTracer from '../../../components/dictation/DocumentTracer';

export default function DictationPractice() {
    const [isDrawingMode, setIsDrawingMode] = useState(false);
    const tracerRef = useRef(null);

    const handleClear = () => {
        if (tracerRef.current) tracerRef.current.clear();
    };

    const handleUndo = () => {
        if (tracerRef.current) tracerRef.current.undo();
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            background: '#F5F5F5',
            fontFamily: 'var(--font-pixel, "Inter", sans-serif)'
        }}>            
            {/* Header Controls */}
            <div style={{
                padding: '2rem 1.5rem',
                background: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                borderBottom: '4px solid #000'
            }}>
                <div>
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: '900',
                        textTransform: 'uppercase',
                        color: '#1D1D1D',
                        letterSpacing: '1px',
                        margin: 0
                    }}>
                        📝 Dictation 21 Tracer
                    </h1>
                    <p style={{
                        color: '#666',
                        fontWeight: 'bold',
                        margin: '0.5rem 0 0 0'
                    }}>Apple Pencil Supported</p>
                </div>
                
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    {/* Mode Toggle Element */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: '#e5e7eb',
                        borderRadius: '50px',
                        padding: '4px',
                        border: '2px solid black',
                        boxShadow: '2px 2px 0px #000',
                        gap: '4px'
                    }}>
                        <button 
                            onClick={() => setIsDrawingMode(false)}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '50px',
                                fontWeight: 'bold',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                background: !isDrawingMode ? 'white' : 'transparent',
                                color: !isDrawingMode ? 'black' : '#6b7280',
                                boxShadow: !isDrawingMode ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                            }}
                        >
                            ✋ Scroll Mode
                        </button>
                        <button 
                            onClick={() => setIsDrawingMode(true)}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '50px',
                                fontWeight: 'bold',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                background: isDrawingMode ? '#55FFFF' : 'transparent',
                                color: isDrawingMode ? 'black' : '#6b7280',
                                boxShadow: isDrawingMode ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                            }}
                        >
                            ✏️ Draw Mode
                        </button>
                    </div>

                    <div style={{ width: '1px', height: '32px', background: '#d1d5db', margin: '0 0.5rem' }}></div>

                    <button 
                        onClick={handleUndo}
                        style={{
                            padding: '0.5rem 1.2rem',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            background: 'white',
                            color: 'black',
                            border: '2px solid black',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            boxShadow: '2px 2px 0px #000'
                        }}
                    >
                        ↩️ Undo
                    </button>
                    <button 
                        onClick={handleClear}
                        style={{
                            padding: '0.5rem 1.2rem',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            background: '#FFDDDD',
                            color: 'black',
                            border: '2px solid black',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            boxShadow: '2px 2px 0px #000'
                        }}
                    >
                        🗑️ Clear
                    </button>
                </div>
            </div>

            {/* Document Viewer Area */}
            <div style={{
                flexGrow: 1,
                padding: '2rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                overflow: 'hidden'
            }}>
                {/* Fixed size window to match typical iPad/A4 aspect ratio */}
                <main style={{
                    width: '100%',
                    maxWidth: '900px',
                    height: '75vh',
                    background: 'white',
                    border: '4px solid black',
                    boxShadow: '8px 8px 0px #000',
                    position: 'relative'
                }}>
                    <DocumentTracer ref={tracerRef} isDrawingMode={isDrawingMode}>
                        <iframe 
                            src="/assets/weekly revision 2nd (2).pdf#toolbar=0" 
                            title="Dictation 21 PDF"
                            style={{
                                width: '100%',
                                height: '100%',
                                border: 'none',
                                background: 'white'
                            }}
                        />
                    </DocumentTracer>
                </main>
            </div>
            
            {/* Warning when trying to draw in scroll mode */}
            {!isDrawingMode && (
                <div style={{
                    position: 'fixed',
                    bottom: '2rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(0,0,0,0.8)',
                    color: 'white',
                    padding: '0.8rem 1.5rem',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                    pointerEvents: 'none',
                    zIndex: 1000
                }}>
                    Switch to ✏️ Draw Mode to use your Apple Pencil!
                </div>
            )}
        </div>
    );
}
