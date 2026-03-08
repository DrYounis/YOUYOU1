'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    const navStyles = {
        header: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            background: 'rgba(255, 255, 255, 0.9)', // White transparency
            backdropFilter: 'blur(12px)',
            zIndex: 1000,
            borderBottom: '1px solid rgba(0,0,0,0.05)',
            height: '120px',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        },
        nav: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
        },
        logo: {
            fontSize: '3rem',
            fontWeight: '800',
            color: '#000080', // Navy Blue
        },
        links: {
            display: 'flex',
            gap: '2rem',
        },
        link: {
            fontWeight: '600',
            fontSize: '0.95rem',
            color: 'var(--color-text-muted)',
        },
        mobileMenu: {
            position: 'absolute',
            top: '120px',
            left: 0,
            right: 0,
            background: 'white',
            padding: '2rem',
            display: isOpen ? 'flex' : 'none',
            flexDirection: 'column',
            gap: '1.5rem',
            borderBottom: '1px solid rgba(0,0,0,0.05)',
            boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
        },
        hamburger: {
            display: 'none',
            background: 'none',
            border: 'none',
            color: '#000080', // Navy Blue

            fontSize: '1.5rem',
            cursor: 'pointer',
        }
    };

    return (
        <header style={navStyles.header}>
            <div className="container" style={navStyles.nav}>
                <Link href="/" style={navStyles.logo}>
                    Younis Adventures 🌍
                </Link>

                {/* Helper to show active state color on hover would require CSS module or styled-jsx, sticking to inline simplicity */}

                {/* Desktop Nav */}
                <div className="desktop-nav" style={navStyles.links}>
                    <Link href="/" style={navStyles.link}>Home</Link>
                    <Link href="/videos" style={navStyles.link}>Videos</Link>
                    <Link href="/gallery" style={navStyles.link}>Gallery</Link>
                    <Link href="/blog" style={navStyles.link}>Diaries</Link>
                    <Link href="/friends" style={navStyles.link}>Friends</Link>
                    <Link href="/about" style={navStyles.link}>About</Link>
                </div>

                {/* Mobile Toggle */}
                <button className="mobile-toggle" onClick={toggleMenu} style={navStyles.hamburger}>
                    <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
                </button>

                {/* Mobile Nav */}
                <div style={navStyles.mobileMenu}>
                    <Link href="/" onClick={toggleMenu} style={{ ...navStyles.link, fontSize: '1.2rem' }}>Home</Link>
                    <Link href="/videos" onClick={toggleMenu} style={{ ...navStyles.link, fontSize: '1.2rem' }}>Videos</Link>
                    <Link href="/gallery" onClick={toggleMenu} style={{ ...navStyles.link, fontSize: '1.2rem' }}>Gallery</Link>
                    <Link href="/blog" onClick={toggleMenu} style={{ ...navStyles.link, fontSize: '1.2rem' }}>Diaries</Link>
                    <Link href="/friends" onClick={toggleMenu} style={{ ...navStyles.link, fontSize: '1.2rem' }}>Friends</Link>
                    <Link href="/about" onClick={toggleMenu} style={{ ...navStyles.link, fontSize: '1.2rem' }}>About</Link>
                </div>
            </div>
            <style jsx>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
        </header>
    );
}
