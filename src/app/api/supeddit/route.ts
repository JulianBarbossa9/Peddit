import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubpedditValidator } from "@/lib/validators/subpeddit";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    //check if the user is logged
    const session = await getAuthSession()
    if (!session?.user) {
      return new Response('Unauthorized' , { status: 401})
    }

    const body = await req.json()
    // with this we check if the body have the shape that we need
    const { name } = SubpedditValidator.parse(body)
    const subpedditExist = await db.subpeddit.findFirst({
      where: {
        name,
      }
    })

    if (subpedditExist){
      return new Response('This supeddit already exist', { status: 409})
    }

    const subpeddit = await db.subpeddit.create({
      data: {
        name,
        creatorId: session.user.id
      }
    })

    //with this we subscribed to the subpeddit becouse you created a subpeddit
    await db.subscription.create({
      data: {
        userId: session.user.id,
        subpedditId: subpeddit.id
      }
    })

    return new Response (subpeddit.name, { status: 201 })

  } catch (error) {
    if ( error instanceof z.ZodError){
      return new Response(error.message, { status: 422 })
    }

    return new Response ('Could not create subpeddit', { status: 500})
  }
}