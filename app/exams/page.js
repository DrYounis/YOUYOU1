'use client';
import Link from 'next/link';
// Removed localized Navbar import because app/layout.js already injects it globally!

export default function StudyHub() {
    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #312e81 0%, #6b21a8 50%, #312e81 100%)',
            padding: '4rem 1rem 5rem 1rem',
            fontFamily: 'var(--font-pixel, "Inter", sans-serif)'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem', animation: 'fadeIn 1s ease-in-out' }}>
                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                        fontWeight: '900',
                        color: 'white',
                        marginBottom: '1.5rem',
                        textShadow: '4px 4px 0px rgba(0,0,0,0.8)'
                    }}>
                        🧠 THE STUDY HUB
                    </h1>
                    <p style={{
                        fontSize: '1.5rem',
                        color: '#bfdbfe',
                        textShadow: '2px 2px 0px rgba(0,0,0,0.8)',
                        fontWeight: 'bold'
                    }}>
                        Your central station for interactive learning and exams!
                    </p>
                </div>

                <div className="study-grid">
                    {/* Dictation Tracker */}
                    <Link href="/practice/dictation" className="study-card dictation-bg">
                        <div className="card-icon">📝</div>
                        <h2 className="card-title">Dictation 21</h2>
                        <p className="card-desc">Use your Apple Pencil to trace and write the weekly dictation test!</p>
                    </Link>

                    {/* Naskh Tracker */}
                    <Link href="/practice/naskh" className="study-card naskh-bg">
                        <div className="card-icon">🖋️</div>
                        <h2 className="card-title">خط النسخ (Naskh)</h2>
                        <p className="card-desc">Master Arabic calligraphy with dynamic interactive tracing guides.</p>
                    </Link>

                    {/* English HW */}
                    <Link href="/practice/english-notebook" className="study-card english-bg">
                        <div className="card-icon">📓</div>
                        <h2 className="card-title">English HW</h2>
                        <p className="card-desc">Your personal red-lined English notebook for freehand practice.</p>
                    </Link>

                    {/* Legacy Classic Apps */}
                    <Link href="/legacy/index.html" className="study-card classic-bg">
                        <div className="card-icon">📚</div>
                        <h2 className="card-title">Classic Studies</h2>
                        <p className="card-desc">Phonics, Vocabulary, and the original Awael application.</p>
                    </Link>

                    {/* Legacy Science */}
                    <Link href="/legacy/science-study.html" className="study-card science-bg">
                        <div className="card-icon">🔬</div>
                        <h2 className="card-title">Science Fun</h2>
                        <p className="card-desc">Discover the Five Senses, Earth & Sun, and match the rocks!</p>
                    </Link>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .study-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                    gap: 2.5rem;
                }

                .study-card {
                    display: block;
                    border-radius: 1.5rem;
                    padding: 2.5rem;
                    text-decoration: none;
                    border: 4px solid #000;
                    box-shadow: 6px 6px 0px #000;
                    transition: transform 0.2s, box-shadow 0.2s;
                    position: relative;
                    overflow: hidden;
                    height: 100%;
                }

                .study-card:hover {
                    transform: translate(-3px, -3px);
                    box-shadow: 10px 10px 0px #000;
                }

                .card-icon {
                    font-size: 4.5rem;
                    margin-bottom: 1rem;
                    transition: transform 0.3s ease;
                }

                .study-card:hover .card-icon {
                    transform: scale(1.1) rotate(5deg);
                }

                .card-title {
                    font-size: 2rem;
                    font-weight: 900;
                    color: white;
                    margin-bottom: 0.8rem;
                    text-shadow: 2px 2px 0px #000;
                }

                .card-desc {
                    font-weight: bold;
                    font-size: 1.2rem;
                    line-height: 1.5;
                }

                /* Specific Card Backgrounds and Colors */
                .dictation-bg {
                    background: linear-gradient(135deg, #ec4899 0%, #e11d48 100%);
                }
                .dictation-bg .card-desc { color: #fdf2f8; }

                .naskh-bg {
                    background: linear-gradient(135deg, #facc15 0%, #d97706 100%);
                }
                .naskh-bg .card-desc { color: #fefce8; }

                .english-bg {
                    background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%);
                }
                .english-bg .card-desc { color: #fee2e2; }

                .classic-bg {
                    background: linear-gradient(135deg, #2dd4bf 0%, #059669 100%);
                }
                .classic-bg .card-desc { color: #ccfbf1; }

                .science-bg {
                    background: linear-gradient(135deg, #a855f7 0%, #7e22ce 100%);
                }
                .science-bg .card-desc { color: #f3e8ff; }
            `}</style>
        </div>
    );
}
