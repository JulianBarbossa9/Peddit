//This is wrapper component around all page content

import SubscribeLeaveToogle from "@/components/SubscribeLeaveToogle";
import { buttonVariants } from "@/components/ui/Button";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { format } from "date-fns";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FC } from "react";


const Layout = async ({
  children,
  params: { slug },
}: {
  children: React.ReactNode;
  params: { slug: string };
}) => {
  
  const session = await getAuthSession();
  const subpeddit = await db.subpeddit.findFirst({
    where: { name: slug },
    include: {
      post: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  });

  /**
   * check if session no is null or undefined and sessiion.user exist this = false
   * check if session is null or undefined = true
   */
  const subscription = !session?.user
    ? undefined
    : await db.subscription.findFirst({
        where: {
          subpeddit: {
            name: slug,
          },
          user: {
            id: session?.user.id,
          },
        },
      });

  // this value is used !! to convert a value into a boolean
  const isSubscribed = !!subscription;

  if (!subpeddit) return notFound();

  //How many members are
  const memberCount = db.subscription.count({
    where: {
      subpeddit: {
        name: slug,
      },
    },
  });


  return (
    <div className="sm:container max-w-7 mx-auto h-full pt-12">
      <div className="">
        {/* TODO: Button to take us back */}
        <div className="grid grid-cols-3 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
          <div className="flex flex-col col-span-2 space-y-6">{children}</div>
          {/* info sidebar */}
          <div className="hidden md:block overflow-hidden h-fil rounded-lg border border-gray-200 order-first md:order-last">
            <div className="px-6 py-4">
              <p className="font-semibold py-3">About p/{subpeddit.name}</p>
            </div>

            <dl className="divide-y divide-gray-100 px-6 py-4 text-sm leading-6 bg-white">
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Created</dt>
                <dd className="text-gray-700">
                  <time dateTime={subpeddit.createdAt.toDateString()}>
                    {format(subpeddit.createdAt, "d MMM, yyyy")}
                  </time>
                </dd>
              </div>

              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Members</dt>
                <dd className="text-gray-700">
                  <div className="text-gray-700">{memberCount}</div>
                </dd>
              </div>
              {subpeddit.creatorId === session?.user.id ? (
                <div className="flex justify-between gap-x-4 py-3">
                  <p className="text-gray-500">You Create This Community</p>
                </div>
              ) : null}

              {subpeddit.creatorId !== session?.user.id ? (
                <SubscribeLeaveToogle
                  subpedditName={subpeddit.name}
                  subpedditId={subpeddit.id}
                  isSubscribed={isSubscribed}
                />
              ) : null}

              <Link
                className={buttonVariants({
                  variant: 'outline',
                  className: 'w-full mb-6'
                })}
                href={`p/${slug}/submit`}
              >
                Create Post
              </Link>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
