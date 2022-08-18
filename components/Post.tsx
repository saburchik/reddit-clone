import {
	ArrowDownIcon,
	ArrowUpIcon,
	BookmarkIcon,
	ChatAltIcon,
	DotsHorizontalIcon,
	GiftIcon,
	ShareIcon,
} from '@heroicons/react/solid'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import TimeAgo from 'react-timeago'
import Avatar from './Avatar'
import { Jelly } from '@uiball/loaders'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { useMutation, useQuery } from '@apollo/client'
import { GET_ALL_VOTES_BY_POST_ID } from '../graphql/queries'
import { ADD_VOTE } from '../graphql/mutations'
import Image from 'next/image'

type Props = {
	post: Post
	removeStyles?: boolean
}
const Post = ({ post, removeStyles }: Props) => {
	const [vote, setVote] = useState<boolean | undefined>(false)
	const { data: session } = useSession()
	const { data, loading, error } = useQuery(GET_ALL_VOTES_BY_POST_ID, {
		variables: {
			post_id: post?.id,
		},
	})

	const [addVote] = useMutation(ADD_VOTE, {
		refetchQueries: [GET_ALL_VOTES_BY_POST_ID, 'getVotesByPostId'],
	})

	const upVote = async (isUpvote: boolean) => {
		if (!session) {
			toast("❗ You'll need to sing in to Vote!")
			return
		}
		if (vote && isUpvote) return
		if (vote === false && !isUpvote) return
		console.log('voting...', isUpvote)

		await addVote({
			variables: {
				post_id: post.id,
				username: session?.user?.name,
				upvote: isUpvote,
			},
		})
	}

	useEffect(() => {
		const votes: Vote[] = data?.getVotesByPostId
		const vote = votes?.find(
			vote => vote.username == session?.user?.name
		)?.upvote

		setVote(vote)
	}, [data])

	const displayVotes = (data: any) => {
		const votes: Vote[] = data?.getVotesByPostId
		const displayNum = votes?.reduce(
			(total, vote) => (vote.upvote ? (total += 1) : (total -= 1)),
			0
		)
		if (votes?.length === 0) return 0
		if (displayNum === 0) {
			return votes[0]?.upvote ? +1 : -1
		}
		return displayNum
	}

	if (!post) {
		return (
			<div className='flex w-full items-center justify-center p-10 text-xl'>
				<Jelly size={50} color='#FF4501' />
			</div>
		)
	}

	const stl: string = removeStyles
		? 'flex cursor-default rounded-md border border-gray-300 bg-white shadow-sm'
		: 'flex cursor-pointer rounded-md border border-gray-300 bg-white shadow-sm hover:border hover:border-gray-600'

	return (
		<Link href={`/post/${post?.id}`} passHref>
			<a className={stl}>
				<div className='flex flex-col items-center justify-start space-y-1 rounded-l-md bg-gray-50 p-4 text-gray-400'>
					<ArrowUpIcon
						onClick={() => upVote(true)}
						className={`voteButtons hover:text-red-400 ${
							vote && 'text-red-400'
						}`}
					/>
					<p className='text-bold text-xs text-black'>{displayVotes(data)}</p>
					<ArrowDownIcon
						onClick={() => upVote(false)}
						className={`voteButtons hover:text-blue-400 ${
							vote === false && 'text-blue-400'
						}`}
					/>
				</div>
				<div className='w-full p-3 pb-1'>
					<div className='flex items-center space-x-2'>
						<Avatar seed={post.subreddit[0]?.topic} />
						<p className='text-xs text-gray-400'>
							<Link href={`/subreddit/${post.subreddit[0]?.topic}`} passHref>
								<span className='cursor-pointer font-bold text-black hover:text-blue-400 hover:underline'>
									r/{post.subreddit[0]?.topic}{' '}
								</span>
							</Link>
							• Posted by{' '}
							<span className='cursor-pointer hover:underline'>
								u/{post.username}
							</span>{' '}
							<TimeAgo date={post.created_at} />
						</p>
					</div>
					<article className='py-4'>
						<h2 className='text-xl font-semibold'>{post.title}</h2>
						<p className='mt-2 text-sm font-light'>{post.body}</p>
					</article>
					{post.image ? (
						<div className='relative top-0 left-0 w-full'>
							<Image
								priority
								layout='responsive'
								src={post.image}
								alt='image'
								height={300}
								width={500}
							/>
						</div>
					) : null}
					<ul className='flex space-x-4 pt-1 text-gray-400'>
						<li className='postButtons'>
							<ChatAltIcon className='h-6 w-6' />
							<p className=''>{post.comments.length} Comments</p>
						</li>
						<li className='postButtons'>
							<GiftIcon className='h-6 w-6' />
							<p className='hidden sm:inline'>Award</p>
						</li>
						<li className='postButtons'>
							<ShareIcon className='h-6 w-6' />
							<p className='hidden sm:inline'>Share</p>
						</li>
						<li className='postButtons'>
							<BookmarkIcon className='h-6 w-6' />
							<p className='hidden sm:inline'>Save</p>
						</li>
						<li className='postButtons'>
							<DotsHorizontalIcon className='h-6 w-6' />
						</li>
					</ul>
				</div>
			</a>
		</Link>
	)
}

export default Post
