import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubpedditSubscriptionValidator } from "@/lib/validators/subpeddit";
import { z } from "zod";

export async function POST(req: Request){
  try {
    const session = await getAuthSession()

    if(!session?.user){
      return new Response('Unauthorized', { status: 401 })
    }

    const body = await req.json()

    const { subpedditId } = SubpedditSubscriptionValidator.parse(body)
    const subcritionExist = await db.subscription.findFirst({
      where: {
        subpedditId,
        userId: session.user.id
      }
    })

    if(!subcritionExist){
      return new Response('You are not subscribed to this supeddit.', { status: 400 })
    }

    //Check if user is the creator of the subpeddit
    const subpedditOwn = await db.subpeddit.findFirst({
      where: {
        id: subpedditId,
        creatorId: session.user.id
      }
    })

    if (subpedditOwn) {
      return new Response('You cant unsubsribe from your own subpeddit', {
        status: 400,
      })
    }
    await db.subscription.delete({
      where: {
        userId_subpedditId: {
          subpedditId,
          userId: session.user.id
        }
      }
    })

    return new Response(subpedditId)

  } catch (error) {
    if ( error instanceof z.ZodError){
      return new Response('Invalid request data passed', { status: 422 })
    }

    return new Response ('Could not unsubscribed to this Subpeddit.', { status: 500})
  
  }
}