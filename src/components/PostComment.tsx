"use client"

import { Comment, CommentVote, User } from "@prisma/client";
import { FC, useRef } from "react";
import UserAvatar from "./UserAvatar";
import { formatTimeToNow } from "@/lib/utils";


type ExtendedComment = Comment & {
  author: User
  votes: CommentVote[]
}

interface PostCommentProps {
  comment: ExtendedComment
}
 
const PostComment: FC<PostCommentProps> = ({ comment } ) => {
  
  
  const commentRef = useRef<HTMLDivElement>(null)

  return (  
    <div ref={commentRef} className="flex flex-col">
      <div className="flex items-center">
        <UserAvatar 
          user={{
            name: comment.author.name || null,
            image: comment.author.image || null
          }}
          className="w-6 h-6"
        />

        <div className="flex ml-2 items-center gap-x-2">
          <p className="text-sm font medium text-gray-900">
            u/{comment.author.username}
          </p>
          <p className="max-h-40 truncate text-xs text-zinc-500">
            {formatTimeToNow( new Date(comment.createdAt))}
          </p>
        </div>
      </div>

      <p className="text-sm text-zinc-900 mt-2"> 
          { comment.text }
      </p>
    </div>
  );
}
 
export default PostComment;