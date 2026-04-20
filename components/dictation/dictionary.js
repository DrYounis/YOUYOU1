export const dictationWords = [
    // Original 'ee' phonics list
    { word: 'bee', emoji: '🐝', translation: 'نحلة' },
    { word: 'sheep', emoji: '🐑', translation: 'خروف' },
    { word: 'knee', emoji: '🦵', translation: 'ركبة' },
    { word: 'wheel', emoji: '🛞', translation: 'عجلة' },
    { word: 'jeep', emoji: '🚙', translation: 'جيب' },
    { word: 'teeth', emoji: '🦷', translation: 'أسنان' },

    // New 'y' phonics list added from worksheet image
    { word: 'sky', emoji: '☁️', translation: 'سماء' },
    { word: 'fly', emoji: '🦸', translation: 'يطير' },
    { word: 'cry', emoji: '😭', translation: 'يبكي' },
    { word: 'baby', emoji: '👶', translation: 'طفل' }
];

export const playAudio = (word) => {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.85; // slightly slower for dictation
    window.speechSynthesis.speak(utterance);
};
