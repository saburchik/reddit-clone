import { ChevronUpIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import React from 'react'
import Avatar from './Avatar'

type Props = {
	topic: string
	index: number
}

const SubredditRow = ({ index, topic }: Props) => {
	return (
		<li className='flex items-center justify-between space-x-2 border-t-[1px] bg-white px-4 last:rounded-b'>
			<Link href={`/subreddit/${topic}`}>
				<a className='flex items-center gap-1 py-1'>
					<p>{index + 1}</p>
					<ChevronUpIcon className='h-4 w-4 flex-shrink-0 text-green-400' />
					<Avatar seed={`/subreddit/${topic}`} />
					<p className='flex-1 truncate'>r/{topic}</p>
				</a>
			</Link>
			<Link href={`/subreddit/${topic}`}>
				<a className='cursor-pointer rounded-full bg-blue-500 px-3 text-white duration-200 hover:bg-blue-600'>
					View
				</a>
			</Link>
		</li>
	)
}

export default SubredditRow
