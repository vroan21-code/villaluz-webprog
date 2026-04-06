import { Link } from 'react-router-dom';
import Button from './Button';

const ArticleList = ({ articles }) => {
    if (!articles || articles.length === 0) {
        return (
            <div className="rounded-3xl border-2 border-dashed border-zinc-400 bg-zinc-100 p-8">
                <div className="flex flex-col items-center justify-center text-center">
                    <div className="mb-4">
                        <div className="inline-block p-4 bg-zinc-200 rounded-full">
                            <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m0 0h6" />
                            </svg>
                        </div>
                    </div>
                    <h3 className="text-lg font-semibold text-zinc-600 mb-2">No Articles Yet</h3>
                    <p className="text-sm text-zinc-500">Check back soon for new articles and insights!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {articles.map((article, index) => (
                <article key={article.name} className="rounded-3xl border-2 border-zinc-900 bg-zinc-100 p-4 overflow-hidden">
                    <div className="flex aspect-4/3 items-center justify-center rounded-[1.25rem] bg-zinc-200 overflow-hidden">
                        {article.image ? (
                            <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="h-12 w-12 border-2 border-zinc-300 bg-zinc-100" />
                        )}
                    </div>
                    <p className="mt-4 text-[11px] font-semibold upppercase tracking-[0.24em] text-zinc-500">
                        Article {String(index + 1).padStart(2, '0')}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-zinc-900">{article.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-zinc-600">
                        {article.content[0].substring(0, 150)}...
                    </p>
                    <Link to={`/articles/${article.name}`}>
                        <Button className="mt-4">Read More</Button>
                    </Link>
                </article>
            ))}
        </div>
    );
};

export default ArticleList;