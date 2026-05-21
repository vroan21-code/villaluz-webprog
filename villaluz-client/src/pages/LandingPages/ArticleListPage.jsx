import { useEffect, useState } from 'react';
import Button from '../../components/Button.jsx';
import ArticleList from '../../components/ArticleList.jsx';
import AnoAI from '../../components/ui/animated-shader-background';
import { fetchArticles } from '../../services/articleService';

const ArticleListPage = () => {
	const [articles, setArticles] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		let cancelled = false;

		(async () => {
			try {
				const { data } = await fetchArticles();
				if (!cancelled) setArticles(data.articles ?? []);
			} catch {
				if (!cancelled) setError('Could not load articles. Make sure the server is running.');
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();

		return () => {
			cancelled = true;
		};
	}, []);

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
						A collection of articles where I share ideas, lessons, and perspectives about web
						development, design, student projects, and technology.
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

				{loading && (
					<p className="text-sm text-zinc-600">Loading articles…</p>
				)}
				{error && (
					<p className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
						{error}
					</p>
				)}
				{!loading && !error && <ArticleList articles={articles} />}
			</section>
		</div>
	);
};

export default ArticleListPage;
