import { Link } from 'react-router-dom';
import Button from '../../components/Button.jsx';

const inputClasses='mt-2 w-full rounded-xl border border-zinc-300 bg-zinc-100 px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:bg-zinc-50';

const actionButtonClassName='w-full rounded-xl py-3 text-[11px] tracking-[0.28em]';

const SignUpPage = () => {
    return (
        <>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">Get Started</h1>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
                Create an account to continue.
            </p>

            <form className="mt-8 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <label htmlFor="first-name" className="text-sm font-medium text-zinc-700">
                            First Name
                        </label>
                        <input
                            id="first-name"
                            type="text"
                            placeholder="Enter your first name"
                            autoComplete="given-name"
                            className={inputClasses}
                        />
                    </div>
                    <div>
                        <label htmlFor="last-name" className="text-sm font-medium text-zinc-700">
                            Last Name
                        </label>
                        <input
                            id="last-name"
                            type="text"
                            placeholder="Enter your last name"
                            autoComplete="family-name"
                            className={inputClasses}
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="signup-email" className="text-sm font-medium text-zinc-700">
                        Email
                    </label>
                    <input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        autoComplete="email"
                        className={inputClasses}
                    />
                </div>

                <div>
                    <label htmlFor="signup-password" className="text-sm font-medium text-zinc-700">
                        Password
                    </label>
                    <input
                        id="signup-password"
                        type="password"
                        placeholder="Create a password"
                        autoComplete="new-password"
                        className={inputClasses}
                    />
                </div>

                <Button type="submit" variant="primary" className={actionButtonClassName}>
                    Create Account
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
                Already have an account?{' '}
                <Link to="/auth/signin" className="font-semibold text-zinc-900 transition hover:text-zinc-600">
                    Sign In
                </Link>
            </div>
        </>
    );
};

export default SignUpPage;