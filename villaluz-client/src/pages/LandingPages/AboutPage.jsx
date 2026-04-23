import Button from '../../components/Button.jsx';
import AnoAI from '../../components/ui/animated-shader-background';

const AboutPage = () => {
    return (
        <div className="flex w-full flex-col gap-6">
            <section className="relative overflow-hidden border-y-2 border-zinc-900 bg-black px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                <div className="absolute inset-0 opacity-80">
                    <AnoAI />
                </div>
                <div className="relative z-10 grid gap-8 lg:grid-cols-2 lg:items-center">
                    <div className="rounded-3xl border-2 border-dashed border-zinc-700 bg-zinc-900/70 p-6">
                        <div className="flex min-h-72 items-center justify-center rounded-[1.25rem] bg-zinc-200">
                            <img
                                src="/logo.jpg"
                                className="h-90 w-full rounded-2xl object-cover"
                            />
                        </div>
                    </div>

                    <div>
                        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-300">
                            About Me
                        </p>
                        <h1 className="max-w-xl text-3xl font-bold leading-tight text-zinc-50 sm:text-4xl">
                            Passionate Developer and Designer Crafting Digital Solutions
                        </h1>
                        <p className="mt-4 max-w-lg text-sm leading-7 text-zinc-200 sm:text-base">
                            With a background in mobile and web development, I specialize in turning ideas into user-friendly products. From sustainable fashion apps to secure transportation systems, I focus on thoughtful design and clean code to create impactful experiences.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <Button to="/" variant="primary">
                                Back Home
                            </Button>
                            <Button to="/articles">View My Article</Button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-y-2 border-zinc-900 bg-zinc-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                <div className="mb-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
                        Profile Overview
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-zinc-900">
                        Quick summary blocks
                    </h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-3xl border-2 border-zinc-900 bg-zinc-100 p-5">
                        <p className="text-2xl font-bold text-zinc-900">5</p>
                        <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
                            Live Projects
                        </p>
                    </div>
                    <div className="rounded-3xl border-2 border-zinc-900 bg-zinc-100 p-5">
                        <p className="text-2xl font-bold text-zinc-900">10</p>
                        <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
                            Technologies
                        </p>
                    </div>
                    <div className="rounded-3xl border-2 border-zinc-900 bg-zinc-100 p-5">
                        <p className="text-2xl font-bold text-zinc-900">User-First Design</p>
                        <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
                            Approach
                        </p>
                    </div>
                    <div className="rounded-3xl border-2 border-zinc-900 bg-zinc-100 p-5">
                        <p className="text-2xl font-bold text-zinc-900">Building Real-World Apps</p>
                        <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
                            Current Focus
                        </p>
                    </div>
                </div>
            </section>

            <section className="border-y-2 border-zinc-900 bg-zinc-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                <div className="mb-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">Featured Projects</p>
                    <h2 className="mt-2 text-2xl font-semibold text-zinc-900">Project Highlights</h2>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    <article className="rounded-3xl border-2 border-zinc-900 bg-zinc-100 p-4">
                        <div className="aspect-4/3 overflow-hidden rounded-[1.25rem] bg-zinc-200">
                            <img src="/featurecard1.png" alt="Degraded Clothing Website" className="h-full w-full object-cover" />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold text-zinc-900">Degraded Clothing Website</h3>
                        <p className="mt-2 text-sm text-zinc-600">Degraded is your statement of style and sustainable fashion experience, built for modern e-commerce.</p>
                    </article>
                    <article className="rounded-3xl border-2 border-zinc-900 bg-zinc-100 p-4">
                        <div className="aspect-4/3 overflow-hidden rounded-[1.25rem] bg-zinc-200">
                            <img src="/featurecard2.png" alt="SafeRoute Website" className="h-full w-full object-cover" />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold text-zinc-900">SafeRoute Website</h3>
                        <p className="mt-2 text-sm text-zinc-600">SafeRoute centralizes route safety analytics to help teams monitor and optimize transportation security operations.</p>
                    </article>
                </div>
            </section>

            <section className="border-y-2 border-zinc-900 bg-zinc-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
                            Section Flow
                        </p>
                        <h2 className="mt-2 text-2xl font-semibold text-zinc-900">Stacked content wireframe</h2>
                        
                        <div className="mt-6 space-y-4">
                            <article className="rounded-3xl border-2 border-zinc-900 bg-zinc-100 p-5">
                                <h3 className="text-lg font-semibold text-zinc-900">Intro Block</h3>
                                <p className="mt-3 text-sm leading-6 text-zinc-600">
                                    I'm Roan James Villaluz, a developer from National University with a passion for blending design and technology. I started coding to solve real-world problems and now create apps that make life easier.
                                </p>
                            </article>

                            <article className="rounded-3xl border-2 border-zinc-900 bg-zinc-100 p-5">
                                <h3 className="text-lg font-semibold text-zinc-900">Experience Block</h3>
                                <p className="mt-3 text-sm leading-6 text-zinc-600">
                                    As a student, I’ve worked on several academic and personal projects such as e-commerce systems and safety-focused apps. I use technologies like JavaScript and React while continuously improving my development skills.
                                </p>
                            </article>

                            <article className="rounded-3xl border-2 border-zinc-900 bg-zinc-100 p-5">
                                <h3 className="text-lg font-semibold text-zinc-900">Details Block</h3>
                                <p className="mt-3 text-sm leading-6 text-zinc-600">
                                    I focus on building mobile and web applications that are simple and user-friendly. Through my projects, I practice creating solutions that address real-life problems while improving both my design and technical skills.
                                </p>
                            </article>

                        </div>
                    </div>

                    <div className="rounded-3xl border-2 border-zinc-900 bg-zinc-100 p-5">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">Skills & Tools</p>
                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                            <div className="flex aspect-square items-center justify-center rounded-[1.25rem] bg-zinc-200">
                                <img src="/react.webp" alt="React" className="h-50 w-50 object-contain" />
                            </div>
                            <div className="flex aspect-square items-center justify-center rounded-[1.25rem] bg-zinc-200">
                                <img src="/nodeee.webp" alt="Node.js" className="h-50 w-50 object-contain" />
                            </div>
                            <div className="flex aspect-square items-center justify-center rounded-[1.25rem] bg-zinc-200">
                                <img src="/github.png" alt="GitHub" className="h-50 w-50 object-contain" />
                            </div>
                            <div className="flex aspect-square items-center justify-center rounded-[1.25rem] bg-zinc-200">
                                <img src="/figmaa.svg" alt="Figma" className="h-50 w-50 object-contain" />
                            </div>
                        </div>
                        <Button className="mt-5">Download Resume</Button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;