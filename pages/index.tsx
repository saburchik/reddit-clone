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
		<div className='my-7 mx-auto max-w-5xl'>
			<Head>
				<title>Reddit Clone</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<PostBox />
			<div className='flex'>
				<Feed />
				<article className='sticky top-[5rem] ml-5 mt-5 hidden h-fit min-w-[300px] rounded-md border border-gray-300 bg-white p-4 lg:inline'>
					<h3 className='text-md mb-1 font-bold'>Top Communities</h3>
					<div>
						{subreddits?.map((subreddit, i) => (
							<SubredditRow
								key={subreddit.id}
								topic={subreddit.topic}
								index={i}
							/>
						))}
					</div>
				</article>
			</div>
		</div>
	)
}

export default Home
