import React from "react";
import classNames from "classnames";
import Link from "next/link";
import dayjs from "dayjs";
import ActionButton from "./ActionButton";
import parse from "html-react-parser";
import LinkConverter from "./LinkConverter";
import relativeTime from "dayjs/plugin/relativeTime";
import { Post } from "../types";

dayjs.extend(relativeTime);

interface PostInfoCardProps {
  vote: (value: number) => void;
  post: Post;
}

export default function PostInfoCard({ vote, post }: PostInfoCardProps) {
  return (
    <div className="flex">
      {/* Vote section */}
      <div className="flex-shrink-0 w-10 py-2 text-center rounded-l">
        {/* Upvote */}
        <div
          className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
          onClick={() => vote(1)}
        >
          <i
            className={classNames("icon-arrow-up", {
              "text-red-500": post.userVote === 1,
            })}
          ></i>
        </div>
        <p className="text-xs font-bold">{post.voteScore}</p>
        {/* Downvote */}
        <div
          className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600"
          onClick={() => vote(-1)}
        >
          <i
            className={classNames("icon-arrow-down", {
              "text-blue-600": post.userVote === -1,
            })}
          ></i>
        </div>
      </div>
      <div className="flex-1 py-2 pr-2">
        <div className="flex items-center">
          <p className="text-xs text-gray-500">
            Posted by
            <Link href={`/u/${post.username}`}>
              <a className="mx-1 hover:underline">/u/{post.username}</a>
            </Link>
            <Link href={post.url}>
              <a className="mx-1 hover:underline">
                {dayjs(post.createdAt).fromNow()}
              </a>
            </Link>
          </p>
        </div>
        {/* Post title */}
        <h1 className="my-1 text-xl font-medium">{post.title}</h1>
        {/* Post body */}
        {post.body && (
          <div className="my-3 text-sm ck-content">
            {post.inputType === "post" ? (
              parse(post.body)
            ) : (
              <LinkConverter url={post.body} />
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex">
          <Link href={post.url}>
            <a>
              <ActionButton>
                <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                <span className="font-bold">{post.commentCount} Comments</span>
              </ActionButton>
            </a>
          </Link>
          <ActionButton>
            <i className="mr-1 fas fa-share fa-xs"></i>
            <span className="font-bold">Share</span>
          </ActionButton>
          <ActionButton>
            <i className="mr-1 fas fa-bookmark fa-xs"></i>
            <span className="font-bold">Save</span>
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
