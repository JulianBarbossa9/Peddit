import MiniCreatePost from "@/components/MiniCreatePost"
import PostFeed from "@/components/PostFeed"
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config"
import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { notFound } from "next/navigation"

interface subpedditPageProps {
  params: {
    slug: string
  }
}
 
const subpedditPage = async ( { params }: subpedditPageProps) => {
  const { slug } = params

  const session = await getAuthSession()

  const subpeddit = await db.subpeddit.findFirst({
    where: {
      name: slug,
    },
    include : {
      //this is a JOIN
      post: {
        include: {
          author: true,
          votes: true,
          comments: true,
          subpeddit: true,
        },

        // take: INFINITE_SCROLLING_PAGINATION_RESULTS
        take: 9
      }
    },
  })

  if (!subpeddit) return notFound()
  
  
  return (  
    <div>
      <h1 className="font-bold text-3xl md:text-4xl h-14">
        p/{ subpeddit.name }
      </h1>
      <MiniCreatePost session={session}/>
      <PostFeed subpedditName={subpeddit.name} initialPost={subpeddit.post}/>
    </div>
  );
}
 
export default subpedditPage;