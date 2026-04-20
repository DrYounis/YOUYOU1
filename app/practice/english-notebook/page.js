import Link from 'next/link';
import EnglishNotebookView from '../../../components/english-practice/EnglishNotebookView';

export const metadata = {
    title: 'English Notebook Practice | Younis Adventures',
    description: 'Interactive English handwriting practice with iPad Pen support',
};

export default function EnglishNotebookPracticePage() {
    return (
        <div className="container" style={{ direction: 'ltr', padding: '2rem 1rem', minHeight: '100vh', background: '#f0f4f8' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#2c3e50', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        📓 English Homework Study & Trace
                    </h1>
                    <Link href="/practice/naskh" style={{ padding: '0.8rem 1.5rem', background: '#007AFF', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,122,255,0.2)' }}>
                        🖋️ Arabic Naskh
                    </Link>
                </div>
                
                <div style={{ background: '#ffffff', borderRadius: '1rem', padding: '1.5rem', marginBottom: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)'}}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#333' }}>
                        Instructions:
                    </h2>
                    <ul style={{ paddingLeft: '1.5rem', marginBottom: '0', color: '#555', lineHeight: '1.6' }}>
                        <li><strong>Study the Structure:</strong> Look at the red margins, the italicized dates, and font formatting.</li>
                        <li><strong>Interactive Tracing:</strong> Use your <b>Apple Pencil</b> to trace directly over the faded text ("We are happy .").</li>
                        <li>The canvas incorporates pressure-sensitivity for an authentic English handwriting feel.</li>
                    </ul>
                </div>

                <EnglishNotebookView />

            </div>
        </div>
    );
}
