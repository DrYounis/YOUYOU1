'use client';
import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { setupCanvas } from '../../lib/drawingHelpers';

const EnglishTracingPad = forwardRef(({ children, onDraw }, ref) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [ctx, setCtx] = useState(null);
    const [currentStroke, setCurrentStroke] = useState(null);
    const strokesRef = useRef([]);

    useImperativeHandle(ref, () => ({
        clear: () => {
            strokesRef.current = [];
            redraw();
            if (onDraw) onDraw();
        },
        undo: () => {
            strokesRef.current.pop();
            redraw();
            if (onDraw) onDraw();
        },
        getStrokes: () => strokesRef.current,
        setStrokes: (saved) => {
            if (saved) {
                strokesRef.current = saved;
                redraw();
            }
        }
    }));

    const redraw = () => {
        if (!canvasRef.current || !ctx) return;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        const dpr = window.devicePixelRatio || 1;
        context.setTransform(dpr, 0, 0, dpr, 0, 0);

        strokesRef.current.forEach(stroke => {
            if (stroke.points.length === 0) return;
            context.beginPath();
            context.lineCap = 'round';
            context.lineJoin = 'round';
            for (let i = 0; i < stroke.points.length; i++) {
                const pt = stroke.points[i];
                if (i === 0) {
                    context.moveTo(pt.x, pt.y);
                } else {
                    context.lineTo(pt.x, pt.y);
                }
            }
            context.strokeStyle = stroke.color;
            context.lineWidth = stroke.width;
            context.stroke();
        });
    };

    useEffect(() => {
        const initCanvas = () => {
             if(canvasRef.current) {
                 const { ctx: initCtx } = setupCanvas(canvasRef.current);
                 setCtx(initCtx);
                 redraw();
             }
        };

        // Delay slighty to ensure container dimensions are set by children
        setTimeout(initCanvas, 100);
        window.addEventListener('resize', initCanvas);
        
        return () => window.removeEventListener('resize', initCanvas);
    }, []);

    const getCoord = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };

    const handlePointerDown = (e) => {
        e.preventDefault();
        setIsDrawing(true);
        const pt = getCoord(e);
        
        // Use Apple pencil pressure or default
        const pressure = e.pointerType === 'pen' ? e.pressure : 0.5;
        const width = 3 + (pressure * 6); // slightly thinner for English letters

        ctx.beginPath();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.moveTo(pt.x, pt.y);
        ctx.strokeStyle = '#2c3e50'; // Dark blue-grey ink
        ctx.lineWidth = width;

        const newStroke = { color: '#2c3e50', width, points: [pt] };
        setCurrentStroke(newStroke);
    };

    const handlePointerMove = (e) => {
        e.preventDefault();
        if (!isDrawing || !ctx) return;
        
        const pt = getCoord(e);
        ctx.lineTo(pt.x, pt.y);
        ctx.stroke();

        setCurrentStroke(prev => ({
            ...prev,
            points: [...prev.points, pt]
        }));
    };

    const handlePointerUp = (e) => {
        e.preventDefault();
        if (!isDrawing) return;
        setIsDrawing(false);
        strokesRef.current.push(currentStroke);
        setCurrentStroke(null);
        if (onDraw) onDraw();
    };

    return (
        <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%', touchAction: 'none' }}>
            {/* The underlying structure */}
            <div style={{ position: 'relative', zIndex: 1, pointerEvents: 'none', width: '100%', height: '100%' }}>
                {children}
            </div>
            
            {/* The transparent canvas mapped precisely over it */}
            <canvas
                ref={canvasRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onPointerOut={handlePointerUp}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10, cursor: 'crosshair', touchAction: 'none' }}
            />
        </div>
    );
});

EnglishTracingPad.displayName = 'EnglishTracingPad';

export default EnglishTracingPad;
