'use client';
import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { setupCanvas } from '../../lib/drawingHelpers';

const DocumentTracer = forwardRef(({ children, onDraw, isDrawingMode }, ref) => {
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
             if(canvasRef.current && containerRef.current) {
                 // Important: match canvas size to the underlying document height fully if possible!
                 // In an iframe scenario, the iframe handles its own scroll, so we just match the visible container
                 const { ctx: initCtx } = setupCanvas(canvasRef.current);
                 setCtx(initCtx);
                 redraw();
             }
        };

        // Delay slightly giving the iframe/document time to mount
        const timer = setTimeout(initCanvas, 300);
        window.addEventListener('resize', initCanvas);
        
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', initCanvas);
        }
    }, [isDrawingMode]); // Re-init on mode switch just in case of layout shifts

    const getCoord = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };

    const handlePointerDown = (e) => {
        if (!isDrawingMode) return;
        
        e.preventDefault();
        setIsDrawing(true);
        const pt = getCoord(e);
        
        const pressure = e.pointerType === 'pen' ? e.pressure : 0.5;
        const width = 2 + (pressure * 4); // Fine tip for Dictation test details

        ctx.beginPath();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.moveTo(pt.x, pt.y);
        ctx.strokeStyle = '#1e3a8a'; // Ink blue color for dictation
        ctx.lineWidth = width;

        const newStroke = { color: '#1e3a8a', width, points: [pt] };
        setCurrentStroke(newStroke);
    };

    const handlePointerMove = (e) => {
        if (!isDrawingMode || !isDrawing || !ctx) return;
        
        e.preventDefault();
        const pt = getCoord(e);
        ctx.lineTo(pt.x, pt.y);
        ctx.stroke();

        setCurrentStroke(prev => ({
            ...prev,
            points: [...prev.points, pt]
        }));
    };

    const handlePointerUp = (e) => {
        if (!isDrawingMode || !isDrawing) return;
        
        e.preventDefault();
        setIsDrawing(false);
        strokesRef.current.push(currentStroke);
        setCurrentStroke(null);
        if (onDraw) onDraw();
    };

    return (
        <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
            
            {/* The Document / PDF Iframe goes here. If drawing mode is ON, it ignores pointers so canvas gets them. */}
            <div style={{ 
                position: 'relative', 
                zIndex: 1, 
                width: '100%', 
                height: '100%',
                pointerEvents: isDrawingMode ? 'none' : 'auto' 
            }}>
                {children}
            </div>
            
            {/* The transparent drawing layer. */}
            <canvas
                ref={canvasRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onPointerOut={handlePointerUp}
                style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    width: '100%', 
                    height: '100%', 
                    zIndex: 10, 
                    cursor: isDrawingMode ? 'crosshair' : 'default', 
                    pointerEvents: isDrawingMode ? 'auto' : 'none',
                    touchAction: isDrawingMode ? 'none' : 'auto'
                }}
            />
        </div>
    );
});

DocumentTracer.displayName = 'DocumentTracer';

export default DocumentTracer;
