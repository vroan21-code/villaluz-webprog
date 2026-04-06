import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center">
                <div className="mb-8">
                    <h1 className="text-9xl font-bold text-zinc-300 mb-4">404</h1>
                    <h2 className="text-4xl font-bold text-zinc-900 mb-4">Page Not Found</h2>
                    <p className="text-lg text-zinc-600 mb-8">The page you're looking for doesn't exist or may have been moved.</p>
                </div>
                <Link 
                    to="/" 
                    className="inline-block bg-zinc-900 text-white px-8 py-3 rounded-lg hover:bg-zinc-800 transition-colors font-semibold"
                >
                    Go Back Home
                </Link>
            </div>
        </div>
    );
}

export default NotFoundPage;