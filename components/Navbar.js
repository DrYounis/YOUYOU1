'use client';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const toggleMenu = () => setIsOpen(!isOpen);
    
    // Helper to determine if a link is active
    const isActive = (path) => pathname === path;

    return (
        <header className="navbar-header">
            <nav className="container navbar-container">
                <Link href="/" className="logo">
                    🌍 Younis World
                </Link>

                {/* Desktop Nav */}
                <ul className="desktop-nav">
                    <li><Link href="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>🏠 Home</Link></li>
                    <li><Link href="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>ℹ️ About</Link></li>
                    <li><Link href="/fun-zone" className={`nav-link highlight ${isActive('/fun-zone') ? 'active' : ''}`}>🎉 Fun Zone</Link></li>
                    
                    {/* Media Dropdown */}
                    <li className="dropdown">
                        <span className="nav-link">🎨 Media ▼</span>
                        <ul className="dropdown-menu">
                            <li><Link href="/videos" className="dropdown-item">🎬 Videos</Link></li>
                            <li><Link href="/gallery" className="dropdown-item">🖼️ Gallery</Link></li>
                            <li><Link href="/diaries" className="dropdown-item">📖 Diaries</Link></li>
                            <li><Link href="/coloring-book" className="dropdown-item">🖍️ Coloring Book</Link></li>
                            <li><Link href="/bedtime-stories" className="dropdown-item">🌙 Stories</Link></li>
                        </ul>
                    </li>

                    {/* Study Dropdown */}
                    <li className="dropdown">
                        <span className="nav-link">🧠 Study ▼</span>
                        <ul className="dropdown-menu">
                            <li><Link href="/practice/naskh" className="dropdown-item">🖋️ خط النسخ</Link></li>
                            <li><Link href="/practice/english-notebook" className="dropdown-item">📓 English HW</Link></li>
                            <li><Link href="/kids-tools" className="dropdown-item">🤖 AI Tools</Link></li>
                            <li><Link href="/exams" className="dropdown-item">📝 Exams</Link></li>
                            <li><Link href="/legacy/index.html" className="dropdown-item">📚 Classic App</Link></li>
                            <li><Link href="/legacy/science-study.html" className="dropdown-item">🔬 Classic Science</Link></li>
                            <li><Link href="/legacy/arabic-writing.html" className="dropdown-item">✏️ Classic Arabic</Link></li>
                        </ul>
                    </li>

                    {/* Community Dropdown */}
                    <li className="dropdown">
                        <span className="nav-link">🤝 Community ▼</span>
                        <ul className="dropdown-menu">
                            <li><Link href="/friends" className="dropdown-item">👫 Friends</Link></li>
                            <li><Link href="/citizens" className="dropdown-item">👑 Citizens</Link></li>
                            <li><Link href="/blog" className="dropdown-item">📝 Blog</Link></li>
                            <li><Link href="/map" className="dropdown-item">🗺️ World Map</Link></li>
                            <li><Link href="/secret-box" className="dropdown-item">🤫 Secret Box</Link></li>
                        </ul>
                    </li>

                    <li><Link href="/store" className="nav-link store-link">🛒 Store</Link></li>
                    <li><Link href="/login" className="nav-link">👤 Login</Link></li>
                </ul>

                {/* Mobile Toggle */}
                <button className="mobile-toggle btn" onClick={toggleMenu} aria-label="Toggle Menu">
                    {isOpen ? '✕' : '☰'}
                </button>

                {/* Mobile Nav */}
                <ul className={`mobile-nav ${isOpen ? 'open' : ''}`}>
                    <li><Link href="/" onClick={toggleMenu} className="nav-link">🏠 Home</Link></li>
                    <li><Link href="/about" onClick={toggleMenu} className="nav-link">ℹ️ About</Link></li>
                    <li><Link href="/fun-zone" onClick={toggleMenu} className="nav-link highlight">🎉 Fun Zone</Link></li>
                    <li className="mobile-divider">Media</li>
                    <li><Link href="/videos" onClick={toggleMenu} className="nav-link">🎬 Videos</Link></li>
                    <li><Link href="/gallery" onClick={toggleMenu} className="nav-link">🖼️ Gallery</Link></li>
                    <li><Link href="/coloring-book" onClick={toggleMenu} className="nav-link">🖍️ Coloring Book</Link></li>
                    <li className="mobile-divider">Study & Practice</li>
                    <li><Link href="/practice/naskh" onClick={toggleMenu} className="nav-link study">🖋️ خط النسخ</Link></li>
                    <li><Link href="/practice/english-notebook" onClick={toggleMenu} className="nav-link study">📓 English HW</Link></li>
                    <li><Link href="/legacy/index.html" onClick={toggleMenu} className="nav-link legacy">📚 Classic Apps</Link></li>
                    <li className="mobile-divider">Community & Store</li>
                    <li><Link href="/friends" onClick={toggleMenu} className="nav-link">👫 Friends</Link></li>
                    <li><Link href="/blog" onClick={toggleMenu} className="nav-link">📝 Blog</Link></li>
                    <li><Link href="/store" onClick={toggleMenu} className="nav-link store-link">🛒 Store</Link></li>
                    <li><Link href="/login" onClick={toggleMenu} className="nav-link">👤 Login</Link></li>
                </ul>
            </nav>

            <style jsx>{`
                /* Semantic HTML Header using existing visual themes */
                .navbar-header {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    backdrop-filter: blur(12px);
                    z-index: 1000;
                    border-bottom: 2px solid rgba(255,255,255,0.2);
                    min-height: 90px;
                    display: flex;
                    align-items: center;
                    box-shadow: 0 5px 30px rgba(102, 126, 234, 0.4);
                }

                .navbar-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                    margin: 0 auto;
                }

                .logo {
                    font-size: 2.2rem;
                    font-weight: 900;
                    color: white;
                    text-shadow: 3px 3px 0px rgba(0,0,0,0.4);
                    text-decoration: none;
                    white-space: nowrap;
                }

                /* Nav Lists Cleanup */
                ul {
                    list-style: none;
                    margin: 0;
                    padding: 0;
                }

                /* Desktop specific */
                .desktop-nav {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                }

                .nav-link {
                    font-weight: 800;
                    font-size: 1.1rem;
                    color: rgba(255,255,255,0.95);
                    text-decoration: none;
                    padding: 0.6rem 1rem;
                    border-radius: 12px;
                    transition: all 0.3s ease;
                    background: rgba(255,255,255,0.05);
                    border: 2px solid transparent;
                    cursor: pointer;
                    display: inline-block;
                }

                .nav-link:hover, .nav-link.active {
                    background: rgba(255,255,255,0.2);
                    border: 2px solid rgba(255,255,255,0.3);
                    transform: translateY(-2px);
                }

                /* Specialized Links */
                .nav-link.highlight { background: rgba(255,255,255,0.25); }
                .nav-link.study { background: rgba(255,200,0,0.3); border-color: rgba(255,200,0,0.6); }
                .nav-link.legacy { background: rgba(50, 200, 150, 0.3); border-color: rgba(50, 200, 150, 0.6); }
                .nav-link.store-link { background: rgba(255, 100, 100, 0.3); border-color: rgba(255, 100, 100, 0.6); }

                /* CSS Pure Dropdown */
                .dropdown {
                    position: relative;
                }

                .dropdown-menu {
                    display: none;
                    position: absolute;
                    top: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
                    min-width: 200px;
                    border-radius: 12px;
                    padding: 0.5rem 0;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.4);
                    border: 2px solid rgba(255,255,255,0.2);
                }

                .dropdown:hover .dropdown-menu {
                    display: flex;
                    flex-direction: column;
                    gap: 0.3rem;
                }

                .dropdown-item {
                    color: white;
                    padding: 0.7rem 1.5rem;
                    display: block;
                    font-weight: bold;
                    white-space: nowrap;
                    transition: background 0.2s;
                }

                .dropdown-item:hover {
                    background: rgba(255,255,255,0.2);
                }

                /* Mobile Controls */
                .mobile-toggle {
                    display: none;
                    font-size: 1.5rem;
                    padding: 0.4rem 1rem;
                }

                .mobile-nav {
                    display: none;
                    position: absolute;
                    top: 90px;
                    left: 0;
                    right: 0;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    padding: 1.5rem;
                    flex-direction: column;
                    gap: 0.8rem;
                    border-bottom: 2px solid rgba(255,255,255,0.2);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                    max-height: 80vh;
                    overflow-y: auto;
                }

                .mobile-nav.open {
                    display: flex;
                }

                .mobile-divider {
                    color: rgba(255,255,255,0.5);
                    text-transform: uppercase;
                    font-size: 0.8rem;
                    margin-top: 1rem;
                    font-weight: 900;
                    letter-spacing: 2px;
                    text-align: center;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                    padding-bottom: 0.3rem;
                }

                .mobile-nav .nav-link {
                    text-align: center;
                    font-size: 1.3rem;
                }

                @media (max-width: 1200px) {
                    .desktop-nav { display: none !important; }
                    .mobile-toggle { display: block !important; }
                    .logo { font-size: 1.8rem; }
                }
            `}</style>
        </header>
    );
}
