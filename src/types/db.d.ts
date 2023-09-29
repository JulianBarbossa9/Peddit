import { Comment, Post, Subpeddit, User, Vote } from "@prisma/client"

export type ExtendedPost = Post & {
  subpeddit : Subpeddit
  votes: Vote[]
  author: User
  comments: Comment[]
}