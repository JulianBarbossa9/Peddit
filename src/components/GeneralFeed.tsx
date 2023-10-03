import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/config'
import { db } from '@/lib/db'
import React from 'react'
import PostFeed from './PostFeed'

const GeneralFeed = async () => {
  
  const post = await db.post.findMany({
    orderBy: {
      createdAt: 'asc'
    },
    include: {
      votes: true,
      author: true,
      comments: true,
      subpeddit: true
    },
    take: INFINITE_SCROLLING_PAGINATION_RESULTS,
  })
  
  return <PostFeed initialPost={post}/>
}

export default GeneralFeed