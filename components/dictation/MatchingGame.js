import { useState, useEffect } from 'react';
import { dictationWords } from './dictionary';

export default function MatchingGame() {
    const [words, setWords] = useState([]);
    const [emojis, setEmojis] = useState([]);
    const [selectedWord, setSelectedWord] = useState(null);
    const [matchedPairs, setMatchedPairs] = useState([]);

    useEffect(() => {
        // Shuffle arrays for the game
        const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);
        setWords(shuffle(dictationWords.map(d => d.word)));
        setEmojis(shuffle(dictationWords.map(d => d.emoji)));
    }, []);

    const handleWordClick = (word) => {
        if (!matchedPairs.includes(word)) {
            setSelectedWord(word === selectedWord ? null : word);
        }
    };

    const handleEmojiClick = (emoji) => {
        if (!selectedWord || matchedPairs.includes(selectedWord)) return;

        // Check if selected word matches the clicked emoji
        const correctPair = dictationWords.find(d => d.word === selectedWord && d.emoji === emoji);
        
        if (correctPair) {
            // Match found!
            setMatchedPairs(prev => [...prev, selectedWord]);
        } else {
            // Wrong match - shake effect could be added here
        }
        setSelectedWord(null);
    };

    const isGameFinished = matchedPairs.length === dictationWords.length;

    const resetGame = () => {
        setMatchedPairs([]);
        setSelectedWord(null);
        const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);
        setWords(shuffle(dictationWords.map(d => d.word)));
        setEmojis(shuffle(dictationWords.map(d => d.emoji)));
    };

    return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Match the Word to the Picture!</h2>
            
            {isGameFinished ? (
                <div style={{ padding: '3rem' }}>
                    <h2 style={{ fontSize: '3rem', color: '#22c55e', margin: '0 0 1rem 0' }}>Perfect Match! 🏆</h2>
                    <button 
                        onClick={resetGame}
                        style={{
                            background: '#3b82f6', color: 'white', padding: '1rem 3rem',
                            fontSize: '1.5rem', border: 'none', borderRadius: '12px',
                            cursor: 'pointer', fontWeight: 'bold'
                        }}
                    >
                        Play Again 🔁
                    </button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    {/* Words Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <h3 style={{ borderBottom: '2px solid #EEE', paddingBottom: '0.5rem' }}>Words</h3>
                        {words.map(w => {
                            const isSelected = selectedWord === w;
                            const isMatched = matchedPairs.includes(w);
                            return (
                                <button
                                    key={w}
                                    onClick={() => handleWordClick(w)}
                                    disabled={isMatched}
                                    style={{
                                        padding: '1rem', fontSize: '1.5rem', fontWeight: 'bold',
                                        borderRadius: '12px', border: '3px solid',
                                        borderColor: isMatched ? '#22c55e' : (isSelected ? '#3b82f6' : '#ccc'),
                                        background: isMatched ? '#dcfce7' : (isSelected ? '#eff6ff' : 'white'),
                                        color: isMatched ? '#166534' : 'black',
                                        opacity: isMatched ? 0.6 : 1,
                                        cursor: isMatched ? 'default' : 'pointer',
                                        transition: 'all 0.2s',
                                        boxShadow: isMatched ? 'none' : '0 4px 0 #ccc'
                                    }}
                                >
                                    {w} {isMatched && '✅'}
                                </button>
                            );
                        })}
                    </div>

                    {/* Emojis Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <h3 style={{ borderBottom: '2px solid #EEE', paddingBottom: '0.5rem' }}>Pictures</h3>
                        {emojis.map(e => {
                            const relatedWord = dictationWords.find(d => d.emoji === e).word;
                            const isMatched = matchedPairs.includes(relatedWord);
                            return (
                                <button
                                    key={e}
                                    onClick={() => handleEmojiClick(e)}
                                    disabled={isMatched || !selectedWord}
                                    style={{
                                        padding: '1rem', fontSize: '2.5rem',
                                        borderRadius: '12px', border: '3px solid',
                                        borderColor: isMatched ? '#22c55e' : '#ccc',
                                        background: isMatched ? '#dcfce7' : 'white',
                                        opacity: isMatched ? 0.6 : 1,
                                        cursor: isMatched ? 'default' : (selectedWord ? 'pointer' : 'not-allowed'),
                                        transition: 'all 0.2s',
                                        boxShadow: isMatched ? 'none' : '0 4px 0 #ccc'
                                    }}
                                >
                                    {e}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
