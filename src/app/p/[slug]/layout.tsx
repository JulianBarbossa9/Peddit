//This is wrapper component around al page content

import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { FC } from "react";



// interface LayoutProps {
//   children: React.ReactNode
//   params: { slug: string }
// }
 
const Layout = async({
  children,
  params: { slug },
}: {
  children: React.ReactNode,
  params: { slug: string }
}) => {
  
 const session = await getAuthSession()

 const subpeddit = await db.subpeddit.findFirst({
  where:{ name: slug },
  include: {
    post: {
      include: {
        author: true,
        votes: true
      }
    }
  }
 })

 const subscription = session?.user 
 ? undefined 
 : await db.subscription.findFirst({
  where: {
    subpeddit: {
      name: slug
    },
    user: {
      id: session?.user.id,
    }
  }
 })

 const isSubscribed = !!subscription

 if (!subpeddit) return notFound()
 
 //How many members
 const memberCount = db.subscription.count({
  where: {
    subpeddit: {
      name: slug
    }
  }
 })

  return (  
    <div className="sm:container max-w-7 mx-auto h-full pt-12">
      <div className="">
        {/* TODO: Button to take us back */}
        <div className="grid grid-cols-3 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
          <div className="flex flex-col col-span-2 space-y-6">
            { children }
          </div>
            {/* info sidebar */}
            <div className="hidden md:block overflow-hidden h-fil rounded-lg border border-gray-200 order-first md:order-last">
              <div className="px-6 py-4">
                <p className="font-semibold py-3">About p/</p>
              </div>

            </div>
        </div>
      </div>
    </div>
  );
}
 
export default Layout;