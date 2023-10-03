import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/config'
import { db } from '@/lib/db'
import React from 'react'
import PostFeed from './PostFeed'
import { getAuthSession } from '@/lib/auth'

const CustomFeed = async () => {
  
  const session = await getAuthSession()

  const followedComunities = await db.subscription.findMany({
    where: {
      userId: session?.user.id,
    },
    include: {
      subpeddit: true
    }
  })

  const post = await db.post.findMany({
    where: {
      subpeddit: {
        name: {
          in: followedComunities.map(({subpeddit}) => subpeddit.name)
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      votes: true,
      author: true,
      comments: true,
      subpeddit: true
    },
    take: INFINITE_SCROLLING_PAGINATION_RESULTS
  })

  return <PostFeed initialPost={post}/>
}

export default CustomFeed