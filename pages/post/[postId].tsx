import { useQuery } from '@apollo/client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { FC } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import Post from '../../components/Post'
import { GET_POST_BY_POST_ID } from '../../graphql/queries'

type FormData = { comment: string }

const PostPage: FC = () => {
  const router = useRouter()
  const { data: session } = useSession()
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

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    return console.log(data)
  }

  return (
    <div className='mx-auto my-7 max-w-5xl'>
      <Post post={post}></Post>
      <div className='-mt-1 rounded-b-md border border-t-0 border-gray-300 bg-white p-5 pl-16'>
        <p className='text-sm'>
          Comment as <span className='text-red-500'>{session?.user?.name}</span>
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
              session ? 'What are your thoughts?' : 'Please sign in to comment'
            }
          />
          <button
            className='rounded-full bg-red-500 p-3 font-semibold text-white disabled:bg-gray-200'
            type='submit'
          >
            Comment
          </button>
        </form>
      </div>
    </div>
  )
}

export default PostPage
