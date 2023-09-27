import Editor from "@/components/Editor";
import { Button } from "@/components/ui/Button";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { FC } from "react";

interface SubmitPageProps {
  params: {
    slug: string
  }
}
 
const SubmitPage = async ({ params } : SubmitPageProps) => {
  
  const subpeddit = await db.subpeddit.findFirst({
    where: {
      name: params.slug
    }
  })

  if (!subpeddit) return notFound()
  
  return (  
    <div className="flex flex-col items-start gap-6">
      <div className="border-b border-gray-200 pb-3">
        <div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
          <h3 className="ml-2 mt-2 text-base font-semibold leading-6">
            Create Post
          </h3>
          <p className="ml-2 mt-1 truncate text-sm text-gray-500">in p/{params.slug}</p>
        </div>
      </div>

      {/* form */}

      <Editor />

      <div className="w-full flex justify-end">
        <Button 
          type="submit"
          className="w-full"
          form="subpeddit-post-form" 
        >
          Post

        </Button>
      </div>
    </div>
  );
}
 
export default SubmitPage;