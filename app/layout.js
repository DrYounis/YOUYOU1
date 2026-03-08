import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export const metadata = {
    title: 'Younis Adventures',
    description: 'Sharing my life across YouTube, photos, and diaries.',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
            </head>
            <body>
                <Navbar />
                <main style={{ minHeight: '100vh', paddingTop: '120px' }}>
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    );
}
