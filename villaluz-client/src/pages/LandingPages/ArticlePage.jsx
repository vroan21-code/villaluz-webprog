import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Button from '../../components/Button.jsx';
import { fetchArticleByName } from '../../services/articleService';
import { resolveImageUrl } from '../../utils/imageUrl';

function ArticlePage() {
	const { name } = useParams();
	const [article, setArticle] = useState(null);
	const [loading, setLoading] = useState(true);
	const [notFound, setNotFound] = useState(false);

	useEffect(() => {
		let cancelled = false;
		setLoading(true);
		setNotFound(false);
		setArticle(null);

		(async () => {
			try {
				const { data } = await fetchArticleByName(name);
				if (!cancelled) setArticle(data);
			} catch (err) {
				if (!cancelled && err.response?.status === 404) setNotFound(true);
				else if (!cancelled) setNotFound(true);
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();

		return () => {
			cancelled = true;
		};
	}, [name]);

	if (loading) {
		return (
			<div className="flex w-full flex-col gap-6">
				<section className="border-y-2 border-zinc-900 bg-zinc-50 px-4 py-12 sm:px-6 lg:px-8">
					<p className="text-center text-zinc-600">Loading article…</p>
				</section>
			</div>
		);
	}

	if (notFound || !article) {
		return (
			<div className="flex w-full flex-col gap-6">
				<section className="border-y-2 border-zinc-900 bg-zinc-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
					<div className="mx-auto max-w-3xl py-12 text-center">
						<div className="mb-6">
							<h2 className="mb-4 text-6xl font-bold text-zinc-300">?</h2>
							<h1 className="mb-3 text-4xl font-bold text-zinc-900">Article Not Found</h1>
							<p className="mb-8 text-lg text-zinc-600">
								The article you&apos;re looking for doesn&apos;t exist or may have been removed.
							</p>
						</div>
						<Button to="/articles" className="mt-6">
							Back to Articles
						</Button>
					</div>
				</section>
			</div>
		);
	}

	return (
		<div className="flex w-full flex-col gap-6">
			<section className="border-y-2 border-zinc-900 bg-zinc-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
				<div className="max-w-3xl">
					<div className="mb-4">
						<Button to="/articles">Back to Articles</Button>
					</div>
					<p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
						Article
					</p>
					<h1 className="text-3xl font-bold leading-tight text-zinc-900 sm:text-4xl">
						{article.title}
					</h1>
					<p className="mt-2 text-sm text-zinc-500">
						{article.name
							.split('-')
							.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
							.join(' ')}
					</p>
				</div>
			</section>

			<section className="border-y-2 border-zinc-900 bg-zinc-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
				<div className="mx-auto max-w-3xl">
					<div className="mb-8 flex aspect-4/3 items-center justify-center overflow-hidden rounded-[1.25rem] border-2 border-zinc-900 bg-zinc-200">
						{article.image ? (
							<img
								src={resolveImageUrl(article.image)}
								alt={article.title}
								className="h-full w-full object-cover"
							/>
						) : (
							<div className="h-24 w-24 border-2 border-zinc-300 bg-zinc-100" />
						)}
					</div>

					<div className="prose prose-sm max-w-none space-y-4 text-zinc-700">
						{article.content.map((paragraph, index) => (
							<p
								key={index}
								className="text-base leading-7 whitespace-pre-wrap text-zinc-700"
							>
								{paragraph}
							</p>
						))}
					</div>

					<div className="mt-8 border-t-2 border-zinc-900 pt-6">
						<Button to="/articles">Back to Articles</Button>
					</div>
				</div>
			</section>
		</div>
	);
}

export default ArticlePage;
