'use client';
import { useState, useRef } from 'react';
import Navbar from '../../../components/Navbar';
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
        <div className="min-h-screen bg-[#F5F5F5] flex flex-col font-sans">
            <Navbar />
            
            {/* Header Controls */}
            <div className="pt-28 pb-4 px-6 bg-white shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 border-b-4 border-[#000]">
                <div>
                    <h1 className="text-3xl font-black uppercase text-[#1D1D1D] tracking-wider">
                        📝 Dictation 21 Tracer
                    </h1>
                    <p className="text-gray-500 font-bold">Apple Pencil Supported</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-4">
                    {/* Mode Toggle Element */}
                    <div className="flex items-center bg-gray-200 rounded-full p-1 border-2 border-black shadow-[2px_2px_0_#000]">
                        <button 
                            onClick={() => setIsDrawingMode(false)}
                            className={`px-4 py-2 rounded-full font-bold transition-all ${!isDrawingMode ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}
                        >
                            ✋ Scroll Mode
                        </button>
                        <button 
                            onClick={() => setIsDrawingMode(true)}
                            className={`px-4 py-2 rounded-full font-bold transition-all ${isDrawingMode ? 'bg-[#55FFFF] shadow-sm text-black' : 'text-gray-500'}`}
                        >
                            ✏️ Draw Mode
                        </button>
                    </div>

                    <div className="w-px h-8 bg-gray-300 mx-2 hidden md:block"></div>

                    <button 
                        onClick={handleUndo}
                        className="btn btn-outline flex items-center gap-2"
                        style={{ padding: '0.4rem 1.2rem', fontSize: '1.2rem' }}
                        title="Undo Last Stroke"
                    >
                        ↩️ Undo
                    </button>
                    <button 
                        onClick={handleClear}
                        className="btn btn-outline flex items-center gap-2"
                        style={{ padding: '0.4rem 1.2rem', fontSize: '1.2rem', background: '#FFDDDD' }}
                        title="Erase Everything"
                    >
                        🗑️ Clear
                    </button>
                </div>
            </div>

            {/* Document Viewer Area */}
            <div className="flex-grow p-4 md:p-8 flex justify-center items-start overflow-hidden">
                <main className="w-full max-w-4xl bg-white border-4 border-black shadow-[8px_8px_0_#000] relative" style={{ height: '80vh' }}>
                    <DocumentTracer ref={tracerRef} isDrawingMode={isDrawingMode}>
                        <iframe 
                            src="/assets/weekly revision 2nd (2).pdf#toolbar=0" 
                            className="w-full h-full border-none"
                            title="Dictation 21 PDF"
                        />
                    </DocumentTracer>
                </main>
            </div>
            
            {/* Warning when trying to draw in scroll mode */}
            {!isDrawingMode && (
                <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-3 rounded-xl font-bold opacity-80 pointer-events-none transition-opacity">
                    Switch to ✏️ Draw Mode to use your Apple Pencil!
                </div>
            )}
        </div>
    );
}
