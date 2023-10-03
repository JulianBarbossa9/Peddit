import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

export async function GET(req: Request) {
  const url = new URL(req.url);
  

  const session = await getAuthSession();

  let followedCommuntiesIds: string[] = [];

  if (session) {
    const followedCommunties = await db.subscription.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        subpeddit: true,
      },
    });

    followedCommuntiesIds = followedCommunties.map(
      ({ subpeddit }) => subpeddit.id
    );
  }

  //Play with the data if the user is logging
  try {
    const { subpedditName, limit, page } = z.object({
      limit: z.string(),
      page: z.string(),
      subpedditName: z.string().nullish().optional(),
    }).parse({
      subpedditName: url.searchParams.get('subpedditName'),
      limit: url.searchParams.get('limit'),
      page: url.searchParams.get('page'),
    })

    let whereClause = {}

    if(subpedditName){
      whereClause = {
        subpeddit : {
          name: subpedditName
        },
      }
    } else if (session) {
      whereClause = {
        subpeddit : {
          id: {
            in: followedCommuntiesIds
          },
        },
      }
    }

    const posts = await db.post.findMany({
      take: parseInt(limit),
      skip: (parseInt(page) - 1 * parseInt(limit)),
      orderBy : {
        createdAt: 'desc',
      },
      include: {
        subpeddit: true,
        votes: true,
        author: true,
        comments: true,
      },
      where: whereClause,
    })

    return new Response(JSON.stringify(posts))
  } catch (error) {
    if ( error instanceof z.ZodError){
      return new Response('Invalid request data passed', { status: 422 })
    }

    return new Response ('Could not fetch more posts.', { status: 500})
  }
}
