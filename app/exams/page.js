import Link from 'next/link';
import Navbar from '../../components/Navbar';

export default function StudyHub() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-900 pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 drop-shadow-[4px_4px_0_#000]">
              🧠 THE STUDY HUB
            </h1>
            <p className="text-2xl text-blue-200 drop-shadow-[2px_2px_0_#000]">
              Your central station for interactive learning and exams!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Dictation Tracker */}
            <Link href="/practice/dictation" className="block group">
              <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl p-8 h-full border-4 border-black hover-card relative overflow-hidden">
                <div className="text-6xl mb-4 relative z-10 group-hover:scale-110 transition-transform">📝</div>
                <h2 className="text-3xl font-black text-white mb-3 relative z-10 drop-shadow-[2px_2px_0_#000]">Dictation 21</h2>
                <p className="text-pink-100 font-bold text-xl relative z-10">Use your Apple Pencil to trace and write the weekly dictation test!</p>
              </div>
            </Link>

            {/* Naskh Tracker */}
            <Link href="/practice/naskh" className="block group">
              <div className="bg-gradient-to-br from-yellow-400 to-amber-600 rounded-3xl p-8 h-full border-4 border-black hover-card relative overflow-hidden">
                <div className="text-6xl mb-4 relative z-10 group-hover:scale-110 transition-transform">🖋️</div>
                <h2 className="text-3xl font-black text-white mb-3 relative z-10 drop-shadow-[2px_2px_0_#000]">خط النسخ (Naskh)</h2>
                <p className="text-yellow-100 font-bold text-xl relative z-10">Master Arabic calligraphy with dynamic interactive tracing guides.</p>
              </div>
            </Link>

            {/* English HW */}
            <Link href="/practice/english-notebook" className="block group">
              <div className="bg-gradient-to-br from-red-500 to-red-700 rounded-3xl p-8 h-full border-4 border-black hover-card relative overflow-hidden">
                <div className="text-6xl mb-4 relative z-10 group-hover:scale-110 transition-transform">📓</div>
                <h2 className="text-3xl font-black text-white mb-3 relative z-10 drop-shadow-[2px_2px_0_#000]">English HW</h2>
                <p className="text-red-100 font-bold text-xl relative z-10">Your personal red-lined English notebook for freehand practice.</p>
              </div>
            </Link>

            {/* Legacy Classic Apps */}
            <Link href="/legacy/index.html" className="block group">
              <div className="bg-gradient-to-br from-teal-400 to-emerald-600 rounded-3xl p-8 h-full border-4 border-black hover-card relative overflow-hidden">
                <div className="text-6xl mb-4 relative z-10 group-hover:scale-110 transition-transform">📚</div>
                <h2 className="text-3xl font-black text-white mb-3 relative z-10 drop-shadow-[2px_2px_0_#000]">Classic Studies</h2>
                <p className="text-teal-100 font-bold text-xl relative z-10">Phonics, Vocabulary, and the original Awael application.</p>
              </div>
            </Link>

            {/* Legacy Science */}
            <Link href="/legacy/science-study.html" className="block group">
              <div className="bg-gradient-to-br from-purple-500 to-fuchsia-700 rounded-3xl p-8 h-full border-4 border-black hover-card relative overflow-hidden">
                <div className="text-6xl mb-4 relative z-10 group-hover:scale-110 transition-transform">🔬</div>
                <h2 className="text-3xl font-black text-white mb-3 relative z-10 drop-shadow-[2px_2px_0_#000]">Science Fun</h2>
                <p className="text-fuchsia-100 font-bold text-xl relative z-10">Discover the Five Senses, Earth & Sun, and match the rocks!</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
