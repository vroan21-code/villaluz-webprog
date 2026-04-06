import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <div className='space-y-6'>
      <section className='rounded-3xl border-2 border-zinc-900 bg-white p-6 shadow-sm'>
        <p className='text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500'>
          Home
        </p>
        <h1 className='mt-4 text-3xl font-bold text-zinc-900'>Welcome to Roan's Article</h1>
        <p className='mt-4 text-sm leading-7 text-zinc-600'>
          Explore my thoughts, experiences, and insights as an IT student—covering web development, design, and real-world projects.
        </p>
        <div className='mt-6'>
          <Link to='/articles' className='inline-flex rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700'>
            Browse Articles
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage
