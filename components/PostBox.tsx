import { useSession } from 'next-auth/react'
import React, { FC, useState } from 'react'
import Avatar from './Avatar'
import { LinkIcon, PhotographIcon } from '@heroicons/react/outline'
import { useForm } from 'react-hook-form'
import { useMutation } from '@apollo/client'
import { ADD_POST, ADD_SUBREDDIT } from '../graphql/mutations'
import client from '../apollo-client'
import { GET_ALL_POSTS, GET_SUBREDDIT_BY_TOPIC } from '../graphql/queries'
import toast from 'react-hot-toast'

type FormData = {
  postTitle: string
  postBody: string
  postImage: string
  subreddit: string
}
type Props = {
  subreddit?: string
}

const PostBox: FC<Props> = ({ subreddit }) => {
  const { data: session } = useSession()
  const [addPost] = useMutation(ADD_POST, {
    refetchQueries: [GET_ALL_POSTS, 'getPostList'],
  })
  const [addSubreddit] = useMutation(ADD_SUBREDDIT)
  const [imgBox, setImgBox] = useState<boolean>()
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>()

  const onSubmit = handleSubmit(async (formData) => {
    console.log(formData)
    const notification = toast.loading('Creating new post...')
    try {
      // Query for the subreddit topic...
      const {
        data: { getSubredditListByTopic },
      } = await client.query({
        query: GET_SUBREDDIT_BY_TOPIC,
        variables: {
          topic: subreddit || formData.subreddit,
        },
      })

      const subredditExists = getSubredditListByTopic.length > 0

      if (!subredditExists) {
        // create a post
        console.log('Subreddit is new! => creating a new subreddit')
        const {
          data: { insertSubreddit: newSubreddit },
        } = await addSubreddit({
          variables: {
            topic: formData.subreddit,
          },
        })
        console.log(`Creating post...`, formData)
        const image = formData.postImage || ''
        const {
          data: { insertPost: newPost },
        } = await addPost({
          variables: {
            body: formData.postBody,
            image: image,
            subreddit_id: newSubreddit.id,
            title: formData.postTitle,
            username: session?.user?.name,
          },
        })
        console.log('New post added:', newPost)
      } else {
        // use existing subreddit
        console.log('Using existing subreddit!!!')
        console.log(getSubredditListByTopic)
        const image = formData.postImage || ''
        const {
          data: { insertPost: newPost },
        } = await addPost({
          variables: {
            body: formData.postBody,
            image: image,
            subreddit_id: getSubredditListByTopic[0].id,
            title: formData.postTitle,
            username: session?.user?.name,
          },
        })
        console.log('New post added:', newPost)
      }
      // After the post has been added
      setValue('postBody', '')
      setValue('postImage', '')
      setValue('postTitle', '')
      setValue('subreddit', '')
      toast.success('New Post Created!', { id: notification })
    } catch (error) {
      toast.error('Whoops, something went wrong!', {
        id: notification,
      })
      console.log(error)
    }
  })

  return (
    <form
      onSubmit={onSubmit}
      className='sticky top-20 z-50 rounded-md border border-gray-300 bg-white p-2'
    >
      <div className='flex items-center space-x-3'>
        <Avatar />
        <input
          {...register('postTitle', { required: true })}
          className='flex-1 rounded-md bg-gray-50 p-2 pl-5 outline-none'
          type='text'
          disabled={!session}
          placeholder={
            session
              ? subreddit
                ? `Create a post in /r${subreddit}`
                : 'Create a post by entering a title'
              : 'Sign in to post'
          }
        />
        <PhotographIcon
          onClick={() => setImgBox(!imgBox)}
          className={`h-6 cursor-pointer text-gray-300 ${
            imgBox && 'text-blue-300'
          }`}
        />
        <LinkIcon className='h-6 text-gray-300' />
      </div>

      {!!watch('postTitle') && (
        <div className='flex flex-col py-2'>
          <article className='flex items-center px-2'>
            <h1 className='min-w-[90px]'>Body:</h1>
            <input
              className='m-2 flex-1 bg-blue-50 p-2 outline-none'
              {...register('postBody')}
              type='text'
              placeholder='Text (Optinal)'
            />
          </article>

          {!subreddit && (
            <article className='flex items-center px-2'>
              <h1 className='min-w-[90px]'>Subreddit:</h1>
              <input
                className='m-2 flex-1 bg-blue-50 p-2 outline-none'
                {...register('subreddit', { required: true })}
                type='text'
                placeholder='i.e. Sport'
              />
            </article>
          )}

          {imgBox && (
            <article className='flex items-center px-2'>
              <h1 className='min-w-[90px]'>Image URL:</h1>
              <input
                className='m-2 flex-1 bg-blue-50 p-2 outline-none'
                {...register('postImage')}
                type='text'
                placeholder='Optional..'
              />
            </article>
          )}
          {/* Error */}
          {Object.keys(errors).length > 0 && (
            <div className='space-y-2 p-2 text-red-500'>
              {errors.postTitle?.type === 'required' && (
                <p>A post title is required</p>
              )}
              {errors.subreddit?.type === 'required' && (
                <p>A subreddit is required</p>
              )}
            </div>
          )}
          {!!watch('postTitle') && (
            <button
              type='submit'
              className='w-full rounded-full bg-blue-400 p-2 text-white'
            >
              Create Post
            </button>
          )}
        </div>
      )}
    </form>
  )
}

export default PostBox
