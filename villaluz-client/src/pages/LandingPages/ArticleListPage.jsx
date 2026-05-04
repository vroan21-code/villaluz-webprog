import Button from '../../components/Button.jsx';
import ArticleList from '../../components/ArticleList.jsx';
import articles from '../../data/article-content.js'; 
import AnoAI from '../../components/ui/animated-shader-background';

const ArticleListPage = () => {
    return (
        <div className="flex w-full flex-col gap-6">
            <section className="relative overflow-hidden border-y-2 border-zinc-900 bg-black px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                <div className="absolute inset-0 opacity-80">
                    <AnoAI />
                </div>
                <div className="relative z-10">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-300">
                    Articles
                </p>
                <h1 className="max-w-xl text-3xl font-bold leading-tight text-zinc-50 sm:text-4xl">
                    Explore my featured articles and insights
                </h1>
                <p className="mt-4 max-w-lg text-sm leading-7 text-zinc-200 sm:text-base">
                    A collection of articles where I share ideas, lessons, and perspectives about web development, design, student projects, and technology.
                </p>
                <div className="mt-6">
                    <Button to="/">Back Home</Button>
                </div>
                </div>
            </section>

            <section className="border-y-2 border-zinc-900 bg-zinc-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                <div className="mb-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
                        Feature Articles
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-zinc-900">Article card grid</h2>
                </div>

                <ArticleList articles={articles} />
            </section>
        </div>
    );
}

export default ArticleListPage;