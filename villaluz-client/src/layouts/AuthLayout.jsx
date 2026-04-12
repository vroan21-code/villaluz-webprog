import { Outlet } from  'react-router-dom';
import AnoAI from '../components/ui/animated-shader-background';

const AuthLayout = () => {
    return (
        <section className="min-h-screen bg-zinc-100 text-zinc-900">
            <div className="grid min-h-screen w-full lg:grid-cols-[1fr_0.95fr]">
                <div className="relative flex items-center justify-center border-b-2 border-zinc-900 bg-black p-8 sm:p-10 lg:border-b-0 lg:border-r-2 lg:border-zinc-900 lg:p-16">
                    <div className="absolute inset-0 overflow-hidden">
                        <AnoAI />
                    </div>
                    <div className="relative flex w-full max-w-[28rem] items-center justify-center px-4 py-6">
                        <div className="relative aspect-square w-full rounded-[2.5rem] bg-black/90 shadow-2xl shadow-black/30">
                            <span className="pointer-events-none absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 bg-white/15" />
                            <span className="pointer-events-none absolute top-1/2 left-0 w-full h-1 -translate-y-1/2 bg-white/15" />
                            <img
                                src="/logoo.jpg"
                                alt="Logo"
                                className="absolute inset-0 h-full w-full rounded-[2.5rem] object-cover"
                            />
                        </div>
                    </div>
                </div>

                <main className="flex items-center bg-zinc-50 px-6 py-10 sm:px-10 lg:px-16">
                    <div className="mx-auto w-full max-w-md">
                        <Outlet />
                    </div>
                </main>
            </div>
        </section>
    );
};

export default AuthLayout;