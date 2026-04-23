import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-zinc-900 text-zinc-100 py-4">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-2 md:mb-0">
                        <h3 className="text-sm font-semibold">My Articles</h3>
                        <p className="text-xs text-zinc-400">Insights, ideas, and stories crafted with purpose</p>
                    </div>
                        <div className="flex space-x-4">
                            <Link to="/about" className="text-xs text-zinc-400 hover:text-zinc-100 transition-colors">About</Link>
                            <a href="mailto:vroan21@gmail.com" className="text-xs text-zinc-400 hover:text-zinc-100 transition-colors">Facebook</a>
                            <a href="https://github.com/vroan21-code" target="_blank" rel="noopener noreferrer" className="text-xs text-zinc-400 hover:text-zinc-100 transition-colors">GitHub</a>
                        </div>
                </div>
                <div className="mt-4 pt-4 border-t border-zinc-700 text-center text-xs text-zinc-400">
                    <p>&copy; 2026 Roan Villaluz. All rights reserved</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;