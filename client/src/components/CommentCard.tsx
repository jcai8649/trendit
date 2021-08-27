import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import classNames from "classnames";
import parse from "html-react-parser";
import Link from "next/dist/client/link";
import Image from "next/image";

export default function CommentCard({ comment, vote }) {
  dayjs.extend(relativeTime);
  return (
    <div className="flex px-3 my-4 " key={comment.identifier}>
      <div className="w-10 px-1 ml-2 ">
        <Image
          src={comment.user.imageUrl}
          className="rounded-full"
          alt="Sub Image"
          height={(8 * 16) / 4.5}
          width={(8 * 16) / 4.5}
        />
      </div>
      <div className="w-full py-2 pr-2 ml-1 ">
        <p className="mb-1 text-xs leading-none">
          <Link href={`/u/${comment.username}`}>
            <a className="mr-1 font-bold hover:underline">{comment.username}</a>
          </Link>
          <span className="text-gray-600">
            {`• ${dayjs(comment.createdAt).fromNow()}`}
          </span>
        </p>
        <p className="text-sm break-all">{parse(comment.body)}</p>
        {/* Vote section */}
        <div className="flex flex-row flex-shrink-0 w-10 py-2 text-center rounded-l">
          {/* Upvote */}
          <div
            className="w-6 mr-1 text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
            onClick={() => vote(1, comment)}
          >
            <i
              className={classNames("icon-arrow-up", {
                "text-red-500": comment.userVote === 1,
              })}
            ></i>
          </div>
          <p className="m-1 text-xs font-bold">
            {" "}
            {comment.voteScore === 0 ? "Vote" : comment.voteScore}
          </p>
          {/* Downvote */}
          <div
            className="w-6 mx-1 text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600"
            onClick={() => vote(-1, comment)}
          >
            <i
              className={classNames("icon-arrow-down", {
                "text-blue-600": comment.userVote === -1,
              })}
            ></i>
          </div>
        </div>
      </div>
    </div>
  );
}
