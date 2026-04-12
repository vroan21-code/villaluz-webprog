import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button.jsx';

const inputClasses =
    'mt-2 w-full rounded-xl border border-zinc-300 bg-zinc-100 px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:bg-zinc-50';

const actionButtonClassName = 'w-full rounded-xl py-3 text-[11px] tracking-[0.2em]';

const SignInPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const Email = 'user@example.com';
    const Password = 'Password123';

    const handleSubmit = (event) => {
        event.preventDefault();
        setError('');

        if (email === Email && password === Password) {
            localStorage.setItem('isLoggedIn', 'true');
            navigate('/');
            return;
        }

        setError('Invalid email or password.');
    };

    return (
        <>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">Welcome Back!</h1>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
                Enter your details to access your account.
            </p>
            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="signin-email" className="text-sm font-medium text-zinc-700">
                        Email Address
                    </label>
                    <input
                        id="signin-email"
                        type="email"
                        placeholder="Enter your email"
                        autoComplete="email"
                        className={inputClasses}
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="signin-password" className="text-sm font-medium text-zinc-700">
                        Password
                    </label>
                    <input
                        id="signin-password"
                        type="password"
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        className={inputClasses}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </div>
                
                <div className="flex items-center justify-between gap-4 text-sm">
                    <label className="flex items-center gap-2 text-zinc-600">
                        <input type="checkbox" className="h-4 w-4 rounded border-zinc-300 accent-zinc-900" />
                        <span>Remember me</span>
                    </label>
                    <button type="button" className="font-medium text-zinc-700 transition hover:text-zinc-900">
                        Forgot password?
                    </button>
                </div>

                {error && (
                    <p className="text-sm text-rose-600">{error}</p>
                )}

                <Button type="submit" variant="primary" className={actionButtonClassName}>
                    Sign In
                </Button>

                <div className="mt-4 flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-zinc-500">
                    <span className="h-px flex-1 bg-zinc-200" />
                    <span>or continue with</span>
                    <span className="h-px flex-1 bg-zinc-200" />
                </div>

                <div className="grid gap-3 pt-2 sm:grid-cols-2">
                    <Button
                        type="button"
                        variant="secondary"
                        className={`${actionButtonClassName} flex items-center justify-center gap-3`}
                    >
                        <img src="/gmail.jpg" alt="Google logo" className="h-4 w-4 rounded-sm object-cover" />
                        Google
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        className={`${actionButtonClassName} flex items-center justify-center gap-3`}
                    >
                        <img src="/apple.svg" alt="Apple logo" className="h-4 w-4 object-contain" />
                        Apple
                    </Button>
                </div>
            </form>

            <div className="mt-8 border-t border-zinc-200 pt-6 text-sm text-zinc-600">
                Don’t have an account?{' '}
                <Link to="/auth/signup" className="font-semibold text-zinc-900 transition hover:text-zinc-600">
                    Sign Up
                </Link>
            </div>
        </>
    );
};

export default SignInPage;