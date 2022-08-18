import { useMutation, useQuery } from '@apollo/client'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { FC } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import TimeAgo from 'react-timeago'
import Avatar from '../../components/Avatar'
import Post from '../../components/Post'
import PostBox from '../../components/PostBox'
import { ADD_COMMENT } from '../../graphql/mutations'
import { GET_POST_BY_POST_ID } from '../../graphql/queries'

type FormData = {
	comment: string
}

const PostPage: FC = () => {
	const router = useRouter()
	const { data: session } = useSession()
	const [addComment] = useMutation(ADD_COMMENT, {
		refetchQueries: [GET_POST_BY_POST_ID, 'getPostListByPostId'],
	})
	const { data } = useQuery(GET_POST_BY_POST_ID, {
		variables: {
			post_id: router.query.postId,
		},
	})
	const post: Post = data?.getPostListByPostId

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		formState: { errors },
	} = useForm<FormData>()

	const onSubmit: SubmitHandler<FormData> = async data => {
		const notification = toast.loading('Posting your comment...')

		await addComment({
			variables: {
				post_id: router.query.postId,
				username: session?.user?.name,
				text: data.comment,
			},
		})
		setValue('comment', '')
		toast.success('Comment Successfully Posted!', {
			id: notification,
		})
	}

	return (
		<div className='my-5 mx-auto max-w-5xl px-4'>
			<Head>
				<title>Subreddit</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<div className='flex'>
				<div className='mt-5 flex w-full flex-col'>
					<Post post={post} removeStyles={true} />
					{post ? (
						<div className='-mt-1 rounded-b-md border border-t-0 border-gray-300 bg-white p-5 pl-16'>
							<p className='mb-2 text-sm'>
								Comment as{' '}
								<span className='text-red-500'>{session?.user?.name}</span>
							</p>

							<form
								className='flex flex-col space-y-2'
								onSubmit={handleSubmit(onSubmit)}
							>
								<textarea
									{...register('comment')}
									disabled={!session}
									className='h-24 rounded-md border border-gray-200 p-2 pl-4 outline-none disabled:bg-gray-50'
									placeholder={
										session
											? 'What are your thoughts?'
											: 'Please sign in to comment'
									}
								/>
								<button
									disabled={!session}
									className='rounded-full bg-red-500 p-3 font-semibold text-white duration-200 hover:bg-red-600 disabled:bg-gray-200'
									type='submit'
								>
									Comment
								</button>
							</form>
						</div>
					) : null}
					{post ? (
						<div className='-my-5 rounded-b-md border border-t-0 border-gray-300 bg-white py-5 px-10'>
							<hr className='py-2' />
							{post?.comments.map(comment => (
								<div
									key={comment.id}
									className='relative flex items-center space-x-2 space-y-5'
								>
									<hr className='absolute top-10 left-7 z-0 h-16 border' />
									<div className='z-50'>
										<Avatar seed={comment.username} />
									</div>
									<div className='flex flex-col'>
										<p className='to-gray-400 py-2 text-xs'>
											<span className='to-gray-600 font-semibold'>
												{comment.username}
											</span>{' '}
											<TimeAgo date={comment.created_at} />
										</p>
										<p>{comment.text}</p>
									</div>
								</div>
							))}
						</div>
					) : null}
				</div>
				<div className='sticky top-[4rem] ml-5 mt-5 hidden h-fit min-w-[300px] rounded-md border border-gray-300 bg-white lg:inline'>
					<div className='linear relative z-20 h-[80px] w-full bg-communities bg-cover bg-center'>
						<h3 className='text-md absolute bottom-1 mb-1 px-4 font-bold text-white'>
							Top Communities
						</h3>
					</div>
					<ol>
						{/* {subreddits?.map((subreddit, i) => (
							<SubredditRow
								key={subreddit.id}
								topic={subreddit.topic}
								index={i}
							/>
						))} */}
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

export default PostPage
