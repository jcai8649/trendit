import React, { useState } from "react";
import classNames from "classnames";
import Link from "next/link";

export default function CommentFeed({ comments, vote, dayjs }) {
  return (
    <>
      <hr />
      {comments?.map((comment) => (
        <div className="flex" key={comment.identifier}>
          {/* Vote section */}
          <div className="flex-shrink-0 w-10 py-2 text-center rounded-l">
            {/* Upvote */}
            <div
              className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
              onClick={() => vote(1, comment)}
            >
              <i
                className={classNames("icon-arrow-up", {
                  "text-red-500": comment.userVote === 1,
                })}
              ></i>
            </div>
            <p className="text-xs font-bold">
              {" "}
              {comment.voteScore === 0 ? "Vote" : comment.voteScore}
            </p>
            {/* Downvote */}
            <div
              className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600"
              onClick={() => vote(-1, comment)}
            >
              <i
                className={classNames("icon-arrow-down", {
                  "text-blue-600": comment.userVote === -1,
                })}
              ></i>
            </div>
          </div>
          <div className="py-2 pr-2">
            <p className="mb-1 text-xs leading-none">
              <Link href={`/u/${comment.username}`}>
                <a className="mr-1 font-bold hover:underline">
                  {comment.username}
                </a>
              </Link>
              <span className="text-gray-600">
                {`${comment.voteScore}
                            points • ${dayjs(comment.createdAt).fromNow()}`}
              </span>
            </p>
            <p>{comment.body}</p>
          </div>
        </div>
      ))}
    </>
  );
}
