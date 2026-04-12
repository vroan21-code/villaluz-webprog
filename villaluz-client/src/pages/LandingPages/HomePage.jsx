import Button from '../../components/Button.jsx';

const kpiItems = [
  { value: '5', label: 'Published Projects' },
  { value: '7', label: 'Programming Languages' },
  { value: 'Mobile and Web', label: 'Specializations' },
  { value: 'National University', label: 'University' },
];

const features = [
  {
    title: 'Degraded Clothing Website',
    description: 'Degraded is more than just a clothing brand its a statement of style comfort, and self-expression.',
    image: '/featurecard1.png',
    button: { label: 'View Project', to: '/about' },
  },
  {
    title: 'SafeRoute Website',
    description: 'Secure route management and reporting system. Monitor, analyze, and manage your transportation safety data all in one place.',
    image: 'featurecard2.png',
    button: { label: 'View Project', to: '/about' },
  },
  {
    title: 'WearHub Mobile App',
    description: 'WearHub is a mobile app that connects users to affordable, pre-loved clothing through a simple and user-friendly platform, making it easy to discover unique styles while promoting sustainable fashion.',
    button: { label: 'View Project', to: '/about' },
  },
];

const HomePage = () => {
    return (
        <div className="flex w-full flex-col gap-6">
            <section className="border-y-2 border-zinc-900 bg-zinc-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                <div className="grid gap-8 lg:grid-cols-2 lg:items-center">

                    <div>
                        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
                            Hello, I’m Roan James  Villaluz
                        </p>
                        <h1 className="max-w-xl text-3xl font-bold leading-tight text-zinc-900 sm:text-4xl">
                            Crafting warm digital experiences with thoughtful design, one story at a time.
                        </h1>
                        <p className="mt-4 max-w-lg text-sm leading-7 text-zinc-600 sm:text-base">
                            I help teams and individuals turn ideas into clear, well-designed products using research, simple writing, and good visuals..
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <Button to="/about" variant="primary">Learn My Story</Button>
                            <Button to="/articles" variant="secondary">Latest Articles</Button>
                        </div>
                    </div>

                    <div className="rounded-3xl border-2 border-zinc-900 bg-zinc-100 p-6">
                        <img
                            src="/logoo.jpg"
                            alt="Villaluz brand example"
                            className="h-90 w-full rounded-2xl object-cover"
                        />
                    </div>
                </div>
            </section>

            <section className="border-y-2 border-zinc-900 bg-zinc-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                <div className="mb-6">
                    <h2 className="mt-2 text-2xl font-semibold text-zinc-900">Background</h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {kpiItems.map((item) => (
                        <div key={item.label} className="rounded-3xl border-2 border-zinc-900 bg-zinc-100 p-5">
                            <p className="text-2xl font-bold text-zinc-900">{item.value}</p>
                            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">{item.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="border-y-2 border-zinc-900 bg-zinc-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                <div className="mb-6">
                    <h2 className="mt-2 text-2xl font-semibold text-zinc-900">My Created Projects</h2>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    {features.map((feature) => (
                        <article key={feature.title} className="rounded-3xl border-2 border-zinc-900 bg-zinc-100 p-4">
                            <div className="aspect-4/3 overflow-hidden rounded-[1.25rem] bg-zinc-200">
                                {feature.image ? (
                                    <img
                                        src={feature.image}
                                        alt={feature.title}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center">
                                        <p className="text-2xl font-semibold text-zinc-700">✨</p>
                                    </div>
                                )}
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-zinc-900">{feature.title}</h3>
                            <p className="mt-3 text-sm leading-6 text-zinc-600">{feature.description}</p>
                            <Button className="mt-4" to={feature.button.to} variant="primary">{feature.button.label}</Button>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HomePage;