'use client';
import { useRef } from 'react';
import EnglishTracingPad from './EnglishTracingPad';

export default function EnglishNotebookView() {
    const padRef = useRef(null);

    const handleClear = () => {
        if (padRef.current) padRef.current.clear();
    };

    const handleUndo = () => {
        if (padRef.current) padRef.current.undo();
    };

    return (
        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Tools Area */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', zIndex: 20 }}>
                <button 
                    onClick={handleUndo}
                    style={{ padding: '0.8rem 1.5rem', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                    ↩️ مراجعة (Undo)
                </button>
                <button 
                    onClick={handleClear}
                    style={{ padding: '0.8rem 1.5rem', background: '#ffecec', color: '#d32f2f', border: '1px solid #ffcdd2', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                    🗑️ مسح الكل (Clear)
                </button>
            </div>

            {/* Notebook Container Box mimics the image layout */}
            <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '700px',
                height: '800px',
                background: '#ffffff',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                borderLeft: '4px solid #da3732', 
                borderRight: '4px solid #da3732',
                borderTop: '2px solid #e0e0e0',
                borderBottom: '2px solid #e0e0e0',
                overflow: 'hidden'
            }}>
                <EnglishTracingPad ref={padRef}>
                    <div style={{ padding: '40px 30px', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
                        
                        {/* Header text */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                            <div style={{ color: '#d83a38', fontStyle: 'italic', fontFamily: 'Georgia, serif', fontSize: '1.8rem', fontWeight: 'bold', borderBottom: '2px solid #d83a38', paddingBottom: '5px' }}>
                                Write in your English notebook
                            </div>
                            <div style={{ color: '#7a5a9c', fontFamily: 'Georgia, serif', fontSize: '1.5rem', borderBottom: '2px solid #7a5a9c', paddingBottom: '3px', marginTop: '40px' }}>
                                20/4/2026
                            </div>
                        </div>

                        {/* Middle Content */}
                        <div style={{ marginTop: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <div style={{ 
                                color: '#683693', 
                                fontFamily: 'Georgia, serif', 
                                fontSize: '6rem', 
                                borderLeft: '2px solid #333', 
                                borderBottom: '2px solid #333', 
                                paddingLeft: '15px', 
                                paddingBottom: '0', 
                                lineHeight: '1',
                                display: 'inline-block'
                            }}>
                                H.W
                            </div>
                        </div>

                        {/* Bottom Text - Made slightly transparent so it looks like tracing lines */}
                        <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#111', fontFamily: 'Georgia, serif', fontSize: '5rem', letterSpacing: '2px', opacity: 0.35 }}>
                            We are happy .
                        </div>

                    </div>
                </EnglishTracingPad>
            </div>
        </div>
    );
}
