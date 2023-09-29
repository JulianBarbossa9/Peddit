import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PostValidator } from "@/lib/validators/post";
import { z } from "zod";

export async function POST(req: Request){
  try {
    const session = await getAuthSession()

    if(!session?.user){
      return new Response('Unauthorized', { status: 401 })
    }

    const body = await req.json()

    const { subpedditId, title, content } = PostValidator.parse(body)

    const subcritionExist = await db.subscription.findFirst({
      where: {
        subpedditId,
        userId: session.user.id
      }
    })

    if(!subcritionExist){
      return new Response('Subscribe to post.', { status: 400 })
    }

    await db.post.create({
      data: {
        title,
        content,
        authorId: session.user.id,
        subpedditId,
      }
    })

    return new Response('Ok Post is created')

  } catch (error) {
    if ( error instanceof z.ZodError){
      return new Response('Invalid request data passed', { status: 422 })
    }

    return new Response ('Could not post to this Subpeddit at this time, pleasy try again later.', { status: 500})
  
  }
}