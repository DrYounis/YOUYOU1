import { useState } from 'react';
import { dictationWords, playAudio } from './dictionary';

export default function DictationTest() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [inputVal, setInputVal] = useState('');
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState(null); // 'correct' or 'wrong'
    const [isFinished, setIsFinished] = useState(false);

    const currentItem = dictationWords[currentIndex];

    const handleSubmit = () => {
        if (!inputVal.trim()) return;
        
        const cleanedInput = inputVal.toLowerCase().replace(/\s+/g, '');
        if (cleanedInput === currentItem.word) {
            setFeedback('correct');
            setScore(s => s + 1);
        } else {
            setFeedback('wrong');
        }
    };

    const handleNext = () => {
        if (currentIndex < dictationWords.length - 1) {
            setCurrentIndex(i => i + 1);
            setInputVal('');
            setFeedback(null);
        } else {
            setIsFinished(true);
        }
    };

    const resetTest = () => {
        setCurrentIndex(0);
        setInputVal('');
        setScore(0);
        setFeedback(null);
        setIsFinished(false);
    };

    if (isFinished) {
        return (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
                <h2 style={{ fontSize: '3rem', margin: '0 0 1rem 0' }}>🎉 Test Completed! 🎉</h2>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Your Score: {score} / {dictationWords.length}</p>
                <button onClick={resetTest} className="btn-primary" style={{ marginTop: '2rem', fontSize: '1.2rem', background: '#3b82f6', color: 'white', padding: '1rem 2rem', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Try Again 🔁
                </button>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Listen & Spell</h2>
            <div style={{ marginBottom: '2rem', color: '#666', fontWeight: 'bold' }}>
                Word {currentIndex + 1} of {dictationWords.length}
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <button 
                    onClick={() => playAudio(currentItem.word)}
                    style={{
                        background: '#4CAF50',
                        color: 'white',
                        border: '4px solid #2E7D32',
                        borderRadius: '50%',
                        width: '100px',
                        height: '100px',
                        fontSize: '3rem',
                        cursor: 'pointer',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                        transition: 'transform 0.2s'
                    }}
                    onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
                    onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                    🔊
                </button>
                <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>Tap to play sound</p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <input 
                    type="text" 
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    disabled={feedback !== null}
                    placeholder="Type what you hear..."
                    style={{
                        padding: '1rem',
                        fontSize: '1.5rem',
                        border: '4px solid #CCC',
                        borderRadius: '12px',
                        width: '100%',
                        maxWidth: '400px',
                        textAlign: 'center',
                        textTransform: 'lowercase',
                        background: feedback === 'correct' ? '#dcfce7' : (feedback === 'wrong' ? '#fee2e2' : 'white'),
                        borderColor: feedback === 'correct' ? '#22c55e' : (feedback === 'wrong' ? '#ef4444' : '#CCC')
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !feedback) handleSubmit();
                    }}
                />
            </div>

            {!feedback ? (
                <button 
                    onClick={handleSubmit}
                    style={{
                        background: '#3b82f6',
                        color: 'white',
                        padding: '1rem 3rem',
                        fontSize: '1.5rem',
                        border: 'none',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 0 #2563eb'
                    }}
                >
                    Check
                </button>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    {feedback === 'correct' ? (
                        <h3 style={{ color: '#22c55e', fontSize: '1.8rem', margin: 0 }}>✅ Correct! Great Job!</h3>
                    ) : (
                        <h3 style={{ color: '#ef4444', fontSize: '1.8rem', margin: 0 }}>
                            ❌ Oops! The correct spelling is: <strong style={{color: 'black'}}>{currentItem.word}</strong>
                        </h3>
                    )}
                    <button 
                        onClick={handleNext}
                        style={{
                            background: '#f59e0b',
                            color: 'white',
                            padding: '1rem 3rem',
                            fontSize: '1.5rem',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            boxShadow: '0 4px 0 #d97706'
                        }}
                    >
                        {currentIndex < dictationWords.length - 1 ? 'Next Word ➡️' : 'Finish 🏁'}
                    </button>
                </div>
            )}
        </div>
    );
}
