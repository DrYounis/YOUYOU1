import Link from 'next/link';
import { naskhLessons } from '../../../lib/naskhLessons';
import ClientProgressWrapper from './ClientProgressWrapper';

// Define metadata for SEO
export const metadata = {
    title: 'تعلم خط النسخ | Younis Adventures',
    description: 'تدرب على كتابة حروف خط النسخ بشكل تفاعلي',
};

export default function NaskhPracticePage() {
    return (
        <div className="container" style={{ direction: 'rtl', padding: '2rem 1rem', minHeight: '100vh' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#007AFF' }}>
                    كراسة خط النسخ التفاعلية
                </h1>
                
                <div style={{ background: '#ffffff', borderRadius: '1rem', padding: '2rem', marginBottom: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e0e0e0', lineHeight: '1.8' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', borderBottom: '2px solid #f0f0f0', paddingBottom: '0.5rem' }}>
                        مقدمة عن خط النسخ
                    </h2>
                    <p style={{ marginBottom: '1rem' }}>
                        خط النسخ هو أحد الخطوط العربية الأصيلة، يمتاز بالوضوح والجمال وسهولة القراءة، ولذلك استُخدم في كتابة القرآن الكريم وطباعة الكتب.
                    </p>

                    <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginTop: '1.5rem', color: '#333' }}>الجلسة الصحيحة ومسكة القلم</h3>
                    <ul style={{ paddingRight: '1.5rem', marginBottom: '1rem' }}>
                        <li>اجلس بشكل مستقيم، ولا تقترب كثيراً من الورقة الجوال/الآيباد.</li>
                        <li>أمسك القلم بإصبعي الإبهام والسبابة، وأسنده على الوسطى.</li>
                        <li>ضع الجهاز بشكل مائل قليلاً نحو اليسار.</li>
                    </ul>
                    <p style={{ color: '#00AA00', fontWeight: 'bold' }}>
                        استخدم قلم الآيباد (Apple Pencil) للحصول على أفضل تجربة، حيث يدعم التطبيق حساسية الضغط أثناء الرسم!
                    </p>
                </div>

                <ClientProgressWrapper totalLessons={naskhLessons.length} />

                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>اختر حرفاً للتدريب:</h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '1rem' }}>
                    {naskhLessons.map(lesson => (
                        <Link 
                            key={lesson.id} 
                            href={`/practice/naskh/${lesson.id}`}
                            className="naskh-letter-btn"
                        >
                            {lesson.letter}
                        </Link>
                    ))}
                </div>

                <style>{`
                    .naskh-letter-btn {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        height: 80px;
                        border-radius: 1rem;
                        background: #ffffff;
                        color: #333;
                        text-decoration: none;
                        font-weight: bold;
                        font-size: 2rem;
                        border: 2px solid #e0e0e0;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                        transition: transform 0.15s, box-shadow 0.15s;
                    }
                    .naskh-letter-btn:hover {
                        transform: translateY(-3px);
                        box-shadow: 0 6px 12px rgba(0,0,0,0.1);
                        border-color: #007AFF;
                        color: #007AFF;
                    }
                `}</style>
            </div>
        </div>
    );
}
