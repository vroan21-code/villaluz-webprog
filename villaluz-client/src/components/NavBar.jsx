import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

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
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const loggedIn = localStorage.getItem('isLoggedIn');
        setIsLoggedIn(loggedIn === 'true');
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        setIsLoggedIn(false);
        navigate('/auth/signin');
    };

    const handleLogin = () => {
        navigate('/auth/signin');
    };

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
                        <button onClick={handleLogout} className={authButtonClassName} title="Logout">
                            <img src="/account.svg" alt="Account" className="h-6 w-6" />
                        </button>
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