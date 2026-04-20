'use client';
import { useState, useRef, useEffect } from 'react';
import { dictationWords, playAudio } from './dictionary';
import { setupCanvas } from '../../lib/drawingHelpers';

export default function PenDictation() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const canvasRef = useRef(null);
    const [ctx, setCtx] = useState(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const currentStrokeRef = useRef(null);
    const strokesRef = useRef([]);

    const currentItem = dictationWords[currentIndex];

    // Initialize Canvas
    const initCanvas = () => {
        if (canvasRef.current) {
            const { ctx: initCtx } = setupCanvas(canvasRef.current);
            setCtx(initCtx);
            clearCanvas(initCtx, canvasRef.current);
        }
    };

    useEffect(() => {
        // Slight delay to handle React mounting sizing accurately
        const timer = setTimeout(initCanvas, 100);
        window.addEventListener('resize', initCanvas);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', initCanvas);
        };
    }, []);

    // Drawing Logic (Matching TracingPad exactly)
    const redraw = (context, canvas) => {
        if (!context || !canvas) return;
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw primary writing guidelines
        context.beginPath();
        context.moveTo(0, canvas.height / 2);
        context.lineTo(canvas.width, canvas.height / 2);
        context.strokeStyle = 'rgba(255, 0, 0, 0.4)'; // Red dotted line standard
        context.lineWidth = 2;
        context.setLineDash([10, 10]);
        context.stroke();
        context.setLineDash([]); // Reset dash for pen ink!

        const dpr = window.devicePixelRatio || 1;
        context.setTransform(dpr, 0, 0, dpr, 0, 0);

        strokesRef.current.forEach(stroke => {
            if (stroke.points.length === 0) return;
            context.beginPath();
            context.lineCap = 'round';
            context.lineJoin = 'round';
            for (let i = 0; i < stroke.points.length; i++) {
                const pt = stroke.points[i];
                if (i === 0) context.moveTo(pt.x, pt.y);
                else context.lineTo(pt.x, pt.y);
            }
            context.strokeStyle = stroke.color;
            context.lineWidth = stroke.width;
            context.stroke();
        });
    };

    const clearCanvas = (overrideCtx = null, overrideCanvas = null) => {
        strokesRef.current = [];
        const context = overrideCtx || ctx;
        const canvas = overrideCanvas || canvasRef.current;
        if (context && canvas) redraw(context, canvas);
    };

    const undoStroke = () => {
        strokesRef.current.pop();
        if (ctx && canvasRef.current) redraw(ctx, canvasRef.current);
    };

    const getCoord = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left),
            y: (e.clientY - rect.top)
        };
    };

    const handlePointerDown = (e) => {
        e.preventDefault();
        setIsDrawing(true);
        const pt = getCoord(e);
        
        // Apply robust Apple pencil pressure tracking for physical handwriting
        const pressure = e.pointerType === 'pen' ? e.pressure : 0.5;
        const width = 3 + (pressure * 6); // Beautiful dynamic ink sizing

        ctx.beginPath();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.moveTo(pt.x, pt.y);
        ctx.strokeStyle = '#2c3e50'; // standard ink color
        ctx.lineWidth = width;

        currentStrokeRef.current = { color: '#2c3e50', width, points: [pt] };
    };

    const handlePointerMove = (e) => {
        e.preventDefault();
        if (!isDrawing || !ctx) return;
        
        const pt = getCoord(e);
        ctx.lineTo(pt.x, pt.y);
        ctx.stroke();

        currentStrokeRef.current.points.push(pt);
    };

    const handlePointerUp = (e) => {
        e.preventDefault();
        if (!isDrawing) return;
        setIsDrawing(false);
        strokesRef.current.push(currentStrokeRef.current);
        currentStrokeRef.current = null;
    };

    // UI Logic
    const handleNextWord = () => {
        setCurrentIndex((prev) => (prev + 1) % dictationWords.length);
        setShowAnswer(false);
        clearCanvas(ctx, canvasRef.current); // wipe board!
    };

    const handlePrevWord = () => {
        setCurrentIndex((prev) => (prev - 1 + dictationWords.length) % dictationWords.length);
        setShowAnswer(false);
        clearCanvas(ctx, canvasRef.current);
    };

    return (
        <div style={{ padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', height: '100%', minHeight: '600px' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>✍️ Pen Dictation</h2>
            <p style={{ color: '#666', fontWeight: 'bold', marginBottom: '1.5rem' }}>See the picture and write it using your Apple Pencil!</p>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem', marginBottom: '1rem' }}>
                <button onClick={handlePrevWord} style={{ fontSize: '3rem', background: 'none', border: 'none', cursor: 'pointer', transition: 'transform 0.2s' }}>⬅️</button>
                
                {/* The Picture Prompt */}
                <div style={{ 
                    border: '6px solid #000', 
                    borderRadius: '24px', 
                    padding: '2rem', 
                    width: '250px',
                    height: '250px',
                    boxShadow: '10px 10px 0 #000',
                    background: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <div style={{ fontSize: '8rem', lineHeight: '1' }}>{currentItem.emoji}</div>
                    
                    {/* Optional Audio Playback */}
                    <button 
                        onClick={() => playAudio(currentItem.word)}
                        style={{
                            marginTop: '1rem', background: '#3b82f6', color: 'white', padding: '0.5rem 1rem',
                            border: '3px solid #1d4ed8', borderRadius: '12px',
                            fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer',
                            boxShadow: '0 4px 0 #1d4ed8', width: '100%'
                        }}
                    >
                        🔊 Listen
                    </button>
                </div>

                <button onClick={handleNextWord} style={{ fontSize: '3rem', background: 'none', border: 'none', cursor: 'pointer', transition: 'transform 0.2s' }}>➡️</button>
            </div>

            {/* The Handwriting Box */}
            <div style={{ position: 'relative', flexGrow: 1, border: '4px dashed #9ca3af', borderRadius: '16px', marginTop: '1rem', background: 'white', minHeight: '200px' }}>
                <canvas
                    ref={canvasRef}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                    onPointerOut={handlePointerUp}
                    style={{ 
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
                        zIndex: 10, cursor: 'crosshair', touchAction: 'none' 
                    }}
                />
            </div>

            {/* Editing Controls & Check Answer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', padding: '0 1rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={undoStroke} className="btn-tool" style={{ background: 'white' }}>↩️ Undo</button>
                    <button onClick={() => clearCanvas(ctx, canvasRef.current)} className="btn-tool" style={{ background: '#fee2e2', color: '#b91c1c' }}>🗑️ Clear</button>
                </div>

                {!showAnswer ? (
                    <button 
                        onClick={() => setShowAnswer(true)} 
                        style={{
                            background: '#10b981', color: 'white', padding: '1rem 2.5rem',
                            fontSize: '1.5rem', border: 'none', borderRadius: '16px',
                            cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 6px 0 #059669',
                            transition: 'transform 0.1s'
                        }}
                    >
                        Show Answer 👀
                    </button>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ fontSize: '2rem', fontWeight: '900', color: '#16a34a', textTransform: 'uppercase', letterSpacing: '2px', background: '#dcfce7', padding: '0.5rem 1.5rem', borderRadius: '12px', border: '4px solid #16a34a' }}>
                            {currentItem.word}
                        </div>
                        <button 
                            onClick={handleNextWord} 
                            style={{
                                background: '#f59e0b', color: 'white', padding: '1rem 2rem',
                                fontSize: '1.5rem', border: 'none', borderRadius: '16px',
                                cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 6px 0 #d97706'
                            }}
                        >
                            Next Word ➡️
                        </button>
                    </div>
                )}
            </div>

            <style jsx>{`
                .btn-tool {
                    padding: 0.8rem 1.5rem;
                    fontSize: 1.2rem;
                    fontWeight: bold;
                    border: 3px solid black;
                    borderRadius: 12px;
                    cursor: pointer;
                    boxShadow: 3px 3px 0 #000;
                    transition: transform 0.1s;
                }
                .btn-tool:active { transform: translateY(3px); boxShadow: 0px 0px 0 #000; }
            `}</style>
        </div>
    );
}
