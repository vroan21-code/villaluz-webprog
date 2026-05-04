import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

const links = [
    { label: 'Home', to: '/'},
    { label: 'About', to: '/about'},
    { label: 'Articles', to: '/articles'},
];

const navLinkClassName = ({ isActive }) =>
[
    'rounded-full border-2 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] transition',
    isActive
    ? 'border-zinc-900 bg-zinc-900 text-zinc-50'
    : 'border-transparent text-zinc-500 hover:border-zinc-900 hover:bg-zinc-50 hover:text-zinc-900',
].join(' ');

const authButtonClassName = 'rounded-full p-3 transition hover:bg-zinc-200';
const loginButtonClassName = 'rounded-full border-2 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] transition border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-zinc-50';

const NavBar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(
        () => typeof window !== 'undefined' && localStorage.getItem('isLoggedIn') === 'true'
    );
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        setIsLoggedIn(false);
        setIsProfileMenuOpen(false);
        navigate('/auth/signin');
    };

    const handleLogin = () => {
        navigate('/auth/signin');
    };

    const handleDashboard = () => {
        setIsProfileMenuOpen(false);
        navigate('/dashboard');
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setIsProfileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="fixed inset-x-0 top-0 z-50 border-b-2 border-zinc-900 bg-zinc-100/95 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                <NavLink to="/" className="flex items-center gap-3">
                    <img
                        src="/logo.jpg"
                        alt="Villaluz Logo"
                        className="h-10 w-10 rounded-full object-cover border-2 border-zinc-900"
                    />
                </NavLink>

                <nav className="hidden items-center gap-2 md:flex">
                    {links.map((link) => (
                        <NavLink key={link.to} to={link.to} end={link.to === '/'}
                        className={navLinkClassName}>
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    {isLoggedIn ? (
                        <div className="relative" ref={profileMenuRef}>
                            <button
                                onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                                className={authButtonClassName}
                                title="Profile options"
                            >
                                <img src="/account.svg" alt="Account" className="h-6 w-6" />
                            </button>
                            {isProfileMenuOpen && (
                                <div className="absolute right-0 mt-3 min-w-[8.5rem] rounded-xl border border-zinc-200/80 bg-white/90 p-1.5 shadow-[0_12px_36px_-12px_rgba(0,0,0,0.35)] backdrop-blur-md">
                                    <button
                                        onClick={handleDashboard}
                                        className="w-full rounded-lg px-2.5 py-2 text-left text-xs font-medium text-zinc-700 transition hover:bg-zinc-900 hover:text-zinc-50 active:scale-[0.99]"
                                    >
                                        Dashboard
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full rounded-lg px-2.5 py-2 text-left text-xs font-medium text-zinc-700 transition hover:bg-zinc-900 hover:text-zinc-50 active:scale-[0.99]"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button onClick={handleLogin} className={loginButtonClassName}>
                            Login
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default NavBar