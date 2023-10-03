"use client";

import { ExtendedPost } from "@/types/db";
import { FC, useEffect, useRef } from "react";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import axios from "axios";
import { useSession } from "next-auth/react";
import Post from "./Post";

interface PostFeedProps {
  initialPost: ExtendedPost[];
  subpedditName?: string;
}

const PostFeed: FC<PostFeedProps> = ({ initialPost, subpedditName }) => {
  const lastPost = useRef<HTMLElement>(null);
  const { ref, entry } = useIntersection({
    root: lastPost.current,
    threshold: 1,
  });

  const { data: session } = useSession();

  //Query to make a request to our API endopoint
  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ["infinite-query"],
    async ({ pageParam = 1 }) => {
      const query =
        `/api/posts?limit=${INFINITE_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}` +
        (!!subpedditName ? `&subpeddit=${subpedditName}` : "");

      const { data } = await axios.get(query);
      return data as ExtendedPost[];
    },
    {
      getNextPageParam: (_, pages) => {
        return pages.length + 1;
      },
      initialData: {
        pages: [initialPost],
        pageParams: [1],
      },
      
    }
  );

  useEffect(() => {
    if(entry?.isIntersecting){
      fetchNextPage()
    }
  },[entry, fetchNextPage])

  const posts = data?.pages.flatMap((page) => page) ?? initialPost;

  return (
    <ul className="flex flex-col col-span-2 space-y-6">
      {posts.map((post, index) => {
        const totalVotes = post.votes.reduce((accurate, vote) => {
          if (vote.type === "UP") return accurate + 1;
          if (vote.type === "DOWN") return accurate - 1;
          return accurate;
        }, 0);

        const currentVote = post.votes.find(
          (vote) => vote.userId == session?.user.id
        );

        if (index === posts.length - 1) {
          return (
            <li key={post.id} ref={ref}>
              <Post
                commentAmt={post.comments.length}
                post={post}
                subpedditName={post.subpeddit.name}
                votesAmt={totalVotes}
                currentVote={currentVote}
              />
            </li>
          );
        } else {
          return (
            <Post
              commentAmt={post.comments.length}
              post={post}
              subpedditName={post.subpeddit.name}
              votesAmt={totalVotes}
              currentVote={currentVote}
            />
          );
        }
      })}
    </ul>
  );
};

export default PostFeed;
