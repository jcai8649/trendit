import React from "react";
import Link from "next/link";
import { Post, Comment } from "../types";
import parse from "html-react-parser";
import PostCard from "./PostCard";
import { UserFeedData } from "../types";

interface UserFeedProps {
  data: UserFeedData;
  mutate: (data?: any, shouldRevalidate?: boolean) => Promise<any>;
}

export default function UserFeed({ data, mutate }: UserFeedProps) {
  return (
    <div className="w-full px-4 md:w-160 md:p-0">
      {data.submissions.length > 0 ? (
        data.submissions.map((submission: any) => {
          if (submission.type === "Post") {
            const post: Post = submission;
            return (
              <PostCard key={post.identifier} post={post} mutate={mutate} />
            );
          } else {
            const comment: Comment = submission;
            return (
              <div
                key={comment.identifier}
                className="flex my-4 bg-white rounded"
              >
                <div className="flex-shrink-0 w-10 py-4 text-center bg-gray-200 rounded-l">
                  <i className="text-gray-500 fas fa-comment-alt fa-xs" />
                </div>
                <div className="w-full p-2">
                  <p className="mb-2 text-xs text-gray-500">
                    {comment.username}

                    <span> commented on </span>
                    <Link href={comment.post.url}>
                      <a className="font-semibold cursor-pointer hover:underline">
                        {comment.post.title}
                      </a>
                    </Link>
                    <span className="mx-1">•</span>
                    <Link href={`/r/${comment.post.subName}`}>
                      <a className="text-black cursor-pointer hover:underline">
                        /r/{comment.post.subName}
                      </a>
                    </Link>
                  </p>
                  <hr />
                  <p className="break-all">{parse(comment.body)}</p>
                </div>
              </div>
            );
          }
        })
      ) : (
        <div className="relative">
          {[...Array(6)].map((x, i) => (
            <div
              key={i}
              className="w-full h-24 bg-gray-200 border border-gray-300"
            >
              <div className="flex flex-col w-10 h-full py-3 space-y-8 text-center rounded-l">
                <i className="text-gray-400 icon-arrow-up"></i>
                <i className="text-gray-400 icon-arrow-down"></i>
              </div>
            </div>
          ))}
          <p className="absolute text-center bottom-1/2 inset-x-2">
            hmm... u/{data.user.username} hasn't posted anything
          </p>
        </div>
      )}
    </div>
  );
}
