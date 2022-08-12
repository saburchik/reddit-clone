import Image from 'next/image'
import React from 'react'
import {
	MenuIcon,
	ChevronDownIcon,
	HomeIcon,
	SearchIcon,
} from '@heroicons/react/solid'
import {
	BellIcon,
	ChatIcon,
	GlobeIcon,
	PlusIcon,
	SparklesIcon,
	SpeakerphoneIcon,
	VideoCameraIcon,
} from '@heroicons/react/outline'
import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'

function Header() {
	const { data: session } = useSession()
	return (
		<div className='sticky top-0 z-50 flex items-center bg-white px-4 py-2 shadow-sm'>
			<div className='relative h-10 w-20 flex-shrink-0 cursor-pointer'>
				<Link href='/' passHref>
					<Image
						objectFit='contain'
						src='https://links.papareact.com/fqy'
						layout='fill'
						alt='logo'
					/>
				</Link>
			</div>
			<div className='mx-7 flex cursor-pointer items-center rounded p-2 outline-hidden outline-1 outline-gray-300 hover:outline xl:min-w-[300px]'>
				<HomeIcon className='h-5 w-5' />
				<p className='ml-2 hidden flex-1 lg:inline'>Home</p>
				<ChevronDownIcon className='h-5 w-5' />
			</div>

			{/* Search box */}
			<form className='flex flex-1 items-center space-x-2 rounded-sm border border-gray-200 bg-gray-100 px-3 py-1 hover:border-blue-500'>
				<label htmlFor='header-search-bar'>
					<SearchIcon className='h-6 w-6 text-gray-400' />
				</label>
				<input
					className='flex-1 bg-transparent outline-none'
					type='text'
					id='header-search-bar'
					placeholder='Search Reddit'
				/>
				<button type='submit' hidden />
			</form>

			<div className='mx-5 hidden items-center space-x-2 text-gray-500 lg:inline-flex'>
				<SparklesIcon className='icon' />
				<GlobeIcon className='icon' />
				<VideoCameraIcon className='icon' />
				<hr className='h-10 border border-gray-100' />
				<ChatIcon className='icon' />
				<BellIcon className='icon' />
				<PlusIcon className='icon' />
				<SpeakerphoneIcon className='icon' />
			</div>
			<div className='ml-5 flex items-center lg:hidden'>
				<MenuIcon className='icon' />
			</div>

			{/* Sign in / Sign out */}
			{session ? (
				<button
					onClick={() => signOut()}
					className='hidden cursor-pointer items-center space-x-2 rounded-sm border border-gray-100 p-2 hover:border-gray-300 lg:flex'
				>
					<div className='relative h-5 w-5 flex-shrink-0'>
						<Image
							objectFit='contain'
							src='https://links.papareact.com/23l'
							layout='fill'
							alt='icon'
						/>
					</div>
					<div className='flex-1 text-xs'>
						<p className='truncate'>{session?.user?.name}</p>
						<p className='text-gray-400'>1 Karma</p>
					</div>
					<ChevronDownIcon className='h-5 flex-shrink-0 text-gray-400' />
				</button>
			) : (
				<button
					onClick={() => signIn()}
					className='hidden cursor-pointer items-center space-x-2 border border-gray-100 p-2 lg:flex'
				>
					<div className='relative h-5 w-5 flex-shrink-0'>
						<Image
							objectFit='contain'
							src='https://links.papareact.com/23l'
							layout='fill'
							alt='icon'
						/>
					</div>
					<p className='text-gray-400'>Sign In</p>
				</button>
			)}
		</div>
	)
}

export default Header
