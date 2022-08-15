import { useQuery } from '@apollo/client'
import type { NextPage } from 'next'
import Head from 'next/head'
import Feed from '../components/Feed'
import PostBox from '../components/PostBox'
import SubredditRow from '../components/SubredditRow'
import { GET_SUBREDDITS_WITH_LIMIT } from '../graphql/queries'

const Home: NextPage = () => {
	const { data } = useQuery(GET_SUBREDDITS_WITH_LIMIT, {
		variables: {
			limit: 10,
		},
	})

	const subreddits: Subreddit[] = data?.getSubredditListLimit

	return (
		<div className='my-5 mx-auto max-w-5xl px-4'>
			<Head>
				<title>Reddit Clone</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<PostBox />
			<div className='flex'>
				<Feed />
				<div className='sticky top-[4rem] ml-5 mt-5 hidden h-fit min-w-[300px] rounded-md border border-gray-300 bg-white lg:inline'>
					<div className='linear relative z-20 h-[80px] w-full bg-communities bg-cover bg-center'>
						<h3 className='text-md absolute bottom-1 mb-1 px-4 font-bold text-white'>
							Top Communities
						</h3>
					</div>
					<ol>
						{subreddits?.map((subreddit, i) => (
							<SubredditRow
								key={subreddit.id}
								topic={subreddit.topic}
								index={i}
							/>
						))}
						<div className='p-4'>
							<button className='w-full rounded-3xl bg-blue-500 py-1 font-bold text-white duration-200 hover:bg-blue-600'>
								View All
							</button>
						</div>
					</ol>
				</div>
			</div>
		</div>
	)
}

export default Home
