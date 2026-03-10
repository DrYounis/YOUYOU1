'use client';
import { useState, useRef, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import * as templates from './components/drawingTemplates';

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 800;
const TITLE_HEIGHT = 80;
const DRAWING_Y_OFFSET = 120;
const FOOTER_HEIGHT = 60;

// Website URL for branding on printed pages
const WEBSITE_URL = 'younis-adventures.vercel.app/kids-tools';

const TEMPLATES = {
  animal: ['🐶 dog', '🐱 cat', '🐰 bunny', '🐘 elephant', '🦒 giraffe', '🦁 lion', '🐸 frog'],
  vehicle: ['🚗 car', '🚜 tractor', '✈️ airplane', '🚂 train', '🚲 bicycle', '🚀 rocket', '🚢 ship'],
  nature: ['🌳 tree', '🌻 sunflower', '🌈 rainbow', '☁️ cloud', '🐞 ladybug', '🌙 moon', '⭐ star'],
  fantasy: ['🦄 unicorn', '🐉 dragon', '🧚 fairy', '🏰 castle', '👑 crown', '🤖 robot', '👻 ghost']
};

const DRAWING_MAP = {
  dinosaur: templates.drawDinosaur,
  dog: templates.drawDog,
  cat: templates.drawCat,
  car: templates.drawCar,
  butterfly: templates.drawButterfly,
  flower: templates.drawFlower,
  tree: templates.drawTree,
  rocket: templates.drawRocket,
  castle: templates.drawCastle,
  robot: templates.drawRobot,
  unicorn: templates.drawUnicorn,
  lion: templates.drawLion,
  frog: templates.drawFrog,
  ship: templates.drawShip,
  moon: templates.drawMoon,
  star: templates.drawStar,
  rainbow: templates.drawRainbow,
  default: { main: templates.drawSun, extra: templates.drawSimpleAnimal }
};

const KEYWORD_MAP = {
  dinosaur: ['dinosaur', 'dino'],
  dog: ['dog', 'puppy'],
  cat: ['cat', 'kitty'],
  car: ['car', 'truck', 'vehicle'],
  flower: ['flower', 'sunflower'],
  rocket: ['rocket', 'space'],
  unicorn: ['unicorn', 'horse'],
  ship: ['ship', 'boat'],
};

export default function KidsTools() {
  const canvasRef = useRef(null);
  const [drawingSubject, setDrawingSubject] = useState('happy dinosaur');
  const [lineThickness, setLineThickness] = useState(5);
  const [addBorder, setAddBorder] = useState(true);
  const [addInstructions, setAddInstructions] = useState(false);
  const [useAI, setUseAI] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [coloringTitle, setColoringTitle] = useState("My Coloring Page");
  const [drawingsPerPage, setDrawingsPerPage] = useState(1);
  const [addWebsiteFooter, setAddWebsiteFooter] = useState(true); // Show website footer for traffic

  useEffect(() => {
    generateDrawing();
  }, []);

  const setPreset = (category) => {
    const items = TEMPLATES[category];
    const randomItem = items[Math.floor(Math.random() * items.length)];
    setDrawingSubject(randomItem);
    setTimeout(() => generateDrawing(), 100);
  };

  const findDrawingFunction = (subject) => {
    const subjectLower = subject.toLowerCase();
    
    for (const [key, keywords] of Object.entries(KEYWORD_MAP)) {
      if (keywords.some(kw => subjectLower.includes(kw))) {
        return DRAWING_MAP[key] || DRAWING_MAP.default;
      }
    }
    
    for (const [key, drawFunc] of Object.entries(DRAWING_MAP)) {
      if (subjectLower.includes(key)) {
        return drawFunc;
      }
    }
    
    return DRAWING_MAP.default;
  };

  const generateTemplateDrawing = (ctx, subject, thickness) => {
    const drawFunc = findDrawingFunction(subject);
    const x = 250;
    const y = 300;

    if (typeof drawFunc === 'function') {
      drawFunc(ctx, x, y, thickness);
    } else if (drawFunc.main) {
      drawFunc.main(ctx, 300, 200, thickness);
      if (subject.toLowerCase().includes('animal')) {
        drawFunc.extra(ctx, x, y, thickness);
      }
    }
  };

  const generateDrawing = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const thickness = lineThickness;

    // Clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw border
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    ctx.strokeRect(20, 20, CANVAS_WIDTH - 40, CANVAS_HEIGHT - 40);

    // Add title
    ctx.fillStyle = '#333';
    ctx.font = 'bold 24px "Comic Sans MS", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(coloringTitle || 'My Coloring Page', CANVAS_WIDTH / 2, TITLE_HEIGHT);
    ctx.textAlign = 'left';

    if (useAI) {
      await generateAIDrawing(ctx, thickness);
    } else {
      generateTemplateDrawing(ctx, drawingSubject, thickness);
    }

    // Add decorative border
    if (addBorder) {
      drawDecorativeBorder(ctx);
    }

    // Add instructions
    if (addInstructions) {
      ctx.fillStyle = '#666';
      ctx.font = '16px "Comic Sans MS", Arial, sans-serif';
      ctx.fillText('🖍️ Color me!', 50, 100);
      ctx.fillText('✏️ Draw carefully!', 400, 100);
    }

    // Add name line
    ctx.strokeStyle = '#999';
    ctx.beginPath();
    ctx.moveTo(400, CANVAS_HEIGHT - 100);
    ctx.lineTo(550, CANVAS_HEIGHT - 100);
    ctx.stroke();
    ctx.fillStyle = '#999';
    ctx.font = '14px Arial';
    ctx.fillText('Your name:', 300, CANVAS_HEIGHT - 90);

    // Add website footer for viral traffic (if enabled)
    if (addWebsiteFooter) {
      drawWebsiteFooter(ctx);
    }
  };

  const generateAIDrawing = async (ctx, thickness) => {
    setIsGenerating(true);
    try {
      const prompt = encodeURIComponent(
        `simple black and white line drawing coloring page for kids, ${drawingSubject}, thick outlines, white background, cartoon style, no shading, no colors, just black lines on white`
      );
      
      const aiUrl = `https://image.pollinations.ai/prompt/${prompt}?width=600&height=800&nologo=true&seed=${Math.floor(Math.random() * 1000)}`;
      
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = aiUrl;
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        setTimeout(resolve, 10000);
      });
      
      ctx.drawImage(img, 50, DRAWING_Y_OFFSET, 500, CANVAS_HEIGHT - DRAWING_Y_OFFSET - 100);
    } catch (error) {
      generateTemplateDrawing(ctx, drawingSubject, thickness);
    } finally {
      setIsGenerating(false);
    }
  };

  const drawDecorativeBorder = (ctx) => {
    ctx.strokeStyle = '#4834d4';
    ctx.lineWidth = 3;
    ctx.setLineDash([]);

    for (let i = 30; i < CANVAS_WIDTH - 30; i += 40) {
      ctx.beginPath();
      ctx.arc(i, 30, 5, 0, Math.PI * 2);
      ctx.strokeStyle = '#ff6b6b';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(i, CANVAS_HEIGHT - 30 - FOOTER_HEIGHT, 5, 0, Math.PI * 2);
      ctx.stroke();
    }
  };

  const drawWebsiteFooter = (ctx) => {
    // Footer background
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, CANVAS_HEIGHT - FOOTER_HEIGHT, CANVAS_WIDTH, FOOTER_HEIGHT);
    
    // Top border
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, CANVAS_HEIGHT - FOOTER_HEIGHT);
    ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT - FOOTER_HEIGHT);
    ctx.stroke();

    // Main text
    ctx.fillStyle = '#667eea';
    ctx.font = 'bold 16px "Comic Sans MS", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🎨 More FREE coloring pages at:', CANVAS_WIDTH / 2, CANVAS_HEIGHT - 35);

    // Website URL (large and prominent)
    ctx.fillStyle = '#4834d4';
    ctx.font = 'bold 20px Arial, sans-serif';
    ctx.fillText(WEBSITE_URL, CANVAS_WIDTH / 2, CANVAS_HEIGHT - 15);

    // Decorative elements
    ctx.font = '14px Arial';
    ctx.fillStyle = '#764ba2';
    ctx.fillText('✨ AI draws ANYTHING! ✨', CANVAS_WIDTH / 2, CANVAS_HEIGHT - 5);

    ctx.textAlign = 'left';
  };

  const randomGenerate = () => {
    const categories = Object.keys(TEMPLATES);
    const randomCat = categories[Math.floor(Math.random() * categories.length)];
    setPreset(randomCat);
  };

  const downloadPDF = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
    pdf.save(`${coloringTitle || 'coloring-page'}.pdf`);
  };

  const printPaper = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const printWindow = window.open('', '', 'height=800,width=600');
    printWindow.document.write('<html><head><title>Print Drawing</title>');
    printWindow.document.write('</head><body style="margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;">');
    printWindow.document.write('<img src="' + canvas.toDataURL('image/png') + '" style="max-width:100%;height:auto;" />');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      padding: '2rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: '"Comic Sans MS", "Chalkboard SE", Arial, sans-serif',
    },
    wrapper: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    title: {
      textAlign: 'center',
      color: 'white',
      fontSize: '2.5em',
      textShadow: '3px 3px 0px #4834d4',
      marginBottom: '30px',
    },
    card: {
      background: 'white',
      borderRadius: '20px',
      padding: '30px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '30px',
    },
    controlsPanel: {
      background: '#f8f9fa',
      borderRadius: '15px',
      padding: '20px',
    },
    controlGroup: {
      marginBottom: '20px',
      borderBottom: '2px solid #e0e0e0',
      paddingBottom: '15px',
    },
    groupTitle: {
      color: '#4834d4',
      marginTop: '0',
      marginBottom: '15px',
      fontSize: '1.2em',
    },
    label: {
      display: 'block',
      margin: '10px 0 5px',
      color: '#333',
      fontWeight: 'bold',
    },
    input: {
      width: '100%',
      padding: '10px',
      border: '2px solid #e0e0e0',
      borderRadius: '10px',
      fontSize: '16px',
      marginBottom: '10px',
    },
    checkboxGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      margin: '10px 0',
    },
    checkboxLabel: {
      margin: '0',
    },
    button: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      padding: '15px 30px',
      borderRadius: '50px',
      fontSize: '18px',
      fontWeight: 'bold',
      cursor: 'pointer',
      width: '100%',
      transition: 'transform 0.2s',
      fontFamily: 'inherit',
    },
    previewPanel: {
      textAlign: 'center',
    },
    canvas: {
      width: '100%',
      maxWidth: '600px',
      height: 'auto',
      border: '5px solid #4834d4',
      borderRadius: '10px',
      boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
      background: 'white',
      marginBottom: '15px',
    },
    actionButtons: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '10px',
    },
    secondaryBtn: {
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      fontSize: '16px',
      padding: '12px',
    },
    presetButtons: {
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap',
      margin: '15px 0',
    },
    presetBtn: {
      background: '#e0e0e0',
      color: '#333',
      padding: '8px 15px',
      fontSize: '14px',
      flex: '1',
      minWidth: '80px',
    },
    footer: {
      textAlign: 'center',
      marginTop: '20px',
      color: 'white',
    },
    thicknessDisplay: {
      marginLeft: '10px',
      color: '#666',
    },
  };

  return (
    <div style={styles.container}>
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printArea, #printArea * {
            visibility: visible;
          }
          #printArea {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
          }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>

      <div style={styles.wrapper}>
        <h1 style={styles.title}>🎨 Kids Coloring Paper Generator 🖍️</h1>

        <div style={styles.card}>
          <div style={styles.grid}>
            <div style={styles.controlsPanel}>
              {/* AI Mode Toggle */}
              <div style={styles.controlGroup}>
                <h3 style={styles.groupTitle}>🤖 Drawing Mode</h3>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                  <button
                    onClick={() => setUseAI(true)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '10px',
                      border: useAI ? '3px solid #667eea' : '2px solid #e0e0e0',
                      background: useAI ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f8f9fa',
                      color: useAI ? 'white' : '#333',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    🤖 AI Magic (Draws ANYTHING!)
                  </button>
                  <button
                    onClick={() => setUseAI(false)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '10px',
                      border: !useAI ? '3px solid #667eea' : '2px solid #e0e0e0',
                      background: !useAI ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f8f9fa',
                      color: !useAI ? 'white' : '#333',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    📝 Templates (Fast!)
                  </button>
                </div>
                {useAI && (
                  <p style={{ fontSize: '0.85rem', color: '#666', margin: '10px 0' }}>
                    ✨ AI will draw anything! Type "spiderman", "birthday cake", "pokemon" - anything!
                  </p>
                )}
                {!useAI && (
                  <p style={{ fontSize: '0.85rem', color: '#666', margin: '10px 0' }}>
                    📝 28 pre-made templates. Instant! Try: dog, cat, rocket, castle...
                  </p>
                )}
              </div>

              {/* Theme Presets */}
              <div style={styles.controlGroup}>
                <h3 style={styles.groupTitle}>Choose Your Theme</h3>
                <div style={styles.presetButtons}>
                  {Object.entries(TEMPLATES).map(([category, items]) => (
                    <button
                      key={category}
                      className="preset-btn"
                      style={{...styles.presetBtn, background: '#667eea', color: 'white'}}
                      onClick={() => setPreset(category)}
                    >
                      {category === 'animal' && '🐶'}
                      {category === 'vehicle' && '🚗'}
                      {category === 'nature' && '🌳'}
                      {category === 'fantasy' && '🦄'}
                      {' '}{category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Drawing Input */}
              <div style={styles.controlGroup}>
                <h3 style={styles.groupTitle}>Custom Drawing</h3>
                <label style={styles.label}>What to draw?</label>
                <input
                  type="text"
                  style={styles.input}
                  value={drawingSubject}
                  onChange={(e) => setDrawingSubject(e.target.value)}
                  placeholder="e.g., happy dinosaur, spiderman, birthday cake..."
                />
              </div>

              {/* Line Thickness */}
              <div style={styles.controlGroup}>
                <h3 style={styles.groupTitle}>Line Thickness</h3>
                <input
                  type="range"
                  min="2"
                  max="10"
                  value={lineThickness}
                  onChange={(e) => setLineThickness(parseInt(e.target.value))}
                />
                <span style={styles.thicknessDisplay}>{lineThickness}px</span>
              </div>

              {/* Page Title */}
              <div style={styles.controlGroup}>
                <h3 style={styles.groupTitle}>Page Title</h3>
                <input
                  type="text"
                  style={styles.input}
                  value={coloringTitle}
                  onChange={(e) => setColoringTitle(e.target.value)}
                  placeholder="e.g., Younis's Coloring Book, Fun Animals..."
                  maxLength={40}
                />
                <p style={{ fontSize: '0.85rem', color: '#666' }}>Appears at top of page</p>
              </div>

              {/* Coloring Options */}
              <div style={styles.controlGroup}>
                <h3 style={styles.groupTitle}>✏️ Coloring Options</h3>
                <div style={styles.checkboxGroup}>
                  <input
                    type="checkbox"
                    id="addBorder"
                    checked={addBorder}
                    onChange={(e) => setAddBorder(e.target.checked)}
                  />
                  <label style={styles.checkboxLabel} htmlFor="addBorder">🎨 Decorative border</label>
                </div>
                <div style={styles.checkboxGroup}>
                  <input
                    type="checkbox"
                    id="addWebsiteFooter"
                    checked={addWebsiteFooter}
                    onChange={(e) => setAddWebsiteFooter(e.target.checked)}
                  />
                  <label style={styles.checkboxLabel} htmlFor="addWebsiteFooter">🌐 Add website footer (share with others!)</label>
                </div>
                <div style={styles.checkboxGroup}>
                  <input
                    type="checkbox"
                    id="addInstructions"
                    checked={addInstructions}
                    onChange={(e) => setAddInstructions(e.target.checked)}
                  />
                  <label style={styles.checkboxLabel} htmlFor="addInstructions">📝 Show hints</label>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '10px' }}>
                  📢 Footer helps other parents find this free tool!
                </p>
              </div>

              {/* Generate Button */}
              <button
                style={{...styles.button, opacity: isGenerating ? 0.7 : 1, cursor: isGenerating ? 'not-allowed' : 'pointer'}}
                onClick={generateDrawing}
                disabled={isGenerating}
              >
                {isGenerating ? (useAI ? '🤖 ✨ AI is Drawing...' : '✨ Generating...') : '✨ Generate Coloring Page ✨'}
              </button>
            </div>

            {/* Preview Panel */}
            <div style={styles.previewPanel}>
              <div style={{ position: 'relative' }}>
                <canvas
                  ref={canvasRef}
                  id="printArea"
                  width={CANVAS_WIDTH}
                  height={CANVAS_HEIGHT}
                  style={styles.canvas}
                />
                {isGenerating && useAI && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(255,255,255,0.9)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '10px',
                  }}>
                    <div style={{ fontSize: '4rem', animation: 'bounce 1s infinite' }}>🤖✨</div>
                    <p style={{ fontSize: '1.2rem', color: '#667eea', fontWeight: 'bold', marginTop: '1rem' }}>
                      AI is drawing "{drawingSubject}"...
                    </p>
                    <p style={{ fontSize: '0.9rem', color: '#888', marginTop: '0.5rem' }}>
                      Takes about 5-10 seconds 🚀
                    </p>
                  </div>
                )}
              </div>

              <div style={styles.actionButtons}>
                <button
                  style={{...styles.button, ...styles.secondaryBtn}}
                  onClick={downloadPDF}
                >
                  📥 Download PDF
                </button>
                <button
                  style={{...styles.button, ...styles.secondaryBtn}}
                  onClick={printPaper}
                >
                  🖨️ Print
                </button>
              </div>

              <button
                style={{...styles.button, ...styles.secondaryBtn, marginTop: '10px'}}
                onClick={randomGenerate}
              >
                🎲 Surprise Me!
              </button>
            </div>
          </div>
        </div>

        <div style={styles.footer}>
          🎨 Perfect for printing and coloring! AI draws ANYTHING • Templates for quick fun • Customize your title! ⭐
        </div>
      </div>
    </div>
  );
}
